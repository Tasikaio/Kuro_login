// 库街区登录前端逻辑
class KuroLoginApp {
    constructor() {
        this.currentSessionId = null;
        this.currentTokenData = null; // 临时存储Token数据，页面刷新后丢失
        this.init();
    }

    init() {
        this.bindEvents();
        // 移除检查本地存储的Token，改为仅在内存中临时存储
    }

    bindEvents() {
        // 表单提交事件
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // 发送验证码事件
        document.getElementById('sendCodeBtn').addEventListener('click', () => {
            this.sendSMSCode();
        });

        // 复制Token事件
        document.getElementById('copyTokenBtn').addEventListener('click', () => {
            this.copyToken();
        });

        // 下载JSON文件事件
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadJSON();
        });

        // 重新登录事件
        document.getElementById('newLoginBtn').addEventListener('click', () => {
            this.showLoginSection();
        });

        // Toast关闭事件
        document.querySelectorAll('.toast-close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.toast').style.display = 'none';
            });
        });

        // 输入验证事件
        this.setupInputValidation();
    }

    setupInputValidation() {
        const phoneInput = document.getElementById('phoneNumber');
        const codeInput = document.getElementById('smsCode');

        phoneInput.addEventListener('input', () => {
            this.validatePhoneNumber();
        });

        codeInput.addEventListener('input', () => {
            this.validateSMSCode();
        });
    }

    validatePhoneNumber() {
        const phone = document.getElementById('phoneNumber').value;
        const errorElement = document.getElementById('phoneError');
        
        if (!phone) {
            errorElement.textContent = '';
            return false;
        }

        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            errorElement.textContent = '请输入有效的手机号码';
            return false;
        }

        errorElement.textContent = '';
        return true;
    }

    validateSMSCode() {
        const code = document.getElementById('smsCode').value;
        const errorElement = document.getElementById('codeError');
        
        if (!code) {
            errorElement.textContent = '';
            return false;
        }

        const codeRegex = /^\d{6}$/;
        if (!codeRegex.test(code)) {
            errorElement.textContent = '请输入6位数字验证码';
            return false;
        }

        errorElement.textContent = '';
        return true;
    }

    async sendSMSCode() {
        const phone = document.getElementById('phoneNumber').value;
        const sendBtn = document.getElementById('sendCodeBtn');

        if (!this.validatePhoneNumber()) {
            this.showError('请输入有效的手机号码');
            return;
        }

        try {
            this.setButtonLoading(sendBtn, true, '发送中...');
            
            // 调用后端API发送验证码
            const response = await this.callBackendAPI('/send_sms', {
                phoneNumber: phone
            });

            if (response.success) {
                this.showSuccess('验证码发送成功');
                this.startCountdown();
                // 保存session_id用于后续登录
                this.currentSessionId = response.session_id;
            } else {
                throw new Error(response.message || '验证码发送失败');
            }

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setButtonLoading(sendBtn, false, '获取验证码');
        }
    }

    async handleLogin() {
        const phone = document.getElementById('phoneNumber').value;
        const code = document.getElementById('smsCode').value;
        const loginBtn = document.getElementById('loginBtn');

        if (!this.validatePhoneNumber() || !this.validateSMSCode()) {
            this.showError('请检查输入信息');
            return;
        }

        if (!this.currentSessionId) {
            this.showError('请先获取验证码');
            return;
        }

        try {
            this.setButtonLoading(loginBtn, true);
            
            // 调用后端API进行登录
            const response = await this.callBackendAPI('/login', {
                session_id: this.currentSessionId,
                smsCode: code
            });

            if (response.success && response.data) {
                this.showTokenSection(response.data);
                this.showSuccess('Token获取成功');
                // 清空session_id
                this.currentSessionId = null;
            } else {
                throw new Error(response.message || '登录失败');
            }

        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setButtonLoading(loginBtn, false);
        }
    }

    async callBackendAPI(endpoint, data) {
        const API_BASE = window.location.origin;
        
        try {
            const response = await fetch(`${API_BASE}/api${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }

            const result = await response.json();
            
            if (!result.success) {
                throw new Error(result.message || '请求失败');
            }

            return result;

        } catch (error) {
            // 如果是网络错误，检查后端服务是否运行
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                throw new Error('无法连接到服务器，请确保后端服务正在运行');
            }
            throw error;
        }
    }

    showTokenSection(tokenData) {
        // 隐藏登录区域，显示Token区域
        const loginSection = document.getElementById('loginSection');
        const tokenSection = document.getElementById('tokenSection');
        
        if (loginSection) loginSection.style.display = 'none';
        if (tokenSection) tokenSection.style.display = 'block';

        // 填充Token数据
        const tokenValue = document.getElementById('tokenValue');
        const userId = document.getElementById('userId');
        const roleId = document.getElementById('roleId');
        const roleName = document.getElementById('roleName');
        const serverId = document.getElementById('serverId');
        
        if (tokenValue) tokenValue.textContent = tokenData.token || '';
        if (userId) userId.textContent = tokenData.userId || '';
        if (roleId) roleId.textContent = tokenData.roleId || '';
        if (roleName) roleName.textContent = tokenData.roleName || '';
        if (serverId) serverId.textContent = tokenData.serverId || '';

        // 仅在内存中临时存储，页面刷新后丢失
        this.currentTokenData = tokenData;
    }

    showLoginSection() {
        const tokenSection = document.getElementById('tokenSection');
        const loginSection = document.getElementById('loginSection');
        const loginForm = document.getElementById('loginForm');
        const phoneError = document.getElementById('phoneError');
        const codeError = document.getElementById('codeError');
        
        if (tokenSection) tokenSection.style.display = 'none';
        if (loginSection) loginSection.style.display = 'block';
        
        // 清空表单和内存中的Token数据
        if (loginForm) loginForm.reset();
        if (phoneError) phoneError.textContent = '';
        if (codeError) codeError.textContent = '';
        this.currentTokenData = null;
        this.currentSessionId = null;
    }

    copyToken() {
        const tokenElement = document.getElementById('tokenValue');
        if (!tokenElement) {
            this.showError('Token元素未找到');
            return;
        }
        
        const token = tokenElement.textContent;
        if (!token) {
            this.showError('没有可复制的Token');
            return;
        }
        
        navigator.clipboard.writeText(token).then(() => {
            this.showSuccess('Token已复制到剪贴板');
        }).catch(() => {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = token;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showSuccess('Token已复制到剪贴板');
        });
    }

    downloadJSON() {
        if (!this.currentTokenData) {
            this.showError('没有可下载的Token数据，请先登录获取Token');
            return;
        }

        const dataStr = JSON.stringify(this.currentTokenData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `kuro_token_${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(link.href);
        this.showSuccess('JSON文件下载成功');
    }

    startCountdown() {
        const sendBtn = document.getElementById('sendCodeBtn');
        let countdown = 60;

        sendBtn.disabled = true;
        
        const timer = setInterval(() => {
            sendBtn.textContent = `重新发送(${countdown})`;
            countdown--;

            if (countdown < 0) {
                clearInterval(timer);
                sendBtn.disabled = false;
                sendBtn.textContent = '获取验证码';
            }
        }, 1000);
    }

    setButtonLoading(button, isLoading, loadingText = '处理中...') {
        if (!button) return;
        
        const btnText = button.querySelector('.btn-text');
        const spinner = button.querySelector('.loading-spinner');

        if (isLoading) {
            button.disabled = true;
            if (btnText) btnText.textContent = loadingText;
            if (spinner) spinner.style.display = 'inline-block';
        } else {
            button.disabled = false;
            if (btnText) btnText.textContent = '登录获取Token';
            if (spinner) spinner.style.display = 'none';
        }
    }

    showError(message) {
        const toast = document.getElementById('errorToast');
        const messageElement = document.getElementById('errorMessage');
        
        if (!toast || !messageElement) {
            console.error('Toast元素未找到');
            return;
        }
        
        messageElement.textContent = message;
        toast.style.display = 'flex';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    showSuccess(message) {
        const toast = document.getElementById('successToast');
        const messageElement = document.getElementById('successMessage');
        
        if (!toast || !messageElement) {
            console.error('Toast元素未找到');
            return;
        }
        
        messageElement.textContent = message;
        toast.style.display = 'flex';
        
        // 3秒后自动隐藏
        setTimeout(() => {
            toast.style.display = 'none';
        }, 3000);
    }

    // 移除本地存储相关方法，改为仅在内存中临时存储

    // 工具函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    generateMockToken() {
        return 'kuro_' + Math.random().toString(36).substr(2, 32) + '_' + Date.now().toString(36);
    }

    generateUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new KuroLoginApp();
});

// 添加一些全局错误处理
window.addEventListener('error', (event) => {
    console.error('全局错误:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('未处理的Promise拒绝:', event.reason);
});