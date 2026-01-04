"use client";

import {
    useParams,
    useRouter
} from "next/navigation";
import { useMember } from "@/app/layout";
import { useAI } from '@/app/components/AIProvider';
import { useState, useEffect } from "react";
import PicOverlay from "@/app/components/PicOverlay";
import itemDetailsStyles from '@/app/css/client-item-details.module.css';
import SnackbarForLoading from '@/app/components/SnackBarForLoading';


export default function ClientItemDetails() {
    const memberContext = useMember();
    const { token, user, setShowMenuImage, setShowCloseImage, backendUrlHost } = memberContext;
    const [item, setItem] = useState(null);
    const [itemId, setItemId] = useState(null);
    const [itemName, setItemName] = useState(null);
    const [merchantUsername, setMerchantUsername] = useState(null);
    const [itemPictureId, setItemPictureId] = useState(null);
    const [itemPictures, setItemPictures] = useState(null);
    const [popupId, setPopupId] = useState(null);
    const [deletePictureOn, setDeletePictureOn] = useState(false);
    const params = useParams();
    const router = useRouter();
    console.log('item', item);
    console.log('itemId', itemId);
    console.log('itemName', itemName);
    console.log('merchantUsername', merchantUsername);
    console.log('itemPictureId', itemPictureId);
    console.log('itemPictures', itemPictures);
    console.log('popupId', popupId);
    console.log('deletePictureOn', deletePictureOn);

    const aiContext = useAI();
    const { registerVoiceControl, isLoading, setIsLoading } = aiContext;
    console.log('aiContext', aiContext);

    const handlePopupClick = (index) => {
        console.log(itemPictureId[index]);
        console.log(index);
        setPopupId(index);
    }

    const handleCloseOverlayClick = (index) => {
        console.log(index);
        setPopupId(null);
    }

    useEffect(() => {
        async function fetchItem() {
            console.log(token);
            console.log(params.id);
            const response = await fetch(`/api/members/clients/items?item-id=${params.id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            const data = await response.json();
            console.log(data);
            if (data.success) {
                console.log(data.searchedItems);
                console.log(data.searchedItems[0].item_id);
                console.log(data.searchedItems[0].item_name);
                console.log(data.searchedItems[0].merchant_username);
                console.log(data.searchedItems[0].item_picture_id);
                console.log(data.searchedItems[0].item_picture_id.length);
                console.log(data.searchedItems[0].pictures);
                setItem(data.searchedItems);
                setItemId(data.searchedItems[0].item_id);
                setItemName(data.searchedItems[0].item_name);
                setMerchantUsername(data.searchedItems[0].merchant_username);
                setItemPictureId(data.searchedItems[0].item_picture_id);
                setItemPictures(data.searchedItems[0].pictures);
            } else {
                console.log(data.searchedItems);
                console.log(data.searchedItems[0].item_id);
                console.log(data.searchedItems[0].item_name);
                console.log(data.searchedItems[0].merchant_username);
                console.log(data.searchedItems[0].item_picture_id);
                console.log(data.searchedItems[0].item_picture_id.length);
                console.log(data.searchedItems[0].pictures);
                setItem(null);
                setItemId(null);
                setItemName(null);
                setMerchantUsername(null);
                setItemPictureId(null);
                setItemPictures(null);
            }
        }
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            fetchItem();
        }
    }, [token, params.id]);

    return (

        <div className={itemDetailsStyles.root}>
            <SnackbarForLoading
                message='Loading...'
                show={isLoading}
            />
            <div className={itemDetailsStyles.heading}>Item Info</div>

            <div className={itemDetailsStyles.itemIdWrapper}>
                <div className={itemDetailsStyles.itemId}>Item Id:</div>
                <div className={itemDetailsStyles.itemIdValue}>
                    {item ? item[0].item_id : ""}
                </div>
            </div>

            <div className={itemDetailsStyles.itemNameWrapper}>
                <div className={itemDetailsStyles.itemName}>Item Name:</div>
                <div className={itemDetailsStyles.itemNameValue}>
                    {item ? item[0].item_name : ""}
                </div>
            </div>

            <div className={itemDetailsStyles.merchantWrapper}>
                <div className={itemDetailsStyles.merchant}>Merchant:</div>
                <div className={itemDetailsStyles.merchantValue}>
                    {item ? item[0].merchant_username : ""}
                </div>
            </div>

            <div className={itemDetailsStyles.allPictureWrapper}>
                {itemPictures ? itemPictures.map((picture, index) => {
                    return (
                        <div key={index}>
                            <div
                                key={index}
                                className={itemDetailsStyles.pictureContainer}
                                onClick={() => handlePopupClick(index)}
                            >
                                <img
                                    // src={`http://localhost:4000${picture}`}
                                    // src={`http://192.168.50.135:4000${picture}`}
                                    src={`http://${backendUrlHost}${picture}`}
                                    id={`picture${index}`}
                                    className={itemDetailsStyles.img}
                                />
                                {popupId === index ?
                                    <PicOverlay id={index}>
                                        <img
                                            // src={`http://localhost:4000${picture}`}
                                            // src={`http://192.168.50.135:4000${picture}`}
                                            src={`http://${backendUrlHost}${picture}`}
                                            id={`magnifiedImg${index}`}
                                            className={itemDetailsStyles.magnifiedImg}
                                        />
                                        <div
                                            id={`closeBtn${index}`}
                                            className={itemDetailsStyles.closeBtn}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCloseOverlayClick(index);
                                            }}
                                        >
                                            <div>
                                                x
                                            </div>
                                        </div>
                                    </PicOverlay>
                                    : ""}


                            </div>
                        </div>
                    )
                }) : ""}
            </div>

        </div >
    )
}