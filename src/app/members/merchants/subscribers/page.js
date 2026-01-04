"use client";

import { useState, useEffect } from "react";
import { useMember } from "@/app/layout";
import Link from 'next/link';
import subscribersStyles from "@/app/css/subscribers.module.css";


export default function Subscribers() {
    const memberContext = useMember();
    const { token, setShowMenuImage, setShowCloseImage } = memberContext;
    const [subscribers, setSubscribers] = useState([]);
    // const [subscriberslength, setSubscribersLength] = useState(0);
    console.log(memberContext);
    console.log(token);
    console.log(subscribers);
    // console.log(subscriberslength);

    useEffect(() => {
        async function fetchSubscribers() {
            console.log(token);
            const response = await fetch("/api/members/merchants/subscribers", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            console.log(response);
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setSubscribers(data.subscribers);
                // setSubscribersLength(data.subscribers.length);
            } else {
                setSubscribers([]);
                // setSubscribersLength(0);
            }
            console.log(data.subscribers);
            console.log(data.subscribers.length);
            console.log(data.msg);
            console.log(subscribers);
            // console.log(subscriberslength);
        }
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            fetchSubscribers();
        }
    }, [token]);

    return (
        <div className={subscribersStyles.mainContentContainer}>

            <div className={subscribersStyles.heading}>My Subscribers</div>

            <div className={subscribersStyles.total}>Total: {subscribers.length}</div>

            <div className={subscribersStyles.allSubscribersContainer}>

                {
                    subscribers.length > 0 ?
                        subscribers.map(subscriber => {
                            return (
                                <Link
                                    key={subscriber.subscription_id}
                                    className={subscribersStyles.relevantOrderLink}
                                    href={`/members/merchants/orders/client/${subscriber.client_username}`}>
                                    <div className={subscribersStyles.subscriberContainer}>

                                        {subscriber.client_username}
                                    </div>
                                </Link>
                            )
                        }) : ""
                }

            </div>

        </div >

    )
}