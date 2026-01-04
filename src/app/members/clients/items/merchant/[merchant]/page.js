"use client";

import { useState, useEffect, useRef } from "react";
import { useMember } from "@/app/layout";
import { useAI } from '@/app/components/AIProvider';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import SnackBar from '@/app/components/SnackBar';
import SnackbarForLoading from '@/app/components/SnackBarForLoading';
import itemStyles from '@/app/css/client-item.module.css';
import plusImage from '@/app/img/plus.svg';
import minusImage from '@/app/img/minus.svg';

export default function ClientGetSelectedItems() {
    const memberContext = useMember();
    const { token, itemQuantityState, setItemQuantityState, orderCartState, setOrderCartState, merchants, setMerchants, setShowMenuImage, setShowCloseImage, backendUrlHost } = memberContext;
    const params = useParams();
    const merchantParam = params.merchant;
    console.log('merchantParam', merchantParam);
    const [items, setItems] = useState([]);
    const [selectedMerchant, setSelectedMerchant] = useState(merchantParam);
    const [selectedItems, setSelectedItems] = useState([]);
    const [show, setShow] = useState(false);
    const timerRef = useRef(null);
    console.log('memberContext', memberContext);
    console.log('token', token);
    console.log('itemQuantityState', itemQuantityState);
    console.log('orderCartState', orderCartState);
    console.log('merchants', merchants);
    console.log('items', items);
    console.log('selectedMerchant', selectedMerchant);
    console.log('selectedItems', selectedItems);
    console.log('show', show);
    console.log('timerRef', timerRef);
    const router = useRouter();

    const aiContext = useAI();
    const { registerVoiceControl, isLoading, setIsLoading } = aiContext;
    console.log('aiContext', aiContext);

    let pageCommands = [
        {
            command: "ADD_TO_ORDER_CART",
            payload: {
                item: {
                    itemId: "integer",
                    itemName: "string",
                    merchant: "string"
                },
                quantity: "integer"
            }
        },
        {
            command: "ADD_MULTIPLE_TO_ORDER_CART",
            payload: {
                items: [
                    {
                        item: {
                            itemId: "integer",
                            itemName: "string",
                            merchant: "string"
                        },
                        quantity: "integer"
                    }
                ]
            }
        }
    ];

    useEffect(() => {
        (
            async () => {
                // console.log('items', items);
                console.log('selectedItems', selectedItems);
                // if (selectedItems.length < 1) {
                //     return;
                // }
                // let itemInfo = items.map(item => ({
                let itemInfo = selectedItems.map(selectedItem => ({
                    itemId: selectedItem.item_id,
                    itemName: selectedItem.item_name,
                    merchant: selectedItem.merchant_username
                }));
                console.log('itemInfo', itemInfo);
                let availablePayloads = {
                    item: itemInfo
                };
                console.log('pageCommands', pageCommands);
                console.log('availablePayloads', availablePayloads);
                registerVoiceControl(pageCommands, availablePayloads, (resolvedCommand) => {
                    console.log('resolvedCommand in merchant list', resolvedCommand);
                    console.log('resolvedCommand.command', resolvedCommand.command);
                    console.log('resolvedCommand.payload', resolvedCommand.payload);

                    if (resolvedCommand.command === "ADD_TO_ORDER_CART" && resolvedCommand.payload && resolvedCommand.payload.item.merchant === selectedMerchant) {
                        // handleQuantityChange(resolvedCommand.payload.item.itemId, resolvedCommand.payload.quantity);
                        console.log(typeof resolvedCommand.payload.quantity);
                        console.log(resolvedCommand.payload.quantity);
                        if (
                            typeof resolvedCommand.payload.quantity === "number"
                            && resolvedCommand.payload.quantity >= 1
                            && resolvedCommand.payload.quantity <= 1000
                        ) {
                            handleQuantityChange(resolvedCommand.payload.item.itemId, resolvedCommand.payload.quantity);
                            handleAddToOrderCartClick(resolvedCommand.payload.item.itemId);
                            triggerSnackbar();
                        }


                    } else if (resolvedCommand.command === "ADD_MULTIPLE_TO_ORDER_CART" && resolvedCommand.payload) {
                        console.log('CCC____ADD_MULTIPLE_TO_ORDER_CART');
                        for (let i = 0; i < resolvedCommand.payload.items.length; i++) {
                            const itemId = resolvedCommand.payload.items[i].item.itemId;
                            const quantity = resolvedCommand.payload.items[i].quantity;
                            const merchant = resolvedCommand.payload.items[i].item.merchant;
                            console.log('CCCitemId', itemId);
                            console.log('CCCquantity', quantity);
                            console.log('CCCmerchant', merchant);
                            // handleQuantityChange(itemId, quantity);
                            if (
                                typeof quantity === "number"
                                && quantity >= 1
                                && quantity <= 1000
                                && merchant === selectedMerchant
                            ) {
                                handleQuantityChange(itemId, quantity);
                                handleAddToOrderCartClick(itemId);
                                triggerSnackbar();
                            }
                        }
                    }
                });
            }
        )();
    }, [selectedItems]);


    function handleSelectedMerchantChange(targetMerchant) {
        console.log('targetMerchant', targetMerchant);
        if (targetMerchant === "<All merchants>") {
            router.push('/members/clients/items');
            // return setSelectedMerchant(targetMerchant);
        } else {
            router.push(`/members/clients/items/merchant/${targetMerchant}`);
        }
    }

    function handlePlusClick(targetId) {
        console.log(itemQuantityState);
        // const targetId = e.target.id.split(" ")[1];
        // console.log(targetId);

        const currentQuantity = itemQuantityState[targetId].itemQuantity;
        console.log("typeof currentQuantity", typeof currentQuantity);
        console.log("currentQuantity", currentQuantity);

        let nextItemQuantityState = {
            ...itemQuantityState
        };

        if (currentQuantity === "") {
            nextItemQuantityState[targetId] = {
                ...nextItemQuantityState[targetId],
                itemQuantity: 1,
                quantityIsOk: true,
                isNaNTextOn: false,
                isNotAnIntegerTextOn: false,
                minMaxNumTextOn: false
            }
            // return setItemQuantityState(nextItemQuantityState);
            return setItemQuantityState((state) => nextItemQuantityState);
        }

        if (typeof currentQuantity === "number") {
            if (
                currentQuantity + 1 < 1
                || currentQuantity + 1 > 1000
            ) {
                nextItemQuantityState[targetId] = {
                    ...nextItemQuantityState[targetId],
                    itemQuantity: currentQuantity + 1,
                    quantityIsOk: false,
                    isNaNTextOn: false,
                    isNotAnIntegerTextOn: false,
                    minMaxNumTextOn: true
                }
                // return setItemQuantityState(nextItemQuantityState);
                return setItemQuantityState((state) => nextItemQuantityState);
            }

            if (
                currentQuantity + 1 >= 1
                && currentQuantity + 1 <= 1000
            ) {
                nextItemQuantityState[targetId] = {
                    ...nextItemQuantityState[targetId],
                    itemQuantity: currentQuantity + 1,
                    quantityIsOk: true,
                    isNaNTextOn: false,
                    isNotAnIntegerTextOn: false,
                    minMaxNumTextOn: false
                }
                // return setItemQuantityState(nextItemQuantityState);
                return setItemQuantityState((state) => nextItemQuantityState);
            }


        }

    }

    function handleMinusClick(targetId) {
        console.log(itemQuantityState);
        // const targetId = e.target.id.split(" ")[1];
        // console.log(targetId);

        const currentQuantity = itemQuantityState[targetId].itemQuantity;
        console.log("typeof currentQuantity", typeof currentQuantity);
        console.log("currentQuantity", currentQuantity);

        let nextItemQuantityState = {
            ...itemQuantityState
        };

        if (currentQuantity === "") {
            nextItemQuantityState[targetId] = {
                ...nextItemQuantityState[targetId],
                itemQuantity: -1,
                quantityIsOk: false,
                isNaNTextOn: false,
                isNotAnIntegerTextOn: false,
                minMaxNumTextOn: true
            }
            // return setItemQuantityState(nextItemQuantityState);
            return setItemQuantityState((state) => nextItemQuantityState);
        }

        if (typeof currentQuantity === "number") {
            if (
                currentQuantity - 1 < 1
                || currentQuantity - 1 > 1000
            ) {
                nextItemQuantityState[targetId] = {
                    ...nextItemQuantityState[targetId],
                    itemQuantity: currentQuantity - 1,
                    quantityIsOk: false,
                    isNaNTextOn: false,
                    isNotAnIntegerTextOn: false,
                    minMaxNumTextOn: true
                }
                // return setItemQuantityState(nextItemQuantityState);
                return setItemQuantityState((state) => nextItemQuantityState);
            }

            if (
                currentQuantity - 1 >= 1
                && currentQuantity - 1 <= 1000
            ) {
                nextItemQuantityState[targetId] = {
                    ...nextItemQuantityState[targetId],
                    itemQuantity: currentQuantity - 1,
                    quantityIsOk: true,
                    isNaNTextOn: false,
                    isNotAnIntegerTextOn: false,
                    minMaxNumTextOn: false
                }
                // return setItemQuantityState(nextItemQuantityState);
                return setItemQuantityState((state) => nextItemQuantityState);
            }
        }


    }

    function handleQuantityChange(targetId, targetQuantity) {
        console.log('targetQuantity', targetQuantity);
        console.log(itemQuantityState);

        // const targetId = e.target.id.split(" ")[1];
        // console.log(e.target.value);
        console.log(targetId);
        console.log(targetQuantity);
        console.log(Number(targetQuantity));
        // console.log(Number(e.target.value));

        const newValue = targetQuantity;
        // const newValue = e.target.value;
        console.log("newValue", newValue);
        console.log(typeof newValue);

        // let nextItemQuantityState = {
        //     ...itemQuantityState
        // };

        if (newValue === "") {
            // nextItemQuantityState[targetId] = {
            //     ...nextItemQuantityState[targetId],
            //     itemQuantity: "",
            //     quantityIsOk: false,
            //     isNaNTextOn: false,
            //     isNotAnIntegerTextOn: false,
            //     minMaxNumTextOn: false
            // }
            // return setItemQuantityState(nextItemQuantityState);
            return setItemQuantityState((previousItemQuantityState) => {
                console.log('previousItemQuantityState', previousItemQuantityState);
                let nextItemQuantityState = {
                    ...previousItemQuantityState
                };
                console.log('AAAnextItemQuantityState', nextItemQuantityState);
                nextItemQuantityState[targetId] = {
                    ...nextItemQuantityState[targetId],
                    itemQuantity: "",
                    quantityIsOk: false,
                    isNaNTextOn: false,
                    isNotAnIntegerTextOn: false,
                    minMaxNumTextOn: false
                }
                console.log('BBBnextItemQuantityState', nextItemQuantityState);
                return nextItemQuantityState;

            });

        }

        if (isNaN(newValue)) {

            // nextItemQuantityState[targetId] = {
            //     ...nextItemQuantityState[targetId],
            //     // itemQuantity: "",
            //     itemQuantity: newValue,
            //     quantityIsOk: false,
            //     isNaNTextOn: true,
            //     isNotAnIntegerTextOn: false,
            //     minMaxNumTextOn: false
            // }
            // return setItemQuantityState(nextItemQuantityState);
            return setItemQuantityState((previousItemQuantityState) => {
                console.log('previousItemQuantityState', previousItemQuantityState);
                let nextItemQuantityState = {
                    ...previousItemQuantityState
                };
                console.log('AAAnextItemQuantityState', nextItemQuantityState);
                nextItemQuantityState[targetId] = {
                    ...nextItemQuantityState[targetId],
                    // itemQuantity: "",
                    itemQuantity: newValue,
                    quantityIsOk: false,
                    isNaNTextOn: true,
                    isNotAnIntegerTextOn: false,
                    minMaxNumTextOn: false
                }
                console.log('BBBnextItemQuantityState', nextItemQuantityState);
                return nextItemQuantityState;

            });
        }

        console.log("Number(newValue)", Number(newValue));
        console.log("newValue", newValue);


        const pattern = /[0-9]/;
        console.log(pattern.test(newValue));
        // if (newValue.includes(".")) {
        if (newValue.toString().includes(".")) {
            console.log("Number(newValue)", Number(newValue));
            console.log("newValue", newValue);

            // nextItemQuantityState[targetId] = {
            //     ...nextItemQuantityState[targetId],
            //     // itemQuantity: "",
            //     // itemQuantity: Number(newValue),
            //     itemQuantity: newValue,
            //     quantityIsOk: false,
            //     isNaNTextOn: false,
            //     isNotAnIntegerTextOn: true,
            //     minMaxNumTextOn: false
            // }
            // return setItemQuantityState(nextItemQuantityState);
            return setItemQuantityState((previousItemQuantityState) => {
                console.log('previousItemQuantityState', previousItemQuantityState);
                let nextItemQuantityState = {
                    ...previousItemQuantityState
                };
                console.log('AAAnextItemQuantityState', nextItemQuantityState);
                nextItemQuantityState[targetId] = {
                    ...nextItemQuantityState[targetId],
                    // itemQuantity: "",
                    // itemQuantity: Number(newValue),
                    itemQuantity: newValue,
                    quantityIsOk: false,
                    isNaNTextOn: false,
                    isNotAnIntegerTextOn: true,
                    minMaxNumTextOn: false
                }
                console.log('BBBnextItemQuantityState', nextItemQuantityState);
                return nextItemQuantityState;
            });
        }


        if (Number(newValue) < 1 || Number(newValue) > 1000) {

            setItemQuantityState((previousItemQuantityState) => {
                console.log('previousItemQuantityState', previousItemQuantityState);
                let nextItemQuantityState = {
                    ...previousItemQuantityState
                };
                console.log('AAAnextItemQuantityState', nextItemQuantityState);

                nextItemQuantityState[targetId] = {
                    ...nextItemQuantityState[targetId],
                    // itemQuantity: "",
                    // itemQuantity: newValue,
                    itemQuantity: Number(newValue),
                    quantityIsOk: false,
                    isNaNTextOn: false,
                    isNotAnIntegerTextOn: false,
                    minMaxNumTextOn: true
                }
                console.log('BBBnextItemQuantityState', nextItemQuantityState);
                return nextItemQuantityState;

            })
        } else {
            setItemQuantityState((previousItemQuantityState) => {
                console.log('previousItemQuantityState', previousItemQuantityState);
                let nextItemQuantityState = {
                    ...previousItemQuantityState
                };
                console.log('AAAnextItemQuantityState', nextItemQuantityState);

                nextItemQuantityState[targetId] = {
                    ...nextItemQuantityState[targetId],
                    itemQuantity: Number(newValue),
                    quantityIsOk: true,
                    isNaNTextOn: false,
                    isNotAnIntegerTextOn: false,
                    minMaxNumTextOn: false
                }
                console.log('BBBnextItemQuantityState', nextItemQuantityState);
                return nextItemQuantityState;
            })

        }

        console.log('handleQuantityChange finished');

    }

    function handleAddToOrderCartClick(targetId) {
        console.log(itemQuantityState);
        console.log(orderCartState);
        // const targetId = e.target.id.split(" ")[1];
        // console.log(targetId);

        // let nextItemQuantityState = {
        //     ...itemQuantityState
        // };

        // let nextOrderCartState = {
        //     ...orderCartState
        // };
        console.log("orderCartState", orderCartState);

        // let needToTriggerSnackbar = false;

        setItemQuantityState((previousItemQuantityState) => {
            console.log('previousItemQuantityState', previousItemQuantityState);
            if (previousItemQuantityState[targetId].quantityIsOk) {

                setOrderCartState((previousOrderCartState) => {
                    console.log('previousOrderCartState', previousOrderCartState);
                    let nextOrderCartState = {
                        ...previousOrderCartState
                    };
                    console.log('AAAnextOrderCartState', nextOrderCartState);
                    nextOrderCartState[targetId] = {
                        ...nextOrderCartState[targetId],
                        itemId: previousItemQuantityState[targetId].itemId,
                        itemName: previousItemQuantityState[targetId].itemName,
                        itemQuantity: previousItemQuantityState[targetId].itemQuantity,
                        quantityIsOk: true
                    }
                    console.log('BBBnextOrderCartState', nextOrderCartState);
                    localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
                    return nextOrderCartState;
                });

                let nextItemQuantityState = {
                    ...previousItemQuantityState
                };
                console.log('AAAnextItemQuantityState', nextItemQuantityState);

                nextItemQuantityState[targetId] = {
                    ...nextItemQuantityState[targetId],
                    addedToOrderCartAlready: true
                }

                console.log('BBBnextItemQuantityState', nextItemQuantityState);
                localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
                // needToTriggerSnackbar = true;
                return nextItemQuantityState;
            } else {
                setOrderCartState((previousOrderCartState) => {
                    console.log('previousOrderCartState', previousOrderCartState);
                    localStorage.setItem('orderCart', JSON.stringify(previousOrderCartState));
                    return previousOrderCartState;
                });
                localStorage.setItem('itemQuantity', JSON.stringify(previousItemQuantityState));
                // needToTriggerSnackbar = false;
                return previousItemQuantityState;
            }

        });
        // if (needToTriggerSnackbar) {
        //     triggerSnackbar();
        // }
        console.log('handleAddToOrderCartClick finished');



        // if (itemQuantityState[targetId].quantityIsOk) {
        //     nextItemQuantityState[targetId] = {
        //         ...nextItemQuantityState[targetId],
        //         addedToOrderCartAlready: true
        //     }

        //     nextOrderCartState[targetId] = {
        //         ...nextOrderCartState[targetId],
        //         itemId: itemQuantityState[targetId].itemId,
        //         itemName: itemQuantityState[targetId].itemName,
        //         itemQuantity: itemQuantityState[targetId].itemQuantity,
        //         quantityIsOk: true
        //     }
        //     console.log(nextItemQuantityState);
        //     console.log(nextOrderCartState);
        //     setItemQuantityState(nextItemQuantityState);
        //     setOrderCartState(nextOrderCartState);
        //     triggerSnackbar();

        //     localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
        //     localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
        // }


    }


    function triggerSnackbar() {
        // Step 1: 清除舊計時器
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        // Step 2: 強制先隱藏（中斷動畫）
        setShow(false);

        // Step 3: 下一幀再顯示 → 觸發 CSS 淡入動畫
        requestAnimationFrame(() => {
            setShow(true);
        });

        // Step 4: 啟動新計時器
        timerRef.current = setTimeout(() => {
            setShow(false);
            timerRef.current = null;
        }, 3000);
    };


    useEffect(() => {
        if (merchantParam === "<All merchants>") {
            return router.push('/members/clients/items');
        }
        setSelectedMerchant(merchantParam);

        async function fetchItems() {

            const itemQuantity = JSON.parse(localStorage.getItem("itemQuantity"));
            const orderCart = JSON.parse(localStorage.getItem("orderCart"));
            console.log("itemQuantity", itemQuantity);
            console.log("orderCart", orderCart);

            console.log(token);
            const response = await fetch("/api/members/clients/items", {
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
                console.log(data.searchedItems);
                setItems(data.searchedItems);
                // setSelectedItems(data.searchedItems);

                let insertedItemQuantityState = {
                    ...itemQuantityState
                };

                for (let i = 0; i < data.searchedItems.length; i++) {
                    console.log(itemQuantityState);
                    console.log(insertedItemQuantityState);
                    console.log("itemQuantity", itemQuantity);
                    console.log("orderCart", orderCart);

                    // itemQuantityState.push({
                    //     itemId: data.searchedItems[i].item_id,
                    //     itemName: data.searchedItems[i].item_name,
                    //     itemQuantity: ""
                    // });

                    if (itemQuantity) {
                        insertedItemQuantityState[data.searchedItems[i].item_id] = {
                            // ...nextItemQuantityState[data.searchedItems[i].item_id],
                            itemId: data.searchedItems[i].item_id,
                            itemName: data.searchedItems[i].item_name,
                            // addedToOrderCartAlready: false,
                            // itemQuantity: "",
                            // quantityIsOk: false,
                            // isNaNTextOn: false,
                            // isNotAnIntegerTextOn: false,
                            // minMaxNumTextOn: false
                            addedToOrderCartAlready: itemQuantity[data.searchedItems[i].item_id] ?
                                itemQuantity[data.searchedItems[i].item_id].addedToOrderCartAlready : false,
                            itemQuantity: itemQuantity[data.searchedItems[i].item_id] ?
                                itemQuantity[data.searchedItems[i].item_id].itemQuantity : "",
                            quantityIsOk: itemQuantity[data.searchedItems[i].item_id] ?
                                itemQuantity[data.searchedItems[i].item_id].quantityIsOk : false,
                            isNaNTextOn: itemQuantity[data.searchedItems[i].item_id] ?
                                itemQuantity[data.searchedItems[i].item_id].isNaNTextOn : false,
                            isNotAnIntegerTextOn: itemQuantity[data.searchedItems[i].item_id] ?
                                itemQuantity[data.searchedItems[i].item_id].isNotAnIntegerTextOn : false,
                            minMaxNumTextOn: itemQuantity[data.searchedItems[i].item_id] ?
                                itemQuantity[data.searchedItems[i].item_id].minMaxNumTextOn : false

                        }
                        console.log(insertedItemQuantityState);

                    } else {
                        insertedItemQuantityState[data.searchedItems[i].item_id] = {
                            // ...nextItemQuantityState[data.searchedItems[i].item_id],
                            itemId: data.searchedItems[i].item_id,
                            itemName: data.searchedItems[i].item_name,
                            addedToOrderCartAlready: false,
                            itemQuantity: "",
                            quantityIsOk: false,
                            isNaNTextOn: false,
                            isNotAnIntegerTextOn: false,
                            minMaxNumTextOn: false
                            // addedToOrderCartAlready: itemQuantity[data.searchedItems[i].item_id] ?
                            //     itemQuantity[data.searchedItems[i].item_id].addedToOrderCartAlready : false,
                            // itemQuantity: itemQuantity[data.searchedItems[i].item_id] ?
                            //     itemQuantity[data.searchedItems[i].item_id].itemQuantity : "",
                            // quantityIsOk: itemQuantity[data.searchedItems[i].item_id] ?
                            //     itemQuantity[data.searchedItems[i].item_id].quantityIsOk : false,
                            // isNaNTextOn: itemQuantity[data.searchedItems[i].item_id] ?
                            //     itemQuantity[data.searchedItems[i].item_id].isNaNTextOn : false,
                            // isNotAnIntegerTextOn: itemQuantity[data.searchedItems[i].item_id] ?
                            //     itemQuantity[data.searchedItems[i].item_id].isNotAnIntegerTextOn : false,
                            // minMaxNumTextOn: itemQuantity[data.searchedItems[i].item_id] ?
                            //     itemQuantity[data.searchedItems[i].item_id].minMaxNumTextOn : false

                        }
                        console.log(insertedItemQuantityState);
                    }
                }
                // let nextItemQuantityState = {
                //     ...insertedItemQuantityState
                // };

                // let nextOrderCart = {
                //     ...orderCart
                // };
                console.log('CCCinsertedItemQuantityState', insertedItemQuantityState);
                for (let key in insertedItemQuantityState) {
                    if (!insertedItemQuantityState[key].itemId || !insertedItemQuantityState[key].itemName) {
                        delete insertedItemQuantityState[key];
                    }
                }

                // console.log('hi there1');

                console.log('DDDinsertedItemQuantityState', insertedItemQuantityState);
                let nextItemQuantityState = {
                    ...insertedItemQuantityState
                };

                let nextOrderCart = {
                    ...orderCart
                };

                console.log('hi there1');

                for (let key in nextOrderCart) {
                    console.log('hi there2');
                    console.log(key);
                    // if (orderCart.hasOwnProperty(key)) {
                    // if (key in nextOrderCart && key in nextItemQuantityState) {
                    //     nextItemQuantityState[key] = {
                    //         ...nextItemQuantityState[key],
                    //         // addedToOrderCartAlready: true,
                    //         // itemQuantity: nextOrderCart[key].itemQuantity,
                    //         // quantityIsOk: true
                    //     };
                    //     // nextItemQuantityState[key] = obj1[key];
                    // }
                    if (key in nextOrderCart && !(key in nextItemQuantityState)) {
                        delete nextOrderCart[key];
                    }
                }

                setItemQuantityState(nextItemQuantityState);
                setOrderCartState(nextOrderCart);
                localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
                localStorage.setItem('orderCart', JSON.stringify(nextOrderCart));

                // setItemQuantityState(insertedItemQuantityState);
            } else {
                setItems([]);
                // setSelectedItems([]);
                setItemQuantityState({});
                setOrderCartState({});
                localStorage.removeItem('itemQuantity');
                localStorage.removeItem('orderCart');
            }
            console.log(data.searchedItems);
            console.log(data.msg);
            console.log(items);
            console.log(itemQuantityState);
            console.log(orderCartState);
        }

        async function fetchMerchantList() {
            console.log(token);
            const response = await fetch('/api/members/clients/merchants', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log(response);
            const data = await response.json();
            console.log(data);
            if (data.success) {
                setMerchants(data.searchedMerchants);
                // setMerchantsLength(data.searchedMerchants.length);
            } else {
                setMerchants([]);
                // setMerchantsLength(0);
            }
            console.log(merchants);
            // console.log(merchantsLength);
        }

        async function fetchSelectedMerchantItems() {

            const itemQuantity = JSON.parse(localStorage.getItem("itemQuantity"));
            const orderCart = JSON.parse(localStorage.getItem("orderCart"));
            console.log("itemQuantity", itemQuantity);
            console.log("orderCart", orderCart);

            console.log(token);
            const response = await fetch(`/api/members/clients/items?merchant-username=${merchantParam}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response);
            const data = await response.json();
            console.log(data);
            if (data.success) {
                console.log(data.searchedItems);
                setSelectedItems(data.searchedItems);
                setSelectedMerchant(merchantParam);

            } else {
                setSelectedItems([]);
                setSelectedMerchant(merchantParam);
            }
        }

        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            fetchItems();
            fetchMerchantList();
            fetchSelectedMerchantItems();
        }


        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };

    }, [token]);


    return (
        <div className={itemStyles.mainContentContainer}>
            <div className={itemStyles.heading}>Items</div>
            <SnackBar
                message='Added to order cart already'
                show={show}
            />
            <SnackbarForLoading
                message='Loading...'
                show={isLoading}
            />

            {
                merchants.length > 0 ?
                    <div className={itemStyles.merchantSelectionContainer}>
                        <label htmlFor="cars">Choose a merchant: </label>
                        <select
                            name="merchants"
                            id="merchants"
                            value={selectedMerchant}
                            className={itemStyles.merchantSelection}
                            onChange={e => handleSelectedMerchantChange(e.target.value)}
                        >
                            <option>{String("<All merchants>")}</option>
                            {
                                merchants.map(merchant =>
                                    <option key={merchant.member_username} value={merchant.member_username}>
                                        {merchant.member_username}
                                    </option>
                                )
                            }
                        </select>
                    </div> : ""
            }

            <div className={itemStyles.allItemContainer}>
                {
                    items.length < 1 || selectedItems.length < 1 && selectedMerchant !== "<All merchants>" ?
                        <div className={itemStyles.noItemsYet}>No items yet.</div> : ""
                }
                {
                    selectedItems.length > 0 ?
                        selectedItems.map((item, i) => {
                            return (
                                <div key={item.item_id}>
                                    <Link
                                        className={itemStyles.relevantItemLink}
                                        href={`/members/clients/items/${item.item_id}`}
                                    >
                                        <div className={itemStyles.itemContainer}>
                                            <img
                                                // src={`http://localhost:4000${item.pictures[0]}`} // Path relative to the public folder
                                                // src={`http://192.168.50.135:4000${item.pictures[0]}`} // Path relative to the public folder
                                                src={`http://${backendUrlHost}${item.pictures[0]}`} // Path relative to the public folder
                                                alt="image"
                                                className={itemStyles.itemImg}
                                            />
                                            <br />
                                            <div className={itemStyles.itemName}>
                                                {item.item_name}
                                            </div>
                                        </div>
                                    </Link>
                                    <div className={itemStyles.plusBtnQuantityInputMinusBtnContainer}>

                                        <img
                                            src={plusImage.src}
                                            className={itemStyles.plusImg}
                                            // id={`plusId ${item.item_id}`}
                                            // id={`plusIndex ${i}`}
                                            onClick={() => handlePlusClick(item.item_id)}
                                            style={{
                                                display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "none" : "block"
                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                            }}
                                        />

                                        <input
                                            // type="number"
                                            type="text"
                                            className={itemStyles.quantityInput}
                                            // max={1000}
                                            // min={0}
                                            placeholder="0"
                                            // value={itemQuantityState[item.item_id].itemQuantity}
                                            // value={itemQuantityState[i].itemQuantity}
                                            // id={`quantityId ${item.item_id}`}
                                            // data-id={item.item_id}
                                            // id={`quantityIndex ${i}`}
                                            value={itemQuantityState[item.item_id].itemQuantity}
                                            onChange={e => handleQuantityChange(item.item_id, e.target.value)}
                                            // onChange={(e)=>handleQuantityChange(item.item_id, document.querySelector(`quantityId ${item.item_id}`).dataset.id)}
                                            style={{
                                                display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "none" : "block"
                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                            }}
                                        />

                                        <img
                                            src={minusImage.src}
                                            className={itemStyles.minusImg}
                                            // id={`minusId ${item.item_id}`}
                                            // id={`minusIndex ${i}`}
                                            onClick={() => handleMinusClick(item.item_id)}
                                            style={{
                                                display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "none" : "block"
                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                            }}
                                        />

                                        {/* if addedToOrderCartAlready is true, run the following code */}

                                        <img
                                            src={plusImage.src}
                                            // className={itemStyles.plusImg}
                                            className={itemStyles.plusImgWithoutHover}
                                            id={`plusId ${item.item_id}`}
                                            // id={`plusIndex ${i}`}
                                            // onClick={handlePlusClick}
                                            style={{
                                                display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "block" : "none"
                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                            }}
                                        />

                                        <input
                                            type="text"
                                            className={itemStyles.quantityInput}
                                            // max={1000}
                                            // min={0}
                                            placeholder="0"
                                            // value={itemQuantityState[item.item_id].itemQuantity}
                                            // value={itemQuantityState[i].itemQuantity}
                                            id={`quantityId ${item.item_id}`}
                                            // id={`quantityIndex ${i}`}
                                            value={itemQuantityState[item.item_id].itemQuantity}
                                            onChange={handleQuantityChange}
                                            style={{
                                                display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "block" : "none"
                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                            }}
                                            // readOnly
                                            disabled
                                        />

                                        <img
                                            src={minusImage.src}
                                            // className={itemStyles.minusImg}
                                            className={itemStyles.minusImgWithoutHover}
                                            id={`minusId ${item.item_id}`}
                                            // id={`minusIndex ${i}`}
                                            // onClick={handleMinusClick}
                                            style={{
                                                display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "block" : "none"
                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                            }}
                                        />



                                    </div>

                                    <div className={itemStyles.addToOrderCartContainer}>
                                        <div
                                            // id={`addToOrderCart ${item.item_id}`}
                                            className={itemStyles.addToOrderCart}
                                            style={{
                                                display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "none" : "block"
                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                            }}
                                            onClick={() => {
                                                if (itemQuantityState[item.item_id].quantityIsOk) {
                                                    handleAddToOrderCartClick(item.item_id);
                                                    triggerSnackbar();
                                                }
                                            }}
                                        >
                                            Add to order cart
                                        </div>
                                    </div>
                                    <div className={itemStyles.addedToOrderCartAlreadyContainer}>
                                        <div
                                            className={itemStyles.addedToOrderCartAlready}
                                            style={{
                                                display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "block" : "none",
                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                            }}
                                        >
                                            Added to order cart already
                                        </div>
                                    </div>



                                    <div
                                        style={{
                                            height:
                                                !itemQuantityState[item.item_id].isNaNTextOn
                                                    && !itemQuantityState[item.item_id].isNotAnIntegerTextOn
                                                    && !itemQuantityState[item.item_id].minMaxNumTextOn
                                                    ? "37px" : 0
                                        }}
                                    >
                                    </div>
                                    <div className={itemStyles.isNaNTextContainer}>
                                        <div
                                            className={itemStyles.isNaNText}
                                            style={{
                                                display: itemQuantityState[item.item_id].isNaNTextOn ? "block" : "none",
                                                // display: isNaNTextOn ? "block" : "none"
                                            }}
                                        >
                                            You can only input an integer or leave it empty.
                                        </div>
                                    </div>

                                    <div
                                        className={itemStyles.isNotAnIntegerText}
                                        style={{
                                            display: itemQuantityState[item.item_id].isNotAnIntegerTextOn ? "block" : "none"
                                            // display: isNotAnIntegerTextOn ? "block" : "none"
                                        }}
                                    >
                                        You can only input an integer.
                                    </div>

                                    <div
                                        className={itemStyles.minMaxNumText}
                                        style={{
                                            display: itemQuantityState[item.item_id].minMaxNumTextOn ? "block" : "none"
                                            // display: minMaxNumTextOn ? "block" : "none"
                                        }}
                                    >
                                        The minimum number is 1. <br />
                                        The maximum number is 1000.
                                    </div>

                                </div>
                            )
                        }) : ""
                }



            </div>





        </div>




    )


}