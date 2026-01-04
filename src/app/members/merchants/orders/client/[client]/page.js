"use client";

import orderStyles from '@/app/css/merchant-get-order.module.css';
import { useState, useEffect } from 'react';
import { useMember } from '@/app/layout';
import { useRouter, useParams } from 'next/navigation';

export default function GetSelectedClientOrders() {
    const memberContext = useMember();
    const { token, setShowMenuImage, setShowCloseImage } = memberContext;
    const params = useParams();
    const clientParam = params.client;
    console.log('clientParam', clientParam);
    const [clientFilter, setClientFilter] = useState([]);
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [selectedClient, setSelectedClient] = useState("<All clients>");
    // const [offset, setOffset] = useState(0);
    // const [limit, setLimit] = useState(10);
    console.log(memberContext);
    console.log('token', token);
    console.log('clientFilter', clientFilter);
    console.log('selectedOrders', selectedOrders);
    console.log('selectedClient', selectedClient);
    const router = useRouter();

    const handleSelectedClientChange = targetClient => {
        console.log(targetClient);
        if (targetClient === "<All clients>") {
            router.push('/members/merchants/orders');
            // return setSelectedMerchant(targetMerchant);
        } else {
            router.push(`/members/merchants/orders/client/${targetClient}`);
        }
    }


    useEffect(() => {
        if (clientParam === "<All clients>") {
            return router.push(`/members/merchants/orders`);
        }
        setSelectedClient(clientParam);

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
                // setOrders(data.orders)
            } else {
                setClientFilter([]);
                // setOrders([]);
            }
            // console.log(data.orders);
            // console.log(data.msg);
            // console.log(orders);
        }


        async function fetchSelectedOrders() {
            console.log(token);
            console.log(selectedClient);
            const response = await fetch(`/api/members/merchants/orders?client-username=${clientParam}`, {
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
                setSelectedOrders(data.orders);
                setSelectedClient(clientParam);
                // let nextClientFilter = [...clientFilter];
                // for (let order of data.orders) {
                //     if (!nextClientFilter.includes(order.client_username)) {
                //         nextClientFilter.push(order.client_username);
                //     }
                // }
                // setClientFilter(nextClientFilter);
                // setOrders(data.orders)
            } else {
                setSelectedOrders([]);
                setSelectedClient(clientParam);
                // setClientFilter([]);
                // setOrders([]);
            }
            // console.log(data.orders);
            // console.log(data.msg);
            // console.log(orders);
        }
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            fetchAllOrders();
            fetchSelectedOrders();
        }
    }, [token]);

    return (
        <div className={orderStyles.mainContentContainer}>
            <div className={orderStyles.heading}>Orders</div>
            {
                selectedOrders.length < 1 ?
                    <div className={orderStyles.noOrdersYet}>No orders yet</div> : ""
            }
            {
                selectedOrders.length > 0 ?
                    <>

                        <div className={orderStyles.clientSelectionContainer}>
                            <label htmlFor="clients">Choose a client: </label>
                            <select
                                name="clients"
                                id="clients"
                                value={selectedClient}
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

                        <div className={orderStyles.tableContainer}>
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
                                        selectedOrders.map(order => {
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
                        </div>
                    </>
                    : <></>
                // : <table></table>
            }
        </div>
    )


}