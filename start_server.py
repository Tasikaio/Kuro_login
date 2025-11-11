#!/usr/bin/env python3
"""
库街区登录Web服务启动脚本
"""

import os
import sys
import subprocess
import webbrowser
from time import sleep

def check_dependencies():
    """检查依赖是否已安装"""
    try:
        import flask
        import flask_cors
        print("✓ Flask依赖已安装")
        return True
    except ImportError:
        print("✗ Flask依赖未安装")
        return False

def install_dependencies():
    """安装Web应用依赖"""
    print("正在安装Web应用依赖...")
    
    try:
        # 安装requirements_web.txt中的依赖
        result = subprocess.run([
            sys.executable, '-m', 'pip', 'install', '-r', 'requirements_web.txt'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✓ 依赖安装成功")
            return True
        else:
            print(f"✗ 依赖安装失败: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"✗ 安装过程中出现错误: {str(e)}")
        return False

def start_server():
    """启动Web服务器"""
    print("正在启动Web服务器...")
    
    try:
        # 启动Flask应用
        process = subprocess.Popen([
            sys.executable, 'src/api/app.py'
        ], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
        
        # 等待服务器启动
        sleep(3)
        
        # 检查进程是否在运行
        if process.poll() is None:
            print("✓ Web服务器启动成功")
            print("\n访问地址: http://127.0.0.1:5000")
            print("按 Ctrl+C 停止服务器\n")
            
            # 自动打开浏览器
            try:
                webbrowser.open('http://127.0.0.1:5000')
                print("✓ 已自动打开浏览器")
            except:
                print("⚠ 无法自动打开浏览器，请手动访问 http://127.0.0.1:5000")
            
            # 等待用户中断
            try:
                process.wait()
            except KeyboardInterrupt:
                print("\n正在停止服务器...")
                process.terminate()
                process.wait()
                print("✓ 服务器已停止")
        else:
            stdout, stderr = process.communicate()
            print(f"✗ 服务器启动失败: {stderr}")
            
    except Exception as e:
        print(f"✗ 启动过程中出现错误: {str(e)}")

def main():
    """主函数"""
    print("=" * 50)
    print("库街区登录Web服务启动器")
    print("=" * 50)
    
    # 检查依赖
    if not check_dependencies():
        print("\n需要安装Web应用依赖")
        if install_dependencies():
            print("\n依赖安装完成，重新检查...")
            if not check_dependencies():
                print("✗ 依赖检查仍然失败，请手动安装依赖")
                return
        else:
            print("✗ 依赖安装失败，请手动运行: pip install -r requirements_web.txt")
            return
    
    # 启动服务器
    print("\n" + "=" * 50)
    start_server()

if __name__ == "__main__":
    main()