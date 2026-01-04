"use client";

import { useState, useEffect } from 'react';
import { useMember } from '@/app/layout';
import { useAI } from '@/app/components/AIProvider';
import { useRouter } from 'next/navigation';
import orderCartStyles from '@/app/css/order-cart.module.css';
import plusImage from '@/app/img/plus.svg';
import minusImage from '@/app/img/minus.svg';
import SnackbarForLoading from '@/app/components/SnackBarForLoading';


export default function Page() {
    return <OrderCart key={Math.random()} />
}


export function OrderCart() {
    const memberContext = useMember();
    const {
        token,
        itemQuantityState,
        setItemQuantityState,
        orderCartState,
        setOrderCartState,
        latestOrderId,
        setLatestOrderId,
        setShowMenuImage,
        setShowCloseImage
    } = memberContext;

    const aiContext = useAI();
    const { registerVoiceControl, isLoading, setIsLoading } = aiContext;
    console.log('aiContext', aiContext);

    // setItemQuantityState(previousItemQuantityState => {
    //     let nextItemQuantityState = { ...previousItemQuantityState };
    //     for (let key in nextItemQuantityState) {
    //         if (!nextItemQuantityState[key].itemId || !nextItemQuantityState[key].itemName) {
    //             delete nextItemQuantityState[key];
    //         }
    //     }
    //     return nextItemQuantityState;
    // });

    // setOrderCartState(previousOrderCartState => {
    //     let nextOrderCartState = { ...previousOrderCartState };
    //     for (let key in nextOrderCartState) {
    //         if (!nextOrderCartState[key].itemId || !nextOrderCartState[key].itemName) {
    //             delete nextOrderCartState[key];
    //         }
    //     }
    //     return nextOrderCartState;
    // });

    console.log('memberContext', memberContext);
    console.log('token', token);
    console.log('itemQuantityState', itemQuantityState);
    console.log('orderCartState', orderCartState);
    console.log('latestOrderId', latestOrderId);

    let orderCartStateArr;

    if (orderCartState) {
        orderCartStateArr = Object.values(orderCartState);
    }
    console.log('orderCartStateArr', orderCartStateArr);
    const router = useRouter();
    // const orderCart = localStorage.getItem('orderCart');
    // console.log(orderCart);

    const handlePlusClick = (targetId) => {
        console.log(itemQuantityState);
        console.log(orderCartState);
        // const targetId = e.target.id.split(" ")[1];
        // console.log(targetId);

        const currentQuantity = itemQuantityState[targetId].itemQuantity;
        console.log("typeof currentQuantity", typeof currentQuantity);
        console.log("currentQuantity", currentQuantity);

        let nextItemQuantityState = {
            ...itemQuantityState
        };

        let nextOrderCartState = {
            ...orderCartState
        }


        if (currentQuantity === "") {
            nextItemQuantityState[targetId] = {
                ...nextItemQuantityState[targetId],
                itemQuantity: 1,
                quantityIsOk: true,
                isNaNTextOn: false,
                isNotAnIntegerTextOn: false,
                minMaxNumTextOn: false
            }
            nextOrderCartState[targetId] = {
                ...nextOrderCartState[targetId],
                itemQuantity: 1,
                quantityIsOk: true
            }
            setItemQuantityState(nextItemQuantityState);
            setOrderCartState(nextOrderCartState);
            localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
            localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
            return;
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
                nextOrderCartState[targetId] = {
                    ...nextOrderCartState[targetId],
                    itemQuantity: currentQuantity + 1,
                    quantityIsOk: false
                }
                setItemQuantityState(nextItemQuantityState);
                setOrderCartState(nextOrderCartState);
                localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
                localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
                return;
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
                nextOrderCartState[targetId] = {
                    ...nextOrderCartState[targetId],
                    itemQuantity: currentQuantity + 1,
                    quantityIsOk: true
                }
                setItemQuantityState(nextItemQuantityState);
                setOrderCartState(nextOrderCartState);
                localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
                localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
                return;
            }


        }

    }

    const handleMinusClick = (targetId) => {
        console.log(itemQuantityState);
        console.log(orderCartState);
        // const targetId = e.target.id.split(" ")[1];
        // console.log(targetId);

        const currentQuantity = itemQuantityState[targetId].itemQuantity;
        console.log("typeof currentQuantity", typeof currentQuantity);
        console.log("currentQuantity", currentQuantity);

        let nextItemQuantityState = {
            ...itemQuantityState
        };

        let nextOrderCartState = {
            ...orderCartState
        }

        if (currentQuantity === "") {
            nextItemQuantityState[targetId] = {
                ...nextItemQuantityState[targetId],
                itemQuantity: -1,
                quantityIsOk: false,
                isNaNTextOn: false,
                isNotAnIntegerTextOn: false,
                minMaxNumTextOn: true
            }
            nextOrderCartState[targetId] = {
                ...nextOrderCartState[targetId],
                itemQuantity: -1,
                quantityIsOk: false
            }
            setItemQuantityState(nextItemQuantityState);
            setOrderCartState(nextOrderCartState);
            localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
            localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
            return;
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
                nextOrderCartState[targetId] = {
                    ...nextOrderCartState[targetId],
                    itemQuantity: currentQuantity - 1,
                    quantityIsOk: false
                }
                setItemQuantityState(nextItemQuantityState);
                setOrderCartState(nextOrderCartState);
                localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
                localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
                return;
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
                nextOrderCartState[targetId] = {
                    ...nextOrderCartState[targetId],
                    itemQuantity: currentQuantity - 1,
                    quantityIsOk: true
                }
                setItemQuantityState(nextItemQuantityState);
                setOrderCartState(nextOrderCartState);
                localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
                localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
                return;
            }
        }



    }

    const handleQuantityChange = (targetId, targetQuantity) => {
        console.log(itemQuantityState);
        console.log(orderCartState);
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

        let nextItemQuantityState = {
            ...itemQuantityState
        };

        let nextOrderCartState = {
            ...orderCartState
        }

        if (newValue === "") {
            nextItemQuantityState[targetId] = {
                ...nextItemQuantityState[targetId],
                itemQuantity: "",
                quantityIsOk: false,
                isNaNTextOn: false,
                isNotAnIntegerTextOn: false,
                minMaxNumTextOn: true
            }
            // delete nextOrderCartState[targetId];
            nextOrderCartState[targetId] = {
                ...nextOrderCartState[targetId],
                itemQuantity: "",
                quantityIsOk: false
            }

            setItemQuantityState(nextItemQuantityState);
            setOrderCartState(nextOrderCartState);
            localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
            localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
            return;
        }

        if (isNaN(newValue)) {

            nextItemQuantityState[targetId] = {
                ...nextItemQuantityState[targetId],
                // itemQuantity: "",
                itemQuantity: newValue,
                quantityIsOk: false,
                isNaNTextOn: true,
                isNotAnIntegerTextOn: false,
                minMaxNumTextOn: false
            }

            nextOrderCartState[targetId] = {
                ...nextOrderCartState[targetId],
                itemQuantity: newValue,
                quantityIsOk: false
            }

            setItemQuantityState(nextItemQuantityState);
            setOrderCartState(nextOrderCartState);
            localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
            localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
            return;
        }

        console.log("Number(newValue)", Number(newValue));
        console.log("newValue", newValue);


        const pattern = /[0-9]/;
        console.log(pattern.test(newValue));
        if (newValue.includes(".")) {
            console.log("Number(newValue)", Number(newValue));
            console.log("newValue", newValue);

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

            nextOrderCartState[targetId] = {
                ...nextOrderCartState[targetId],
                itemQuantity: newValue,
                quantityIsOk: false
            }

            setItemQuantityState(nextItemQuantityState);
            setOrderCartState(nextOrderCartState);
            localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
            localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
            return;
        }


        if (Number(newValue) < 1 || Number(newValue) > 1000) {

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
            nextOrderCartState[targetId] = {
                ...nextOrderCartState[targetId],
                itemQuantity: Number(newValue),
                quantityIsOk: false
            }

        } else {
            nextItemQuantityState[targetId] = {
                ...nextItemQuantityState[targetId],
                itemQuantity: Number(newValue),
                quantityIsOk: true,
                isNaNTextOn: false,
                isNotAnIntegerTextOn: false,
                minMaxNumTextOn: false
            }
            nextOrderCartState[targetId] = {
                ...nextOrderCartState[targetId],
                itemQuantity: Number(newValue),
                quantityIsOk: true
            }

        }

        setItemQuantityState(nextItemQuantityState);
        setOrderCartState(nextOrderCartState);
        localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
        localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
    }

    const handleEmptyOrderCartClick = () => {
        const confirmEmpty = confirm("Are you sure you want to empty order cart?");
        if (!confirmEmpty) {
            return;
        }
        let nextItemQuantityState = {
            ...itemQuantityState
        };
        for (let key in nextItemQuantityState) {
            nextItemQuantityState[key] = {
                ...nextItemQuantityState[key],
                addedToOrderCartAlready: false,
                itemQuantity: "",
                quantityIsOk: false,
                isNaNTextOn: false,
                isNotAnIntegerTextOn: false,
                minMaxNumTextOn: false
            }
        }
        setItemQuantityState(nextItemQuantityState);
        localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
        setOrderCartState({});
        localStorage.setItem('orderCart', JSON.stringify({}));
    }

    const handleCancelThisItemClick = targetId => {
        const confirmCancelThisItem = confirm('Are you sure you want to cancel this item?');
        if (!confirmCancelThisItem) {
            return;
        }
        let nextItemQuantityState = {
            ...itemQuantityState
        };
        nextItemQuantityState[targetId] = {
            ...nextItemQuantityState[targetId],
            addedToOrderCartAlready: false,
            itemQuantity: "",
            quantityIsOk: false,
            isNaNTextOn: false,
            isNotAnIntegerTextOn: false,
            minMaxNumTextOn: false
        }

        let nextOrderCartState = {
            ...orderCartState
        };
        delete nextOrderCartState[targetId];

        setItemQuantityState(nextItemQuantityState);
        localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
        setOrderCartState(nextOrderCartState);
        localStorage.setItem('orderCart', JSON.stringify(nextOrderCartState));
    }

    const handleConfirmTheOrderClick = async () => {

        console.log(orderCartStateArr);
        let finalOrderVersion = {
            clientOrderItems: []
        };
        for (let i = 0; i < orderCartStateArr.length; i++) {
            if (orderCartStateArr[i].quantityIsOk) {
                finalOrderVersion.clientOrderItems.push({
                    itemId: orderCartStateArr[i].itemId,
                    itemQuantity: orderCartStateArr[i].itemQuantity
                })
            }
        }
        console.log(finalOrderVersion);
        if (finalOrderVersion.clientOrderItems.length !== orderCartStateArr.length) {
            return alert('Some items in your order cart have invalid quantity. Please fix them before confirming the order.');
        }

        const confirmTheOrder = confirm('Are you sure you want to confirm the order?');
        if (!confirmTheOrder) {
            return;
        }

        const response = await fetch('/api/members/clients/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(finalOrderVersion)
        });
        console.log(response);
        const data = await response.json();
        console.log(data);
        if (data.success) {
            let nextItemQuantityState = {
                ...itemQuantityState
            };
            for (let key in nextItemQuantityState) {
                nextItemQuantityState[key] = {
                    ...nextItemQuantityState[key],
                    addedToOrderCartAlready: false,
                    itemQuantity: "",
                    quantityIsOk: false,
                    isNaNTextOn: false,
                    isNotAnIntegerTextOn: false,
                    minMaxNumTextOn: false
                }
            }
            setItemQuantityState(nextItemQuantityState);
            localStorage.setItem('itemQuantity', JSON.stringify(nextItemQuantityState));
            setOrderCartState({});
            localStorage.setItem('orderCart', JSON.stringify({}));
            console.log(data.orderDetails[0].client_order_id);
            setLatestOrderId(data.orderDetails[0].client_order_id);
            router.push(`/members/clients/order-success/${data.orderDetails[0].client_order_id}`);
        } else {
            alert('You failed to placed the order.')
        }
    }


    useEffect(() => {
        console.log(localStorage.getItem('orderCart'));
        console.log(JSON.parse(localStorage.getItem('itemQuantity')));
        console.log(JSON.parse(localStorage.getItem('orderCart')));
        console.log(orderCartStateArr);
        console.log('itemQuantityState', itemQuantityState);
        console.log('orderCartState', orderCartState);
        console.log('orderCartStateArr', orderCartStateArr);

        let nextLocalStorageOrderCart = JSON.parse(localStorage.getItem('orderCart'));
        for (let key in nextLocalStorageOrderCart) {
            if (!(nextLocalStorageOrderCart[key].itemId) || !(nextLocalStorageOrderCart[key].itemName)) {
                delete nextLocalStorageOrderCart[key];
            }
        }
        console.log('nextLocalStorageOrderCart', nextLocalStorageOrderCart);
        localStorage.setItem('orderCart', JSON.stringify(nextLocalStorageOrderCart));
        // setOrderCartState(nextLocalStorageOrderCart);

        let nextLocalStorageItemQuantity = JSON.parse(localStorage.getItem('itemQuantity'));
        for (let key in nextLocalStorageItemQuantity) {
            if (!(nextLocalStorageItemQuantity[key].itemId) || !(nextLocalStorageItemQuantity[key].itemName)) {
                delete nextLocalStorageItemQuantity[key];
            }
        }
        console.log('nextLocalStorageItemQuantity', nextLocalStorageItemQuantity);
        localStorage.setItem('itemQuantity', JSON.stringify(nextLocalStorageItemQuantity));
        // setItemQuantityState(nextLocalStorageItemQuantity);
        // localStorage.setItem('itemQuantity', JSON.stringify(itemQuantityState));
        // localStorage.setItem('orderCart', JSON.stringify(orderCartState));
        // localStorage.setItem('itemQuantity', JSON.stringify(itemQuantityState));
        // localStorage.setItem('orderCart', JSON.stringify(orderCartState));
        if (token) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            setOrderCartState(nextLocalStorageOrderCart);
            setItemQuantityState(nextLocalStorageItemQuantity);
        }

    }, [token])
    // }, [token, itemQuantityState, orderCartState])

    return (
        <div className={orderCartStyles.mainContentContainer}>
            <SnackbarForLoading
                message='Loading...'
                show={isLoading}
            />
            <div className={orderCartStyles.heading}>Order Cart</div>
            {
                !orderCartState ||
                    Object.keys(orderCartState).length < 1 ?
                    // !orderCartState ?
                    <div className={orderCartStyles.orderCartIsEmpty}>Your order cart is empty.</div> : ""
            }
            {/* {
                Object.keys(orderCartState).length > 0 ?
                    <div className={orderCartStyles.emptyOrderCartContainer}>
                        <div
                            className={orderCartStyles.emptyOrderCart}
                        >
                            Empty order cart
                        </div>
                    </div>
                    : ""
            } */}
            {
                !orderCartState ||
                    Object.keys(orderCartState).length < 1 ?
                    "" :

                    // Object.keys(orderCartState).length > 0 ?
                    <div className={orderCartStyles.ifOrderCartIsNotEmpty}>

                        <table className={orderCartStyles.table}>
                            <thead className={orderCartStyles.thead}>
                                <tr>
                                    <th className={orderCartStyles.itemIdTableHeading}>Item Id</th>
                                    <th className={orderCartStyles.itemNameTableHeading}>Item Name</th>
                                    <th className={orderCartStyles.quantityTableHeading}>Quantity</th>
                                    <th className={orderCartStyles.emptyOrderCartTableHeading}>
                                        <div className={orderCartStyles.emptyOrderCartContainer}>
                                            <div
                                                className={orderCartStyles.emptyOrderCart}
                                                onClick={handleEmptyOrderCartClick}
                                            >
                                                Empty order cart
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className={orderCartStyles.tbody}>
                                {
                                    orderCartStateArr.map(item => {
                                        return (
                                            <tr key={item.itemId}>
                                                <td>
                                                    {item.itemId}
                                                </td>
                                                <td>
                                                    {item.itemName}
                                                </td>
                                                <td>
                                                    <div className={orderCartStyles.plusBtnQuantityInputMinusBtnContainer}>

                                                        <img
                                                            src={plusImage.src}
                                                            className={orderCartStyles.plusImg}
                                                            // id={`plusId ${item.item_id}`}
                                                            // id={`plusIndex ${i}`}
                                                            onClick={() => handlePlusClick(item.itemId)}
                                                            style={{
                                                                // display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "none" : "block"
                                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                                            }}
                                                        />

                                                        <input
                                                            // type="number"
                                                            type="text"
                                                            className={orderCartStyles.quantityInput}
                                                            // max={1000}
                                                            // min={0}
                                                            placeholder="0"
                                                            // value={itemQuantityState[item.item_id].itemQuantity}
                                                            // value={itemQuantityState[i].itemQuantity}
                                                            // id={`quantityId ${item.item_id}`}
                                                            // data-id={item.item_id}
                                                            // id={`quantityIndex ${i}`}
                                                            value={item.itemQuantity}
                                                            onChange={e => handleQuantityChange(item.itemId, e.target.value)}
                                                            // onChange={(e)=>handleQuantityChange(item.item_id, document.querySelector(`quantityId ${item.item_id}`).dataset.id)}
                                                            style={{
                                                                // display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "none" : "block"
                                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                                            }}
                                                        />

                                                        <img
                                                            src={minusImage.src}
                                                            className={orderCartStyles.minusImg}
                                                            // id={`minusId ${item.item_id}`}
                                                            // id={`minusIndex ${i}`}
                                                            onClick={() => handleMinusClick(item.itemId)}
                                                            style={{
                                                                // display: itemQuantityState[item.item_id].addedToOrderCartAlready ? "none" : "block"
                                                                // color: itemQuantityState[item.item_id].addedToOrderCartAlready ? "#00000029" : "#000"
                                                            }}
                                                        />
                                                    </div>
                                                    <div
                                                    // style={{
                                                    //     height:
                                                    //         !itemQuantityState[item.itemId].isNaNTextOn
                                                    //             && !itemQuantityState[item.itemId].isNotAnIntegerTextOn
                                                    //             && !itemQuantityState[item.itemId].minMaxNumTextOn
                                                    //             ? "37px" : 0
                                                    // }}
                                                    >
                                                    </div>
                                                    <div
                                                        className={orderCartStyles.isNaNText}
                                                        style={{
                                                            display: itemQuantityState[item.itemId].isNaNTextOn ? "block" : "none",
                                                            // display: isNaNTextOn ? "block" : "none"
                                                        }}
                                                    >
                                                        You can only input an integer or leave it empty.
                                                    </div>

                                                    <div
                                                        className={orderCartStyles.isNotAnIntegerText}
                                                        style={{
                                                            display: itemQuantityState[item.itemId].isNotAnIntegerTextOn ? "block" : "none"
                                                            // display: isNotAnIntegerTextOn ? "block" : "none"
                                                        }}
                                                    >
                                                        You can only input an integer.
                                                    </div>

                                                    <div
                                                        className={orderCartStyles.minMaxNumText}
                                                        style={{
                                                            display: itemQuantityState[item.itemId].minMaxNumTextOn ? "block" : "none"
                                                            // display: minMaxNumTextOn ? "block" : "none"
                                                        }}
                                                    >
                                                        The minimum number is 1. <br />
                                                        The maximum number is 1000.
                                                    </div>

                                                </td>
                                                <td>
                                                    <div className={orderCartStyles.cancelThisItemContainer}>
                                                        <div
                                                            className={orderCartStyles.cancelThisItem}
                                                            onClick={() => handleCancelThisItemClick(item.itemId)}
                                                        >
                                                            Cancel this item
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                        </table>
                        <div className={orderCartStyles.confirmTheOrderContainer}>
                            <div
                                className={orderCartStyles.confirmTheOrder}
                                onClick={handleConfirmTheOrderClick}
                            >
                                Confirm the order
                            </div>
                        </div>
                    </div>
                // : ""
            }
        </div>
    );
}