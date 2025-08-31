"use client";

import Link from "next/link";
import loginStyles from '../../css/login.module.css';
import { useRouter } from "next/navigation";
import { useMember } from "@/app/layout";
import {
    useState,
    useEffect
} from 'react';

export default function Login() {
    const memberContext = useMember();
    const { isLoggedIn, setIsLoggedIn } = memberContext;
    console.log('login', isLoggedIn);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    async function handleLoginClick(e) {
        e.preventDefault();
        console.log(username, password);
        // const formData = new FormData();
        // formData.append('username', username);
        // formData.append('password', password);
        // console.log(formData);
        // if (!username && !password) {
        //     return alert('Username and password are required');
        // }
        // if (!username) {
        //     return alert('Username is required');
        // }
        // if (!password) {
        //     return alert("Password is required");
        // }
        function validateUsername(username) {
            // Check if username has at least 5 characters
            if (username.length < 5) {
                return false;
            }
            // Check if username contains at least one letter
            return /[a-zA-Z]/.test(username);
        }
        if (!validateUsername(username)) {
            return alert('Username must be at least 5 characters long and contain at least one letter.')
        }

        function validatePassword(password) {
            // Regular expression to check:
            // At least 8 characters
            // At least 1 uppercase letter
            // At least 1 lowercase letter
            // At least 1 number
            const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;
            return passwordRegex.test(password);
        }
        if (!validatePassword(password)) {
            return alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.")
        }

        const response = await fetch('/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: formData
            // body: JSON.stringify(formData)
            body: JSON.stringify({
                username,
                password
            })
        })
        const resData = await response.json();
        console.log(resData);
        console.log(username, password);
        if (resData.success) {
            console.log("success")
            console.log(username, password);
            localStorage.setItem('token', resData.token);
            setIsLoggedIn(true);
            router.replace('/client');
        } else {
            setIsLoggedIn(false);
            alert(resData.msg || 'Login failed. Please try again.');
        }
    }

    return (
        <div
            className={loginStyles.mainContent}
            style={{ display: isLoggedIn ? 'none' : 'block' }}
        >
            <form onSubmit={handleLoginClick}>
                <div className={loginStyles.loginWrapper}>
                    <div className={loginStyles.welcomeMsg}>Welcome to use Tuck Shop Restocking System</div>
                    <div className={loginStyles.loginForm}>
                        <div className={loginStyles.inputWrapper}>
                            <div>
                                <div className={loginStyles.labelWrapper}>
                                    <label htmlFor="username">Username:</label>
                                </div>
                                <div className={loginStyles.usernameInput}>
                                    <input id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" required />
                                </div>
                            </div>
                            <div>
                                <div className={loginStyles.labelWrapper}>
                                    <label htmlFor="password">Password:</label>
                                </div>
                                <div className={loginStyles.passwordInput}>
                                    <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" required />
                                </div>
                            </div>
                        </div>
                        <div className={loginStyles.loginButtonWrapper}>
                            <input type="submit" value="Login" />
                        </div>
                        <div className={loginStyles.registerPrompt}>
                            Don't have an account?{' '}
                            <span><Link href="/users/register">Register</Link></span>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    )
}