"use client";
import { useMember } from "@/app/layout";
import { useAI } from '@/app/components/AIProvider';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import clientStyles from "@/app/css/client.module.css";
import SnackbarForLoading from '@/app/components/SnackBarForLoading';



export default function Clients() {
    const memberContext = useMember();
    console.log(memberContext);
    const {
        isLoggedIn,
        setIsLoggedIn,
        type,
        setType,
        isInitialized,
        user,
        setShowMenuImage,
        setShowCloseImage
    } = memberContext;
    const router = useRouter();

    const aiContext = useAI();
    const { registerVoiceControl, isLoading, setIsLoading } = aiContext;
    console.log('aiContext', aiContext);

    useEffect(() => {
        console.log('type', type);
        console.log('isInitialized', isInitialized);
        if (!isInitialized) {
            return;
        }
        if (!isLoggedIn) {
            router.replace('/');
        }
        if (type !== "client" && type !== null) {
            alert("Only clients can access this resource.");
        }
        setShowMenuImage(true);
        setShowCloseImage(false);
    }, [isLoggedIn, type, isInitialized])

    if (!isInitialized || !isLoggedIn) {
        return null;
        // return "!isLoggedIn1";
    }

    if (type !== "client") {
        console.log('type', type);
        return null;
        // return alert("Only clients can access this resource.");
        // return "hi 1"
    }


    return (
        <>
            <SnackbarForLoading
                message='Loading...'
                show={isLoading}
            />
            <div className={clientStyles.welcomeMsgWrapper}>
                <div className={clientStyles.welcomeMsgForBrowser}>
                    {/* Clients Page */}
                    Hello, {user}.<br />
                    This system is for <b>clients</b>.
                </div>
            </div>
        </>
    )
}