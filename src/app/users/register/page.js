"use client";

import Link from "next/link";
import registerStyles from '../../css/register.module.css';
import { useRouter } from 'next/navigation';
import {
    useState,
    useEffect
} from "react";
import { useMember } from "@/app/layout";

export default function Register() {
    const memberContext = useMember();
    const { isLoggedIn, setIsLoggedIn, type, setType, token, setToken, user, setUser, setShowMenuImage, setShowCloseImage } = memberContext;
    console.log('register', isLoggedIn);
    console.log('register', type);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registrationType, setRegistrationType] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [logo, setLogo] = useState(null);
    const router = useRouter();
    const handleRegistrationTypeChange = (e) => {
        console.log(e.target);
        console.log(e.target.checked);
        console.log(e.target.value);
        if (e.target.checked) {
            setRegistrationType(e.target.value);
        }
    }
    const handleLogoChange = (e) => {
        console.log(e.target.files);
        console.log(e.target.files[0]);
        // console.log(e.target.files[0].name);
        if (e.target.files.length > 0) {
            setLogo(e.target.files[0]);
        }
    }

    const handleLogoClear = () => {
        setLogo(null);
        document.getElementById('logo').value = '';
    }

    async function handleRegisterClick(e) {
        e.preventDefault();

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
            return alert("Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.");
        }
        if (!registrationType) {
            return alert("Registration type is required");
        }
        if (registrationType === 'merchant') {
            console.log(document.getElementById('company-name').required);
            // if (!companyName) {
            //     return alert("Company name is required");
            // }
            if (!logo) {
                return alert("Company logo is required");
            }
        }

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('type', registrationType);
        formData.append('companyName', companyName);
        formData.append('logo', logo);
        console.log(formData);
        const response = await fetch('/api/users/register', {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            body: formData
            // body: JSON.stringify({
            //     username,
            //     password,
            //     type: registrationType
            // })
        })
        const resData = await response.json();
        console.log(resData);
        if (resData.success) {
            localStorage.setItem('token', resData.token);
            localStorage.setItem('userType', resData.type);
            localStorage.setItem('username', username);
            setIsLoggedIn(true);
            setType(resData.type);
            setToken(resData.token);
            setUser(username);
            console.log(type);
            console.log(token);
            console.log(user);
            console.log(username);
            resData.type === 'merchant' ? router.replace('/members/merchants') : router.replace('/members/clients');
        } else {
            setIsLoggedIn(false);
            alert(resData.msg || 'Registration failed. Please try again.');
        }
    }

    useEffect(() => {
        setShowMenuImage(true);
        setShowCloseImage(false);
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');
        if (token) {
            if (userType === 'merchant') {
                router.push('/members/merchants');
            } else {
                router.push('/members/clients');
            }
        }
    }, [token]);

    return (
        <div className={registerStyles.mainContentContainer}>
            <div className={registerStyles.mainContent}>
                <form onSubmit={handleRegisterClick}>
                    <div className={registerStyles.registerWrapper}>
                        <div className={registerStyles.welcomeMsg}>Welcome to use Tuck Shop Restocking System</div>
                        <div className={registerStyles.registerForm}>
                            <div>
                                <div className={registerStyles.usernameAndPasswordWrapper}>
                                    <div>
                                        <div className={registerStyles.labelWrapper}>
                                            <label htmlFor="username">Username:</label>
                                        </div>
                                        <div className={registerStyles.usernameInput}>
                                            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" required />
                                        </div>
                                    </div>
                                    <div>
                                        <div className={registerStyles.labelWrapper}>
                                            <label htmlFor="password">Password:</label>
                                        </div>
                                        <div className={registerStyles.passwordInput}>
                                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                                placeholder="password" required />
                                        </div>
                                    </div>
                                </div>
                                <div className={registerStyles.registrationTypeWrapper}>
                                    <div className={registerStyles.labelWrapper}>
                                        Registration Type:
                                    </div>
                                    <div className={registerStyles.registrationTypeRadioWrapper}>
                                        <div className={registerStyles.clientRadioWrapper}>
                                            <input checked={registrationType === "client"} id="client" type="radio" name="registration-type" value="client" onChange={handleRegistrationTypeChange} />
                                            <label htmlFor="client">Client</label>
                                        </div>
                                        <div className={registerStyles.merchantRadioWrapper}>
                                            <input checked={registrationType === "merchant"} id="merchant" type="radio" name="registration-type" value="merchant" onChange={handleRegistrationTypeChange} />
                                            <label htmlFor="merchant">Merchant</label>
                                        </div>
                                    </div>

                                </div>
                                <div className={registerStyles.companyNameWrapper} style={{ display: registrationType === 'merchant' ? 'block' : 'none' }}>
                                    <div>
                                        <div className={`${registerStyles.labelWrapper} ${registerStyles.companyNameLabelWrapper}`}>
                                            <label htmlFor="company-name">Company Name:</label>
                                        </div>
                                        <div className={registerStyles.companyNameInput}>
                                            <input id="company-name" type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="company name" required={registrationType === "merchant"} />
                                        </div>
                                    </div>
                                </div>
                                <div className={registerStyles.logoUploadWrapper} style={{ display: registrationType === 'merchant' ? 'block' : 'none' }}>
                                    {/* <div>Upload an Company Logo (optional)</div> */}
                                    <div>
                                        <div className={registerStyles.logoInput}>
                                            <button className={registerStyles.logoButton} type="button" onClick={() => document.getElementById('logo').click()}>
                                                Choose a company logo
                                            </button>
                                            <input type="file" id="logo" name="logo" onChange={handleLogoChange} />

                                            <span>
                                                {logo ? logo.name : 'No file chosen'}
                                                <button type="button" style={{ display: logo ? 'inline' : 'none' }} onClick={handleLogoClear}>
                                                    Clear
                                                </button>
                                            </span>


                                            {/* <div>
                                                {logo ? logo.name : 'No file chosen'}
                                                <button type="button" style={{ display: logo ? 'inline' : 'none' }} onClick={handleLogoClear}>
                                                    Clear
                                                </button>
                                            </div> */}





                                        </div>
                                    </div>
                                </div>
                                <div className={registerStyles.registerButtonWrapper}>
                                    <input type="submit" value="Register" />
                                </div>
                                <div className={registerStyles.loginPromptWrapper}>
                                    <div className={registerStyles.loginPrompt}>
                                        Already have an account?{' '}
                                        <span><Link href="/users/login">Login</Link></span>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </form >
            </div >
        </div>
    )
}