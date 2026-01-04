"use client";

import {
    useParams,
    useRouter
} from "next/navigation";
import { useMember } from "@/app/layout";
import { useState, useEffect } from "react";
import PicOverlay from "@/app/components/PicOverlay";
import itemDetailsStyles from '@/app/css/merchant-item-details.module.css';

export default function MerchantItemDetails() {
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
    console.log('token', token);
    console.log('user', user);
    console.log('item', item);
    console.log('itemId', itemId);
    console.log('itemName', itemName);
    console.log('merchantUsername', merchantUsername);
    console.log('itemPictureId', itemPictureId);
    console.log('itemPictures', itemPictures);
    console.log('popupId', popupId);
    console.log('deletePictureOn', deletePictureOn);

    const handlePopupClick = (index) => {
        console.log(itemPictureId[index]);
        console.log(index);
        setPopupId(index);
    }

    const handleCloseOverlayClick = (index) => {
        console.log(index);
        setPopupId(null);
    }

    const handleDeletePictureClick = () => {
        if (user !== merchantUsername) {
            return alert("You are not authorized to delete pictures for this item.");
        }
        setDeletePictureOn(true);
    }

    const handleDeleteTargetPictureClick = async (pictureId) => {
        console.log("itemId", itemId);
        console.log("itemName", itemName);
        console.log("user", user);
        console.log("merchantUsername", merchantUsername);
        console.log("pictureId", pictureId);
        const confirmDelete = confirm("Are you sure you want to delete this picture?");
        if (confirmDelete) {
            if (itemPictureId.length < 2) {
                return alert("You cannot delete this picture. An item must have at least one picture.");
            }
            const response = await fetch(`/api/members/merchants/item-picture/${pictureId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    pictureId
                })
            })
            const data = await response.json();
            console.log(data);
            if (data.success) {
                console.log(data.msg);
                setDeletePictureOn(false);
                router.push(`/members/merchants/items/delete-item-picture-success/${itemId}`)
            } else {
                console.log(data.msg);
                alert(data.msg);
            }
        }
    }

    const handleEditNameClick = () => {
        console.log(itemId);
        console.log(itemName);
        console.log(user);
        console.log(merchantUsername);
        if (user !== merchantUsername) {
            return alert("You are not authorized to edit this item name.");
        }
        router.push(`/members/merchants/items/${itemId}/edit-item-name/${itemName}`);
    }

    const handleAddPictureClick = () => {
        console.log(itemId);
        console.log(itemName);
        console.log(user);
        console.log(merchantUsername);
        if (user !== merchantUsername) {
            return alert("You are not authorized to add pictures for this item.");
        }
        router.push(`/members/merchants/items/${itemId}/add-picture/${itemName}`);
    }

    const handleDeleteItemClick = async () => {
        console.log(itemId);
        const confirmDelete = confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            if (user !== merchantUsername) {
                return alert("You are not authorized to delete this item.");
            }
            const response = await fetch(`/api/members/merchants/item/${itemId}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    itemId
                })
            })
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setItem(null);
                setItemId(null);
                setItemName(null);
                setMerchantUsername(null);
                setItemPictureId(null);
                setItemPictures(null);
                setPopupId(null);
                router.push('/members/merchants/items/delete-item-success');
            } else {
                alert(data.msg);
            }
        }

    }


    useEffect(() => {
        async function fetchItem() {
            console.log(token);
            console.log(params.id);
            const response = await fetch(`/api/members/merchants/item?item-id=${params.id}&merchant-username=${user}`, {
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
                // console.log(data.searchedItems[0].item_id);
                // console.log(data.searchedItems[0].item_name);
                // console.log(data.searchedItems[0].merchant_username);
                // console.log(data.searchedItems[0].item_picture_id);
                // console.log(data.searchedItems[0].item_picture_id.length);
                // console.log(data.searchedItems[0].pictures);
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
            <div className={itemDetailsStyles.heading}>Item Info</div>



            {
                item ?
                    <>

                        <div className={itemDetailsStyles.itemIdWrapper}>
                            <div className={itemDetailsStyles.itemId}>Item Id:</div>
                            <div className={itemDetailsStyles.itemIdValue}>
                                {item ? item[0].item_id : ""}
                            </div>
                        </div>

                        <div className={itemDetailsStyles.itemNameEditNameWrapper}>
                            <div className={itemDetailsStyles.itemNameWrapper}>
                                <div className={itemDetailsStyles.itemName}>Item Name:</div>
                                <div className={itemDetailsStyles.itemNameValue}>
                                    {item ? item[0].item_name : ""}
                                </div>
                            </div>
                            <div
                                className={itemDetailsStyles.editNameForBrowser}
                                onClick={handleEditNameClick}
                                style={user !== merchantUsername ? { display: 'none' } : {}}
                            >
                                Edit item name
                            </div>
                        </div>
                        <div
                            className={itemDetailsStyles.editNameForPhone}
                            onClick={handleEditNameClick}
                            style={user !== merchantUsername ? { display: 'none' } : {}}
                        >
                            Edit item name
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
                                            {deletePictureOn ?
                                                <div
                                                    className={itemDetailsStyles.deleteTargetPicture}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteTargetPictureClick(itemPictureId[index])
                                                    }}
                                                >
                                                    <div>
                                                        x
                                                    </div>
                                                </div> : ""}
                                            {deletePictureOn ?
                                                <div
                                                    className={itemDetailsStyles.exitDeleteMode}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeletePictureOn(false)
                                                    }
                                                    }
                                                >
                                                    <div>
                                                        Exit delete mode
                                                    </div>
                                                </div> : ""}
                                        </div>
                                    </div>
                                )
                            }) : ""}
                        </div>

                        <div
                            className={itemDetailsStyles.addPicture}
                            onClick={handleAddPictureClick}
                            style={user !== merchantUsername ? { display: 'none' } : {}}

                        >
                            Add picture
                        </div>

                        <div
                            className={itemDetailsStyles.deletePicture}
                            onClick={handleDeletePictureClick}
                            style={user !== merchantUsername ? { display: 'none' } : {}}

                        >
                            Delete picture
                        </div>

                        <div
                            className={itemDetailsStyles.deleteItem}
                            onClick={handleDeleteItemClick}
                            style={user !== merchantUsername ? { display: 'none' } : {}}

                        >
                            Delete this item
                        </div>
                    </>
                    : <div className={itemDetailsStyles.noItemShow}>
                        You are not authorized to access this resource or this item does not exist.
                    </div>
            }
        </div >
    )
}