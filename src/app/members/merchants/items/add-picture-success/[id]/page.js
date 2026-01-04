"use client"

import Link from 'next/link';
import itemSuccessStyles from '@/app/css/item-success.module.css';
import { useMember } from '@/app/layout';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useParams } from 'next/navigation';


export default function AddPictureSuccess() {
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
            <h1>The item picture(s) has/have been added successfully.</h1>
            <p>
                You are being redirected to item info page.<br />
                If you don't want to wait, please click <Link href={`/members/merchants/items/${params.id}`}>here</Link> to go to item info page.
            </p>
        </div>
    )
}