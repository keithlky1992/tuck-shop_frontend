"use client";

import { useMember } from "@/app/layout";
import {
    useParams,
    useRouter
} from "next/navigation";
import { useState, useEffect } from "react";
import addPictureStyles from '@/app/css/add-picture.module.css';

export default function AddPicture() {
    const memberContext = useMember();
    const { token, setShowMenuImage, setShowCloseImage } = memberContext;
    const [itemPic, setItemPic] = useState([]);
    const [lengthOfPicture, setLengthOfPicture] = useState(0);
    console.log(itemPic);
    console.log(lengthOfPicture);
    const params = useParams();
    const router = useRouter();

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

    const handleConfirmClick = async (e) => {
        const confirmUpdate = confirm("Are you sure you want to add the picture(s) for this item?");
        if (!confirmUpdate) {
            return;
        }
        e.preventDefault();
        const formData = new FormData();
        if (lengthOfPicture > 10) {
            return alert("An item can only have up to 10 pictures.");
        }
        if (lengthOfPicture < 1) {
            return alert("You haven't chosen any picture to upload.");
        }
        for (let i = 0; i < itemPic.length; i++) {
            formData.append('itemPic', itemPic[i]);
        }
        console.log("itemPic:", itemPic);
        console.log("lengthOfPicture:", lengthOfPicture);
        console.log(params.id);
        const response = await fetch(`/api/members/merchants/item-id/${params.id}/item-picture`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
            router.push(`/members/merchants/items/add-picture-success/${params.id}`)
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
        <div className={addPictureStyles.mainContentContainer}>
            <div className={addPictureStyles.mainContent}>
                <form onSubmit={handleConfirmClick} >
                    <div className={addPictureStyles.heading}>Add Picture</div>

                    <div className={addPictureStyles.itemIdWrapper}>
                        <div className={addPictureStyles.itemId} >Item Id:</div>
                        <div>{params.id}</div>
                    </div>

                    <div className={addPictureStyles.currentItemNameWrapper}>
                        <div className={addPictureStyles.currentItemName} >Item Name:</div>
                        <div>{params.itemName}</div>
                    </div>

                    <div className={addPictureStyles.itemPictureWrapper}>
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


                    <div className={addPictureStyles.confirmWrapper}>
                        <input type='submit' value="Confirm" />
                    </div>
                </form>
            </div>
        </div >
    )
}