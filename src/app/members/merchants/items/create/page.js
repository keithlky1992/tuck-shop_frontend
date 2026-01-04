"use client";

import createItemStyles from '@/app/css/create-item.module.css';
import { useMember } from '@/app/layout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateItem() {
    const memberContext = useMember();
    const { token, setShowMenuImage, setShowCloseImage } = memberContext;
    const [itemName, setItemName] = useState('');
    console.log(itemName);
    const [itemPic, setItemPic] = useState([]);
    const [lengthOfPicture, setLengthOfPicture] = useState(0);
    console.log(itemPic);
    console.log(lengthOfPicture);
    const router = useRouter();

    const handleItemNameChange = (e) => {
        console.log(e.target.value);
        setItemName(e.target.value);
    }
    const handlePictureChange = (e) => {
        if (e.target.files.length > 0) {
            console.log(e.target.files, e.target.files.length);
            setItemPic(e.target.files);
            setLengthOfPicture(e.target.files.length);
        } else {
            console.log(e.target.files, e.target.files.length);
            setItemPic([]);
            setLengthOfPicture(0);
        }
    }
    const handleCreateClick = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('itemName', itemName);
        if (lengthOfPicture > 10) {
            return alert("You can only upload up to 10 pictures");
        }
        if (lengthOfPicture < 1) {
            return alert("You need to upload at least 1 picture");
        }
        for (let i = 0; i < itemPic.length; i++) {
            formData.append('itemPic', itemPic[i]);
        }
        const response = await fetch('/api/members/merchants/item', {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })
        const data = await response.json();
        console.log(data);
        if (data.success) {
            // alert('Item created successfully');
            setItemName('');
            setItemPic([]);
            setLengthOfPicture(0);
            router.push('/members/merchants/items/create-item-success');
        } else {
            alert(data.msg);
        }
    }

    useEffect(() => {
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
        }
    }, [token])

    return (
        <div className={createItemStyles.mainContentContainer}>
            <div className={createItemStyles.mainContent}>
                <form onSubmit={handleCreateClick}>
                    <div className={createItemStyles.heading}>Create Item</div>
                    <div className={createItemStyles.itemNameWrapper}>
                        {/* <div className={createItemStyles.itemNameLabelWrapper}> */}
                        <label htmlFor='itemName'>Item Name:</label>
                        {/* </div> */}
                        <input id='itemName' type="text" placeholder='item name' onChange={handleItemNameChange} required />
                    </div>
                    <div className={createItemStyles.itemPictureWrapper}>
                        <button
                            type='button'
                            onClick={() => document.getElementById('itemPictureInput').click()}
                        >
                            Choose item pictures
                        </button>
                        <input
                            id='itemPictureInput'
                            type='file'
                            multiple
                            accept="image/*"
                            onChange={handlePictureChange}
                            style={{ display: "none" }}
                        // required
                        />
                        <span>
                            {
                                lengthOfPicture < 1 ? "No file chosen" :
                                    lengthOfPicture === 1 ? `${lengthOfPicture} file` :
                                        `${lengthOfPicture} files`
                            }
                        </span>
                    </div>
                    <div className={createItemStyles.createItemWrapper}>
                        <input type='submit' value="Create" />
                    </div>
                </form>
            </div>
        </div>
    )
}