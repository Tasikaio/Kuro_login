#!/usr/bin/env python3
"""
库街区登录Web服务
提供前端页面和API接口
"""

import os
import json
import uuid
from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from loguru import logger

# 导入现有的登录功能
import sys
import os

# 添加src目录到Python路径
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from core.sms_send import SMS, random_device
from geetest_captcha.geetest import GeeTest

# 配置静态文件目录
static_dir = Path(__file__).parent.parent.parent / 'web' / 'static'
templates_dir = Path(__file__).parent.parent.parent / 'web' / 'templates'

app = Flask(__name__, static_folder=str(static_dir), static_url_path='/static')
CORS(app)  # 允许跨域请求

# 加载环境配置
def load_config():
    """加载环境配置"""
    # 尝试从.env文件加载配置
    env_file = Path(__file__).parent.parent.parent / 'config' / 'env' / '.env'
    if env_file.exists():
        from dotenv import load_dotenv
        load_dotenv(env_file)
    
    # 配置参数
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    PORT = int(os.environ.get('PORT', 5000))
    HOST = os.environ.get('HOST', '127.0.0.1')
    ANDROID_CAPTCHA_ID = os.environ.get('ANDROID_CAPTCHA_ID', '3f7e2d848ce0cb7e7d019d621e556ce2')
    
    return DEBUG, PORT, HOST, ANDROID_CAPTCHA_ID

# 加载配置
DEBUG, PORT, HOST, ANDROID_CAPTCHA_ID = load_config()

class KuroLoginService:
    """登录服务类"""
    
    def __init__(self):
        self.active_sessions = {}
    
    def send_sms_code(self, phone_number):
        """发送短信验证码"""
        try:
            # 获取验证码安全码
            sec_code = GeeTest(ANDROID_CAPTCHA_ID).get_sec_code()
            device_id = random_device()
            
            # 创建SMS实例
            sms = SMS(phone_number, device_id, sec_code)
            
            # 发送验证码
            result = sms.send_sms_code()
            
            # 保存会话信息
            session_id = str(uuid.uuid4())
            self.active_sessions[session_id] = {
                'phone_number': phone_number,
                'device_id': device_id,
                'sec_code': sec_code,
                'sms': sms
            }
            
            return {
                'success': True,
                'session_id': session_id,
                'message': result.get('msg', '验证码发送成功')
            }
            
        except Exception as e:
            logger.error(f"发送验证码失败: {str(e)}")
            return {
                'success': False,
                'message': f'验证码发送失败: {str(e)}'
            }
    
    def login(self, session_id, sms_code):
        """使用验证码登录"""
        try:
            # 获取会话信息
            session = self.active_sessions.get(session_id)
            if not session:
                return {
                    'success': False,
                    'message': '会话已过期，请重新获取验证码'
                }
            
            sms = session['sms']
            
            # 执行登录
            login_response = sms.sdk_login(sms_code)
            
            # 获取用户数据
            token = login_response["token"]
            user_id = login_response["userId"]
            login_data = sms.get_login_data(token=token)
            
            # 构建返回数据
            result_data = {
                "token": token,
                "userId": user_id,
                "roleId": login_data["roleId"],
                "roleName": login_data["roleName"],
                "serverId": login_data["serverId"],
                "deviceCode": str(uuid.uuid4()),
                "distinctId": str(uuid.uuid4())
            }
            
            # 清理会话
            del self.active_sessions[session_id]
            
            return {
                'success': True,
                'data': result_data
            }
            
        except Exception as e:
            logger.error(f"登录失败: {str(e)}")
            return {
                'success': False,
                'message': f'登录失败: {str(e)}'
            }

# 创建服务实例
login_service = KuroLoginService()

@app.route('/')
def index():
    """主页面"""
    # 使用绝对路径确保文件正确加载
    templates_dir = Path(__file__).parent.parent.parent / 'web' / 'templates'
    return send_from_directory(str(templates_dir), 'index.html')

# Flask会自动处理/static/路径下的静态文件请求

@app.route('/api/send_sms', methods=['POST'])
def api_send_sms():
    """发送短信验证码API"""
    try:
        data = request.get_json()
        phone_number = data.get('phoneNumber')
        
        if not phone_number:
            return jsonify({
                'success': False,
                'message': '手机号码不能为空'
            }), 400
        
        # 验证手机号格式
        if not is_valid_phone(phone_number):
            return jsonify({
                'success': False,
                'message': '请输入有效的手机号码'
            }), 400
        
        result = login_service.send_sms_code(phone_number)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"API错误 - 发送短信: {str(e)}")
        return jsonify({
            'success': False,
            'message': '服务器内部错误'
        }), 500

@app.route('/api/login', methods=['POST'])
def api_login():
    """登录API"""
    try:
        data = request.get_json()
        session_id = data.get('session_id')
        sms_code = data.get('smsCode')
        
        if not session_id or not sms_code:
            return jsonify({
                'success': False,
                'message': '缺少必要参数'
            }), 400
        
        # 验证验证码格式
        if not is_valid_sms_code(sms_code):
            return jsonify({
                'success': False,
                'message': '请输入6位数字验证码'
            }), 400
        
        result = login_service.login(session_id, sms_code)
        
        if result['success']:
            return jsonify(result)
        else:
            return jsonify(result), 400
            
    except Exception as e:
        logger.error(f"API错误 - 登录: {str(e)}")
        return jsonify({
            'success': False,
            'message': '服务器内部错误'
        }), 500

@app.route('/api/health')
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'healthy',
        'service': 'kuro-login-web'
    })

def is_valid_phone(phone):
    """验证手机号格式"""
    import re
    pattern = r'^1[3-9]\d{9}$'
    return re.match(pattern, phone) is not None

def is_valid_sms_code(code):
    """验证短信验证码格式"""
    import re
    pattern = r'^\d{6}$'
    return re.match(pattern, code) is not None

if __name__ == '__main__':
    logger.info(f"启动库街区登录Web服务...")
    logger.info(f"访问地址: http://{HOST}:{PORT}")
    
    app.run(
        host=HOST,
        port=PORT,
        debug=DEBUG,
        threaded=True
    )