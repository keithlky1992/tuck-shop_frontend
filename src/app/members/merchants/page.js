"use client";
import { useMember } from "@/app/layout";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import merchantStyles from "@/app/css/merchant.module.css";

export default function Merchants() {
    const memberContext = useMember();
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
    useEffect(() => {
        console.log('type', type);
        console.log('isInitialized', isInitialized);
        if (!isInitialized) {
            return;
        }
        if (!isLoggedIn) {
            router.replace('/');
        }
        if (type !== "merchant" && type !== null) {
            alert("Only merchants can access this resource.");
        }
        setShowMenuImage(true);
        setShowCloseImage(false);
    }, [isLoggedIn, type, isInitialized])

    if (!isInitialized || !isLoggedIn) {
        return null;
        // return "!isLoggedIn2";
    }
    if (type !== "merchant") {
        console.log('type', type);
        // return alert("Only merchants can access this resource.");
        return null;
        // return "hi 2"
    }

    return (
        <div className={merchantStyles.welcomeMsgWrapper}>
            <div className={merchantStyles.welcomeMsgForBrowser}>
                {/* Merchants Page */}
                Hello, {user}.<br />
                This system is for <b>merchants</b>.
            </div>
        </div>
    )
}