"use client";

import { useState, useEffect } from 'react';
import { useMember } from '@/app/layout';
import { useAI } from '@/app/components/AIProvider';
import Link from 'next/link';
import merchantListStyles from '@/app/css/merchant-list.module.css';
import downImage from '@/app/img/down.svg';
import SnackbarForLoading from '@/app/components/SnackBarForLoading';


export default function MerchantList() {
    const memberContext = useMember();
    const { token, merchants, setMerchants, merchantsLength, setMerchantsLength, setShowMenuImage, setShowCloseImage, backendUrlHost } = memberContext;
    // const [merchants, setMerchants] = useState([]);
    // const [merchantsLength, setMerchantsLength] = useState(0);
    const [subscribedMerchants, setSubscribedMerchants] = useState({});
    const [unsubscribeBtnOnMerchantsList, setUnsubscribeBtnOnMerchantsList] = useState([]);

    console.log(memberContext);
    console.log(token);
    console.log('merchants', merchants);
    console.log('merchantsLength', merchantsLength);
    console.log('subscribedMerchants', subscribedMerchants);
    console.log('unsubscribeBtnOnMerchantsList', unsubscribeBtnOnMerchantsList);

    const aiContext = useAI();
    const { registerVoiceControl, isLoading, setIsLoading } = aiContext;
    console.log('aiContext', aiContext);

    let pageCommands = [
        {
            command: "SUBSCRIBE",
            payload: {
                merchantUsername: "string"
            }
        },
        {
            command: "UNSUBSCRIBE",
            payload: {
                merchantUsername: "string"
            }
        }
    ];

    useEffect(() => {
        // console.log('merchant page useEffect runs');
        (
            async () => {
                // console.log('merchants', merchants);
                let merchantUsernames = merchants.map(merchant => merchant.member_username);
                // console.log('merchantUsernames', merchantUsernames);
                let availablePayloads = {
                    merchantUsername: merchantUsernames
                };
                console.log('pageCommands', pageCommands);
                console.log('availablePayloads', availablePayloads);
                // console.log('registerVoiceControl');
                registerVoiceControl(pageCommands, availablePayloads, (resolvedCommand) => {
                    // console.log('pageCommands', pageCommands);
                    // console.log('availablePayloads', availablePayloads);
                    // console.log('registerVoiceControl runs');
                    console.log('resolvedCommand in merchant list', resolvedCommand);
                    console.log('resolvedCommand.command', resolvedCommand.command);
                    console.log('resolvedCommand.payload', resolvedCommand.payload);

                    if (resolvedCommand.command === "SUBSCRIBE" && resolvedCommand.payload) {
                        handleSubscribeClick(resolvedCommand.payload.merchantUsername);
                    } else if (resolvedCommand.command === "UNSUBSCRIBE" && resolvedCommand.payload) {
                        handleUnsubscribeClick(resolvedCommand.payload.merchantUsername);
                        // let nextUnsubscribeBtnOnMerchantsList = [...unsubscribeBtnOnMerchantsList];
                        // console.log(nextUnsubscribeBtnOnMerchantsList);

                        // const targetIndex = nextUnsubscribeBtnOnMerchantsList.indexOf(resolvedCommand.payload.merchantUsername);
                        // nextUnsubscribeBtnOnMerchantsList.splice(targetIndex, 1);
                        // console.log(nextUnsubscribeBtnOnMerchantsList);
                        // setUnsubscribeBtnOnMerchantsList(nextUnsubscribeBtnOnMerchantsList);

                    }
                });
            }
        )();
    }, [merchants]);

    async function handleSubscribeClick(merchantUsername) {
        console.log('merchantUsername', merchantUsername);
        const response = await fetch(`/api/members/clients/merchants/${merchantUsername}/subscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        console.log(data.success);
        if (data.success) {
            fetchSubscribedMerchantList();
        }

        // if (data.success) {
        //     let nextSubscribedMerchants = { ...subscribedMerchants };
        //     console.log('hi there');
        //     nextSubscribedMerchants[data.merchantUsername] = {
        //         subscriptionId: data.subscriptionId,
        //         merchantUsername: data.merchantUsername,
        //         // companyName: data.searchedSubscribedMerchants[i].company_name,
        //         // companyLogo: data.searchedSubscribedMerchants[i].company_logo
        //     }

        //     setSubscribedMerchants(nextSubscribedMerchants);
        // }
    }

    function handleSubscribedClick(merchantUsername) {
        let nextUnsubscribeBtnOnMerchantsList = [...unsubscribeBtnOnMerchantsList];
        console.log(nextUnsubscribeBtnOnMerchantsList);

        if (nextUnsubscribeBtnOnMerchantsList.indexOf(merchantUsername) > -1) {
            const targetIndex = nextUnsubscribeBtnOnMerchantsList.indexOf(merchantUsername);
            nextUnsubscribeBtnOnMerchantsList.splice(targetIndex, 1);
            console.log(nextUnsubscribeBtnOnMerchantsList);
            setUnsubscribeBtnOnMerchantsList(nextUnsubscribeBtnOnMerchantsList);
        } else {
            nextUnsubscribeBtnOnMerchantsList.push(merchantUsername);
            setUnsubscribeBtnOnMerchantsList(nextUnsubscribeBtnOnMerchantsList);
        }
    }

    async function handleUnsubscribeClick(merchantUsername) {
        const response = await fetch(`/api/members/clients/merchants/${merchantUsername}/subscription`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        if (data.success) {
            fetchSubscribedMerchantList();
        }


        // if (data.success) {
        //     let nextSubscribedMerchants = { ...subscribedMerchants };
        //     delete nextSubscribedMerchants[merchantUsername];
        //     setSubscribedMerchants(nextSubscribedMerchants);

        let nextUnsubscribeBtnOnMerchantsList = [...unsubscribeBtnOnMerchantsList];
        console.log(nextUnsubscribeBtnOnMerchantsList);

        const targetIndex = nextUnsubscribeBtnOnMerchantsList.indexOf(merchantUsername);
        nextUnsubscribeBtnOnMerchantsList.splice(targetIndex, 1);
        console.log(nextUnsubscribeBtnOnMerchantsList);
        setUnsubscribeBtnOnMerchantsList(nextUnsubscribeBtnOnMerchantsList);
        // }

    }

    async function fetchMerchantList() {
        console.log(token);
        const response = await fetch('/api/members/clients/merchants', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        console.log(response);
        const data = await response.json();
        console.log(data);
        if (data.success) {
            setMerchants(data.searchedMerchants);
            setMerchantsLength(data.searchedMerchants.length);
            // setPageCommand(pageCommand, merchants);
        } else {
            setMerchants([]);
            setMerchantsLength(0);
            // setPageCommand(pageCommand, []);
        }
        console.log(merchants);
        console.log(merchantsLength);
    }

    async function fetchSubscribedMerchantList() {
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
            let nextSubscribedMerchants = {};
            for (let i = 0; i < data.searchedSubscribedMerchants.length; i++) {
                nextSubscribedMerchants[data.searchedSubscribedMerchants[i].merchant_username] = {
                    subscriptionId: data.searchedSubscribedMerchants[i].subscription_id,
                    merchantUsername: data.searchedSubscribedMerchants[i].merchant_username,
                    // companyName: data.searchedSubscribedMerchants[i].company_name,
                    // companyLogo: data.searchedSubscribedMerchants[i].company_logo
                }
            }
            // setSubscribedMerchants(data.searchedSubscribedMerchants);
            setSubscribedMerchants(nextSubscribedMerchants);
        } else {
            setSubscribedMerchants({});
        }


    }
    useEffect(() => {

        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            fetchMerchantList();
            fetchSubscribedMerchantList();
        }
    }, [token]);

    return (
        <div className={merchantListStyles.mainContentContainer}>
            <SnackbarForLoading
                message='Loading...'
                show={isLoading}
            />
            <div className={merchantListStyles.heading}>Merchants</div>
            <div className={merchantListStyles.total}>Total: {merchantsLength}</div>
            <div className={merchantListStyles.allMerchantContainer}>
                {
                    merchantsLength > 0 ?
                        merchants.map(merchant => {
                            return (
                                <div
                                    key={merchant.member_username}
                                    className={merchantListStyles.wholeMerchantContainer}
                                >

                                    <Link
                                        className={merchantListStyles.relevantItemLink}
                                        href={`/members/clients/items/merchant/${merchant.member_username}`}
                                    >
                                        <div className={merchantListStyles.merchantContainer}>
                                            <img
                                                // src={`http://localhost:4000${merchant.company_logo}`}
                                                // src={`http://192.168.50.135:4000${merchant.company_logo}`}
                                                src={`http://${backendUrlHost}${merchant.company_logo}`}
                                                alt='company logo'
                                            />
                                            <br />
                                            <div className={merchantListStyles.merchantUsername}>
                                                {merchant.member_username}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className={merchantListStyles.subscriptionContainer}>

                                        <div
                                            className={merchantListStyles.subscribe}
                                            // id={`subscribeId ${merchant.member_username.toLowerCase()}`}
                                            style={{
                                                display: !subscribedMerchants[merchant.member_username] ? "flex" : "none",
                                                // display: !subscribedMerchants[merchant.member_username.toLowerCase()] ? "flex" : "none",
                                                // marginBottom: unsubscribeBtnOnMerchantsList.includes(merchant.member_username.toLowerCase()) ? "43px" : 0
                                            }}
                                            onClick={() => {
                                                console.log(merchant);
                                                handleSubscribeClick(merchant.member_username)
                                                // handleSubscribeClick(merchant.member_username.toLowerCase())
                                            }
                                            }
                                        >
                                            Subscribe
                                            {/* <span>{merchant.member_username}</span> */}
                                        </div>

                                        <div className={merchantListStyles.subscribedUnsubscribeContainer}>
                                            <div
                                                className={merchantListStyles.subscribed}
                                                // id={`subscribedId ${merchant.member_username.toLowerCase()}`}
                                                style={{
                                                    display: subscribedMerchants[merchant.member_username] ? "flex" : "none"
                                                    // display: subscribedMerchants[merchant.member_username.toLowerCase()] ? "flex" : "none"
                                                }}
                                                onClick={() => {
                                                    console.log(merchant);
                                                    handleSubscribedClick(merchant.member_username)
                                                    // handleSubscribedClick(merchant.member_username.toLowerCase())
                                                }
                                                }
                                            >
                                                Subscribed
                                                <img
                                                    src={downImage.src}
                                                    // id={`downId ${merchant.member_username.toLowerCase()}`}
                                                    onClick={() => {
                                                        console.log(merchant);
                                                        handleSubscribedClick(merchant.member_username)
                                                        // handleSubscribedClick(merchant.member_username.toLowerCase())
                                                    }
                                                    }
                                                />
                                            </div>
                                            <div
                                                className={merchantListStyles.unsubscribe}
                                                // id={`unsubscribeId ${merchant.member_username.toLowerCase()}`}
                                                style={{
                                                    display: unsubscribeBtnOnMerchantsList.includes(merchant.member_username) ? "flex" : "none"
                                                    // display: unsubscribeBtnOnMerchantsList.includes(merchant.member_username.toLowerCase()) ? "flex" : "none"
                                                }}
                                                onClick={() => {
                                                    console.log(merchant);
                                                    handleUnsubscribeClick(merchant.member_username)
                                                    // handleUnsubscribeClick(merchant.member_username.toLowerCase())
                                                }
                                                }
                                            >
                                                Unsubscribe
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            )
                        }) : ""
                }



            </div>



        </div>
    );
}