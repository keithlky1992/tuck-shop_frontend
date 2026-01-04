"use client"

import Link from 'next/link';
import itemSuccessStyles from '@/app/css/item-success.module.css';
import { useEffect } from 'react';
import { redirect, useParams } from 'next/navigation';
import { useMember } from '@/app/layout';


export default function DeleteItemPictureSuccess() {
    const memberContext = useMember();
    const { token, setShowMenuImage, setShowCloseImage } = memberContext;
    const params = useParams();
    console.log(params.id);
    useEffect(() => {
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            setTimeout(() => {
                redirect(`/members/merchants/items/${params.id}`);
            }, "3000");
        }
    }, [token])
    return (
        <div className={itemSuccessStyles.mainContentContainer}>
            <h1>This item picture has been deleted successfully.</h1>
            <p>
                You are being redirected to item info page.<br />
                If you don't want to wait, please click <Link href={`/members/merchants/items/${params.id}`}>here</Link> to go to item info page.
            </p>
        </div>
    )
}