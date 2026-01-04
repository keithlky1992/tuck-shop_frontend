"use client";

import { useMember } from "@/app/layout";
import { useAI } from '@/app/components/AIProvider';
import { useState, useEffect } from "react";
import orderHistoryStyles from '@/app/css/client-get-order-history.module.css';
import SnackbarForLoading from '@/app/components/SnackBarForLoading';


export default function Page() {
    return <OrderHistory key={Math.random()} />
}

// export default function OrderHistory() {
export function OrderHistory() {
    const memberContext = useMember();
    const { token, latestOrderId, setLatestOrderId, setShowMenuImage, setShowCloseImage } = memberContext;
    const [orderHistory, setOrderHistory] = useState([]);
    console.log(memberContext);
    console.log('token', token);
    console.log('latestOrderId', latestOrderId);
    console.log('orderHistory', orderHistory);

    const aiContext = useAI();
    const { registerVoiceControl, isLoading, setIsLoading } = aiContext;
    console.log('aiContext', aiContext);

    useEffect(() => {
        const fetchOrderHistory = async () => {
            console.log(token);
            const response = await fetch(`/api/members/clients/order-history?status=true`, {
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
    }, [token, latestOrderId]);

    console.log('latestOrderId', latestOrderId);

    return (
        <div className={orderHistoryStyles.mainContentContainer}>
            <SnackbarForLoading
                message='Loading...'
                show={isLoading}
            />
            <div className={orderHistoryStyles.heading}>Order History</div>
            {
                orderHistory.length < 1 ?
                    <div className={orderHistoryStyles.noOrdersYet}>No orders yet.</div> : ""
            }
            {
                orderHistory.length > 0 ?
                    <div className={orderHistoryStyles.tableContainer}>
                        <table className={orderHistoryStyles.table}>

                            <thead className={orderHistoryStyles.thead}>
                                <tr>
                                    <th>Order Id</th>
                                    <th>Date and Time</th>
                                    <th>Items and Quantity</th>
                                </tr>
                            </thead>

                            <tbody className={orderHistoryStyles.tbody}>
                                {
                                    orderHistory.map(order => {
                                        return (
                                            <tr key={order.client_order_id}>
                                                <td>
                                                    {order.client_order_id}
                                                </td>
                                                <td>
                                                    {
                                                        new Date(order.date_time).toLocaleString().split('/')[2].split(",")[0]
                                                        + "-"
                                                        + new Date(order.date_time).toLocaleString().split('/')[1]
                                                        + "-"
                                                        + new Date(order.date_time).toLocaleString().split('/')[0]
                                                        + " "
                                                        + new Date(order.date_time).toLocaleString().split(', ')[1]
                                                    }
                                                </td>
                                                <td className={orderHistoryStyles.itemNameQuantityContainerTd}>
                                                    {
                                                        order.client_order_item.map((item, index) => {
                                                            console.log('111item', item);
                                                            console.log('111index', index);
                                                            // if (!item.item_id) {
                                                            //     return(
                                                            //         <div
                                                            //         key={index}
                                                            //         className={orderHistoryStyles.itemNameQuantityContainer}
                                                            //     >
                                                            //         <div>
                                                            //             This item has been deleted
                                                            //         </div>

                                                            //         {/* <div className={orderHistoryStyles.itemName}>
                                                            //             {item.item_name}
                                                            //         </div>

                                                            //         <div className={orderHistoryStyles.itemQuantityContainer}>
                                                            //             <div>x</div>
                                                            //             {item.item_quantity}
                                                            //         </div> */}

                                                            //     </div>
                                                            //     )
                                                            // }

                                                            return (
                                                                <div
                                                                    key={index}
                                                                    className={orderHistoryStyles.itemNameQuantityContainer}
                                                                >

                                                                    <div className={orderHistoryStyles.itemName}>
                                                                        {item.item_name}
                                                                    </div>

                                                                    <div className={orderHistoryStyles.itemQuantityContainer}>
                                                                        <div>x</div>
                                                                        {item.item_quantity}
                                                                    </div>

                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                        </table>
                    </div>
                    : ""
            }
        </div>
    )
}