"use client";

import { useMember } from "@/app/layout";
import {
    useParams,
    useRouter
} from "next/navigation";
import { useState, useEffect } from "react";
import editItemNameStyles from '@/app/css/edit-item-name.module.css';

export default function EditItemName() {
    const memberContext = useMember();
    const { token, setShowMenuImage, setShowCloseImage } = memberContext;
    const [newItemName, setNewItemName] = useState('');
    const params = useParams();
    const router = useRouter();

    const handleNewItemNameChange = async (e) => {
        console.log(e.target.value);
        setNewItemName(e.target.value);
    }

    const handleUpdateClick = async (e) => {
        const confirmUpdate = confirm("Are you sure you want to update this item name?");
        if (!confirmUpdate) {
            return;
        }
        e.preventDefault();
        // const formData = new FormData();
        // formData.append('newItemName', newItemName);
        console.log(newItemName);
        console.log(params.id);
        const response = await fetch(`/api/members/merchants/item/${params.id}/item-name`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            // body: formData
            body: JSON.stringify({ newItemName })
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
            router.push(`/members/merchants/items/edit-item-name-success/${params.id}`)
        } else {
            alert(data.msg);
        }
    }

    useEffect(() => {
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
        }
    }, [token]);


    return (
        <div className={editItemNameStyles.mainContentContainer}>
            <div className={editItemNameStyles.mainContent}>
                <form onSubmit={handleUpdateClick} >
                    <div className={editItemNameStyles.heading}>Edit Item Name</div>

                    <div className={editItemNameStyles.itemIdWrapper}>
                        <div className={editItemNameStyles.itemId} >Item Id:</div>
                        <div>{params.id}</div>
                    </div>

                    <div className={editItemNameStyles.currentItemNameWrapper}>
                        <div className={editItemNameStyles.currentItemName} >Current Item Name:</div>
                        <div>{params.originalName}</div>
                    </div>

                    <div className={editItemNameStyles.newItemNameWrapper} >
                        <label htmlFor='newItemName'>New Item Name:</label>
                        <input id='newItemName' type="text" placeholder='new item name'
                            onChange={handleNewItemNameChange}
                            required />
                    </div>
                    <div className={editItemNameStyles.updateWrapper}>
                        <input type='submit' value="Update" />
                    </div>
                </form>
            </div>
        </div >
    )
}