"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
import soundImage from '../img/sound.svg';
import topBarStyles from '../css/top-bar.module.css';
import { useMember } from '../layout';
import { useAI } from '@/app/components/AIProvider';
import tuckShopImage from '@/app/img/tuck-shop.png';
import menuImage from '@/app/img/menu.svg';
import closeImage from '@/app/img/close.svg';
import { useRouter } from 'next/navigation';
import Menu from './Menu';


export default function TopBar() {
    // const apiKey = process.env.NEXT_PUBLIC_GROK_API_KEY;
    // const baseURL = process.env.NEXT_PUBLIC_GROK_URL;
    // console.log('Grok apiKey', apiKey);
    // console.log('Grok baseURL', baseURL);


    const memberContext = useMember();
    const {
        isLoggedIn,
        token,
        showMenuImage, setShowMenuImage,
        showCloseImage, setShowCloseImage, showSoundImage, setShowSoundImage
    } = memberContext;
    console.log('memberContext', memberContext);
    console.log('token', token);

    const aiContext = useAI();
    const { voiceCommand, setVoiceCommand, isLoading, setIsLoading } = aiContext;
    console.log('aiContext', aiContext);

    const [tokenData, setTokenData] = useState(null);
    // const [resultText, setResultText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    // const [showMenuImage, setShowMenuImage] = useState(true);
    // const [showCloseImage, setShowCloseImage] = useState(false);
    // const [showSoundImage, setShowSoundImage] = useState(false);
    console.log('tokenData', tokenData);
    // console.log('resultText', resultText);
    console.log('isRecording', isRecording);

    const router = useRouter();

    useEffect(() => {

        console.log(localStorage.getItem('userType'));
        if (localStorage.getItem('userType') === 'client') {
            setShowSoundImage(true);
        } else {
            setShowSoundImage(false);
        }



        const getSttToken = async () => {
            console.log('token', token);
            const response = await fetch('/api/members/clients/stt-token', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('response', response);
            const data = await response.json();
            console.log('data', data);
            setTokenData(data);
        }
        if (token) {
            getSttToken();
        }
        // (async () => {
        //     const tokenData = await getToken();
        //     setTokenData(tokenData);
        // })();
    }, [token]);

    function handleMenuImageClick() {
        setShowMenuImage(false);
        setShowCloseImage(true);
    }

    function handleCloseImageClick() {
        setShowMenuImage(true);
        setShowCloseImage(false);
    }

    async function handleRecordClick() {
        console.log('Record button clicked');
        // setResultText("");
        // setIsLoading(true);
        setIsRecording(true);
        setVoiceCommand("");
        let speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(
            tokenData.token,
            tokenData.region
        );

        speechConfig.speechRecognitionLanguage = "zh-HK";
        let audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
        let recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

        recognizer.recognizeOnceAsync(
            (result) => {
                // setResultText(result.text);
                setIsRecording(false);
                setVoiceCommand(result.text);
                // setIsLoading(false);

                recognizer.close();
                recognizer = null;
            },
            (err) => {
                setIsRecording(false);
                setVoiceCommand(null);
                // setIsLoading(false);

                console.log(err);
                recognizer.close();
                recognizer = null;
            }
        );

    }

    return (
        <>
            <div className={topBarStyles.topBar}>
                <div className={topBarStyles.upperTopBar}>


                    <div className={topBarStyles.menuImageAndCloseImageContainer}>
                        <img
                            src={menuImage.src}
                            className={topBarStyles.menuImage}
                            alt='menu'
                            style={{ display: showMenuImage ? '' : "none" }}
                            onClick={handleMenuImageClick}
                        />
                        <img
                            src={closeImage.src}
                            className={topBarStyles.closeImage}
                            alt='close'
                            style={{ display: showCloseImage ? '' : "none" }}
                            onClick={handleCloseImageClick}
                        />
                    </div>

                    <div className={topBarStyles.tuckShopImgAndSystemNameContainer} onClick={() => router.push("/")}>
                        <div className={topBarStyles.tuckShopContainer}>
                            <img src={tuckShopImage.src} className={topBarStyles.tuckShop} alt='tuck shop' />
                        </div>
                        <div className={topBarStyles.systemName}>
                            Tuck Shop<br />
                            Restocking System
                        </div>
                    </div>

                    <div
                        className={topBarStyles.soundImageContainer}
                    // style={{ display: isLoggedIn ? 'flex' : 'none' }}
                    >

                        {tokenData?.token && (
                            <button
                                id='recordId'
                                disabled={isRecording}
                                onClick={handleRecordClick}
                                style={{ display: "none" }}
                            >
                                Record
                            </button>
                        )}
                        <div className={topBarStyles.voiceCommand1}>
                            {voiceCommand}
                        </div>

                        <img
                            src={soundImage.src}
                            alt='sound'
                            // style={{ display: "none" }}
                            style={{ display: showSoundImage ? '' : "none" }}
                            onClick={() => {
                                !document.getElementById('recordId') ? null
                                    : document.getElementById('recordId').click()
                            }
                            }
                        />
                    </div>
                </div>
                <div className={topBarStyles.voiceCommand2}>
                    {voiceCommand}
                </div>
            </div>
            <div className={topBarStyles.menu} style={{ display: showCloseImage ? '' : "none" }}>
                <Menu />
            </div>
        </>
    )

}


