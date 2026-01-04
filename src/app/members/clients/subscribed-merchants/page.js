"use client";

import { useState, useEffect } from 'react';
import { useMember } from '@/app/layout';
import { useAI } from '@/app/components/AIProvider';
import Link from 'next/link';
import subscribedMerchantListStyles from '@/app/css/subscribed-merchant-list.module.css';
import SnackbarForLoading from '@/app/components/SnackBarForLoading';



export default function SubscribedMerchantList() {
    const memberContext = useMember();
    const { token, setShowMenuImage, setShowCloseImage, backendUrlHost } = memberContext;
    const [subscribedMerchants, setSubscribedMerchants] = useState([]);
    const [subscribedMerchantsLength, setSubscribedMerchantsLength] = useState(0);
    console.log(memberContext);
    console.log(token);
    console.log('subscribedMerchants', subscribedMerchants);
    console.log('subscribedMerchantsLength', subscribedMerchantsLength);

    const aiContext = useAI();
    const { registerVoiceControl, isLoading, setIsLoading } = aiContext;
    console.log('aiContext', aiContext);


    useEffect(() => {
        const fetchSubscribedMerchantList = async () => {
            console.log(token);
            const response = await fetch('/api/members/clients/subscribed-merchants', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(response);
            const data = await response.json();
            console.log(data);
            if (data.success && data.searchedSubscribedMerchants) {
                setSubscribedMerchants(data.searchedSubscribedMerchants);
                setSubscribedMerchantsLength(data.searchedSubscribedMerchants.length);
            } else {
                setSubscribedMerchants([]);
                setSubscribedMerchantsLength(0);
            }
            console.log(data.searchedSubscribedMerchants);
            // console.log(data.searchedSubscribedMerchants.length);
            console.log(data.msg);
            console.log(subscribedMerchants);
            console.log(subscribedMerchantsLength);
        }
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            fetchSubscribedMerchantList();
        }
    }, [token])


    return (
        <div className={subscribedMerchantListStyles.mainContentContainer}>
            <SnackbarForLoading
                message='Loading...'
                show={isLoading}
            />
            <div className={subscribedMerchantListStyles.heading}>Subscribed Merchants</div>
            <div className={subscribedMerchantListStyles.total}>Total: {subscribedMerchantsLength}</div>
            <div className={subscribedMerchantListStyles.allSubscribedMerchantContainer}>
                {
                    subscribedMerchantsLength > 0 ?
                        subscribedMerchants.map(subscribedMerchant => {
                            return (
                                <div
                                    key={subscribedMerchant.merchant_username}
                                    className={subscribedMerchantListStyles.subscribedMerchantContainer}
                                >
                                    <Link
                                        className={subscribedMerchantListStyles.relevantItemLink}
                                        href={`/members/clients/items/merchant/${subscribedMerchant.merchant_username}`}
                                    >
                                        <img
                                            // src={`http://localhost:4000${subscribedMerchant.company_logo}`}
                                            // src={`http://192.168.50.135:4000${subscribedMerchant.company_logo}`}
                                            src={`http://${backendUrlHost}${subscribedMerchant.company_logo}`}
                                            alt='company logo'
                                        />
                                        <br />
                                        <div className={subscribedMerchantListStyles.subscribedMerchantUsername}>
                                            {subscribedMerchant.merchant_username}
                                        </div>
                                    </Link>
                                </div>
                            )
                        }) : ""
                }



            </div>

        </div >
    );
}