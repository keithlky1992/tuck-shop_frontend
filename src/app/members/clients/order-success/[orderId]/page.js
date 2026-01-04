"use client";

import { useMember } from "@/app/layout";
import { useAI } from '@/app/components/AIProvider';
import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import orderSuccessStyles from '@/app/css/order-success.module.css';
import SnackbarForLoading from '@/app/components/SnackBarForLoading';




export default function OrderSuccess() {
    const memberContext = useMember();
    const { token, setShowMenuImage, setShowCloseImage } = memberContext;
    const [orderHistory, setOrderHistory] = useState([]);
    const params = useParams();
    console.log(memberContext);
    console.log(token);
    console.log('orderHistory', orderHistory);
    console.log(params.orderId);

    const aiContext = useAI();
    const { registerVoiceControl, isLoading, setIsLoading } = aiContext;
    console.log('aiContext', aiContext);


    useEffect(() => {
        const fetchOrderHistory = async () => {
            console.log(token);
            const response = await fetch(`/api/members/clients/order-history?status=true&client-order-id=${params.orderId}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(response);
            const data = await response.json();
            console.log(data);
            if (data.success) {
                console.log(data.orderHistory);
                setOrderHistory(data.orderHistory);
            } else {
                setOrderHistory([]);
            }
            console.log(data.orderHistory);
            console.log(data.msg);
            console.log(orderHistory);
        }
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            fetchOrderHistory();
        }
    }, [token, params.orderId]);



    return (
        <div className={orderSuccessStyles.mainContentContainer}>
            <SnackbarForLoading
                message='Loading...'
                show={isLoading}
            />

            {
                orderHistory.length < 1 ?
                    <div className={orderSuccessStyles.heading}>No orders found.</div>
                    : <div className={orderSuccessStyles.heading}>You have successfully placed the order.</div>
            }
            {
                orderHistory.length > 0 ?
                    <table className={orderSuccessStyles.table}>

                        <thead className={orderSuccessStyles.thead}>
                            <tr>
                                <th>Order Id</th>
                                <th>Date and Time</th>
                                <th>Items and Quantity</th>
                            </tr>
                        </thead>

                        <tbody className={orderSuccessStyles.tbody}>
                            <tr>
                                <td>
                                    {orderHistory[0].client_order_id}
                                </td>
                                <td>
                                    {
                                        new Date(orderHistory[0].date_time).toLocaleString().split('/')[2].split(",")[0]
                                        + "-"
                                        + new Date(orderHistory[0].date_time).toLocaleString().split('/')[1]
                                        + "-"
                                        + new Date(orderHistory[0].date_time).toLocaleString().split('/')[0]
                                        + " "
                                        + new Date(orderHistory[0].date_time).toLocaleString().split(', ')[1]
                                    }
                                </td>
                                <td className={orderSuccessStyles.itemNameQuantityContainerTd}>
                                    {
                                        orderHistory[0].client_order_item.map((item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className={orderSuccessStyles.itemNameQuantityContainer}
                                                >

                                                    <div className={orderSuccessStyles.itemName}>
                                                        {item.item_name}
                                                    </div>

                                                    <div className={orderSuccessStyles.itemQuantityContainer}>
                                                        <div>x</div>
                                                        {item.item_quantity}
                                                    </div>

                                                </div>
                                            )
                                        })
                                    }


                                </td>
                            </tr>


                        </tbody>

                    </table>
                    : ""
            }
        </div>
    )
}