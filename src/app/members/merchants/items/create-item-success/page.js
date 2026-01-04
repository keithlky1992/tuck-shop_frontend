"use client"

import Link from 'next/link';
import itemSuccessStyles from '@/app/css/item-success.module.css';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useMember } from '@/app/layout';



export default function CreateItemSuccess() {
    const memberContext = useMember();
    const { token, setShowMenuImage, setShowCloseImage } = memberContext;

    useEffect(() => {
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            setTimeout(() => {
                redirect(`/members/merchants/items`);
            }, "3000");
        }
    }, [token])
    return (
        <div className={itemSuccessStyles.mainContentContainer}>
            <h1>Item Created Successfully!</h1>
            <p>
                You are being redirected to item page.<br />
                If you don't want to wait, please click <Link href={`/members/merchants/items`}>here</Link> to go to item page.
            </p>
        </div>
    )
}