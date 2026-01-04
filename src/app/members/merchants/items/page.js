"use client";

import { useState, useEffect } from "react";
import { useMember } from "@/app/layout";
import itemStyles from '@/app/css/merchant-item.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function MerchantGetItems() {
    const memberContext = useMember();
    const {
        token,
        merchants, setMerchants,
        merchantsLength, setMerchantsLength,
        user,
        setShowMenuImage,
        setShowCloseImage,
        backendUrlHost
    } = memberContext;
    const [items, setItems] = useState([]);
    console.log(memberContext);
    console.log('token', token);
    console.log('merchants', merchants);
    console.log('merchantsLength', merchantsLength);
    console.log('user', user);
    console.log('items', items);
    const router = useRouter();

    const handleCreateClick = () => {
        router.push("/members/merchants/items/create");
    }


    useEffect(() => {
        async function fetchItems() {
            console.log(token);
            const response = await fetch(`/api/members/merchants/item?merchant-username=${user}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            console.log(response);
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setItems(data.searchedItems);
            } else {
                setItems([]);
            }
            console.log(data.searchedItems);
            console.log(data.msg);
            console.log(items);
        }
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            fetchItems();
        }
    }, [token]);

    return (
        <div className={itemStyles.mainContentContainer}>
            <div className={itemStyles.heading}>My Items</div>
            <div className={itemStyles.createEditContainer}>
                <div onClick={handleCreateClick}>Create Item</div>
            </div>

            <div className={itemStyles.allItemContainer}>
                {
                    items.length > 0 ?
                        items.map(item => {
                            return (
                                <Link
                                    className={itemStyles.relevantItemLink}
                                    href={`/members/merchants/items/${item.item_id}`} key={item.item_id}
                                >
                                    <div className={itemStyles.itemContainer}>
                                        <img
                                            // src={`http://localhost:4000${item.pictures[0]}`} // Path relative to the public folder
                                            // src={`http://192.168.50.135:4000${item.pictures[0]}`} // Path relative to the public folder
                                            src={`http://${backendUrlHost}${item.pictures[0]}`} // Path relative to the public folder
                                            alt="image"
                                        />
                                        <br />
                                        <div className={itemStyles.itemName}>
                                            {item.item_name}
                                        </div>
                                    </div>
                                </Link>
                            )
                        }) : ""
                }
            </div>
        </div>
    );
}