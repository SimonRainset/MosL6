"use client";

import {useEffect, useState} from "react";
import "./style.css";
import TextField from '@mui/material/TextField';

const rootCSS = {
    margin: 0,
};

const backgroundPicUrl = "/images/login_signup_bg.png";
const logoPicUrl = "/images/example_logo.png";

export default function Login() {
    return (
        <div className="login-page">
            <div className="left-wrapper">
                <div className="header">
                    <img src={logoPicUrl} height="76%" />
                    <div className="logoText">MoreThanChat</div>
                </div>
                <div className="page-title">欢迎回来！</div>
                <div className="page-description">登录以加入AI创意社群、创造并分享属于你的AI设计！</div>
                <TextField
                    sx={{
                        '& .MuiInputLabel-root.Mui-focused': {
                            color:'#DC4065'
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':{
                            border: 'solid 2px #DC4065'
                        },
                        '& .MuiOutlinedInput-root':{
                            borderRadius: '16px'
                        }
                    }}
                    required
                    id="login-email-phone"
                    label="邮箱地址或手机号码"
                    className="login-input"
                />
                <TextField
                    sx={{
                        '& .MuiInputLabel-root.Mui-focused': {
                            color:'#DC4065'
                        },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline':{
                            border: 'solid 2px #DC4065'
                        },
                        '& .MuiOutlinedInput-root':{
                            borderRadius: '16px'
                        }
                    }}
                    required
                    id="login-password"
                    type="password"
                    label="密码"
                    className="login-input"
                />
                <div className="forget-password">忘记密码？</div>
                <button className="login-button">立即登录</button>
                <div className="signup-wrapper">
                    <div className="signup-plaintext">没有账号？</div>
                    <div className="signup-link">点此注册</div>
                </div>
            </div>
            <div className="right-wrapper">
                <img src={backgroundPicUrl} height="100%" width="100%"/>
            </div>
        </div>
    );
}
