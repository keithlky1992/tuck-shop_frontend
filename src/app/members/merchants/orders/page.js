"use client";

import orderStyles from '@/app/css/merchant-get-order.module.css';
import { useState, useEffect } from 'react';
import { useMember } from '@/app/layout';
import { useRouter } from 'next/navigation';

export default function AllOrders() {
    const memberContext = useMember();
    const { token, setShowMenuImage, setShowCloseImage } = memberContext;
    const [orders, setOrders] = useState([]);
    const [clientFilter, setClientFilter] = useState([]);
    const [selectedClient, setSelectedClient] = useState("<All clients>");
    // const [offset, setOffset] = useState(0);
    // const [limit, setLimit] = useState(10);
    console.log(memberContext);
    console.log('token', token);
    console.log('orders', orders);
    console.log('clientFilter', clientFilter);
    const router = useRouter();


    const handleSelectedClientChange = targetClient => {
        console.log('targetClient', targetClient);
        if (targetClient === "<All clients>") {
            setSelectedClient(targetClient);
        } else {
            router.push(`/members/merchants/orders/client/${targetClient}`);
        }
    };

    useEffect(() => {
        async function fetchAllOrders() {
            console.log(token);
            const response = await fetch(`/api/members/merchants/orders`, {
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
                console.log(data.orders);
                let nextClientFilter = [...clientFilter];
                for (let order of data.orders) {
                    if (!nextClientFilter.includes(order.client_username)) {
                        nextClientFilter.push(order.client_username);
                    }
                }
                setClientFilter(nextClientFilter);
                setOrders(data.orders)
            } else {
                setClientFilter([]);
                setOrders([]);
            }
            // console.log(data.orders);
            // console.log(data.msg);
            // console.log(orders);
        }
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            fetchAllOrders();
        }
    }, [token]);


    return (
        <div className={orderStyles.mainContentContainer}>
            <div className={orderStyles.heading}>Orders</div>
            {
                orders.length < 1 ?
                    <div className={orderStyles.noOrdersYet}>No orders yet</div> : ""
            }
            {
                orders.length > 0 ?
                    <>

                        <div className={orderStyles.clientSelectionContainer}>
                            <label htmlFor="clients">Choose a client: </label>
                            <select
                                name="clients"
                                id="clients"
                                className={orderStyles.clientSelection}
                                onChange={e => handleSelectedClientChange(e.target.value)}
                            >
                                <option>{String("<All clients>")}</option>
                                {
                                    clientFilter.map(client =>
                                        <option key={client} value={client}>
                                            {client}
                                        </option>
                                    )
                                }
                            </select>
                        </div>


                        <table className={orderStyles.table}>
                            <thead className={orderStyles.thead}>
                                <tr>
                                    <th>Order Id</th>
                                    <th>Client</th>
                                    <th>Date and Time</th>
                                    <th>Items and Quantity</th>
                                </tr>
                            </thead>
                            <tbody className={orderStyles.tbody}>
                                {
                                    orders.map(order => {
                                        return (
                                            <tr key={order.client_order_id}>
                                                <td>
                                                    {order.client_order_id}
                                                </td>
                                                <td className={orderStyles.clientUsernameTd}>
                                                    {order.client_username}
                                                </td>
                                                <td>
                                                    {
                                                        order.date_time.split('T')[0] + " " + order.date_time.split('T')[1].split('.')[0]
                                                    }
                                                </td>
                                                <td className={orderStyles.itemNameQuantityContainerTd}>
                                                    {order.items.map(item => {
                                                        return (
                                                            <div
                                                                key={item.client_order_item_id}
                                                                className={orderStyles.itemNameQuantityContainer}>

                                                                <div className={orderStyles.itemName}>
                                                                    {item.item_name}
                                                                </div>

                                                                <div className={orderStyles.itemQuantityContainer}>
                                                                    <div>x</div>
                                                                    {item.item_quantity}
                                                                </div>

                                                            </div>
                                                        )
                                                    })}
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                        </table>
                    </>
                    : <></>
                // : <table></table>
            }
        </div>
    )
}