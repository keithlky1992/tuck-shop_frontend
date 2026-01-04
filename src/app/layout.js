"use client";

import './css/globals.css';
import rootStyles from './css/root.module.css';
// import Menu from './components/menu';
import Menu from './components/Menu';
import TopBar from './components/TopBar';
// import logoImage from './img/logo.jpg';
import tuckShopImage from './img/tuck-shop.png';
import AIProvider from '@/app/components/AIProvider';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useState,
  useMemo,
  useContext,
  useEffect
} from 'react';

const MemberContext = createContext(null);


export function MemberProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [type, setType] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [itemQuantityState, setItemQuantityState] = useState({});
  const [orderCartState, setOrderCartState] = useState({});
  const [latestOrderId, setLatestOrderId] = useState(null);
  const [merchants, setMerchants] = useState([]);
  const [merchantsLength, setMerchantsLength] = useState(0);
  const [showMenuImage, setShowMenuImage] = useState(true);
  const [showCloseImage, setShowCloseImage] = useState(false);
  const [showSoundImage, setShowSoundImage] = useState(false);
  const backendUrlHost = "192.168.50.135:4000";
  

  console.log('user', user);
  console.log('type', type);



  useEffect(() => {
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const user = localStorage.getItem('username');
    // const itemQuantity = JSON.parse(localStorage.getItem('itemQuantity'));
    // const orderCart = JSON.parse(localStorage.getItem('orderCart'));
    let itemQuantity;
    let orderCart;

    let nextLocalStorageItemQuantity = JSON.parse(localStorage.getItem('itemQuantity'));
    for (let key in nextLocalStorageItemQuantity) {
      if (!(nextLocalStorageItemQuantity[key].itemId) || !(nextLocalStorageItemQuantity[key].itemName)) {
        delete nextLocalStorageItemQuantity[key];
      }
    }
    console.log('nextLocalStorageItemQuantity', nextLocalStorageItemQuantity);
    localStorage.setItem('itemQuantity', JSON.stringify(nextLocalStorageItemQuantity));
    itemQuantity = nextLocalStorageItemQuantity;


    let nextLocalStorageOrderCart = JSON.parse(localStorage.getItem('orderCart'));
    for (let key in nextLocalStorageOrderCart) {
      if (!(nextLocalStorageOrderCart[key].itemId) || !(nextLocalStorageOrderCart[key].itemName)) {
        delete nextLocalStorageOrderCart[key];
      }
    }
    console.log('nextLocalStorageOrderCart', nextLocalStorageOrderCart);
    localStorage.setItem('orderCart', JSON.stringify(nextLocalStorageOrderCart));
    orderCart = nextLocalStorageOrderCart;



    console.log(token);
    console.log(userType);
    console.log(user);
    console.log(itemQuantity);
    console.log(orderCart);


    if (token) {
      console.log(token);
      setToken(token);
      setIsLoggedIn(true);
      // fetchMerchantList();
    } else {
      setIsLoggedIn(false);
    }
    if (userType) {
      console.log('userType', userType);
      setType(userType);
      // if (userType === "client") {
      //   fetchMerchantList();
      // }
    }
    if (user) {
      console.log('user', user);
      setUser(user);
    }
    if (itemQuantity) {
      setItemQuantityState(itemQuantity);
    }
    if (orderCart) {
      setOrderCartState(orderCart);
    }
    setIsInitialized(true);

  }, []);


  const memberValue = useMemo(
    () => {
      return {
        isLoggedIn, setIsLoggedIn,
        type, setType,
        isInitialized,
        token, setToken,
        user, setUser,
        itemQuantityState, setItemQuantityState,
        orderCartState, setOrderCartState,
        latestOrderId, setLatestOrderId,
        merchants, setMerchants,
        merchantsLength, setMerchantsLength,
        showMenuImage, setShowMenuImage,
        showCloseImage, setShowCloseImage,
        showSoundImage, setShowSoundImage,
        backendUrlHost
      }
    },
    [isLoggedIn, type, isInitialized, token, user, itemQuantityState, orderCartState, latestOrderId, merchants, merchantsLength, showMenuImage, showCloseImage, showSoundImage, backendUrlHost]
  )
  console.log(memberValue);

  return (
    <MemberContext.Provider value={memberValue}>
      {children}
    </MemberContext.Provider>

  )
}

export function useMember() {
  const member = useContext(MemberContext);
  if (member === null) {
    throw new Error(
      "useMember hook must be used within MemberContextProvider"
    )
  }
  console.log(member);
  return member;
}

export default function RootLayout({ children }) {
  const router = useRouter();
  return (
    <html lang="en">
      <body className={rootStyles.body}>
        <MemberProvider>
          <AIProvider>
            <div className={rootStyles.rootBackground}>
              <div className={rootStyles.menuContainer}>
                <div className={rootStyles.menuHeader} onClick={() => router.push("/")}>
                  <div className={rootStyles.tuckShopContainer}>
                    <img src={tuckShopImage.src} className={rootStyles.tuckShop} alt='tuck shop' />
                  </div>
                  <div className={rootStyles.systemName}>
                    Tuck Shop<br />
                    Restocking System
                  </div>
                </div>
                <Menu />
              </div>
              <div className={rootStyles.mainContent}>
                <TopBar />
                {children}
              </div>
            </div>
          </AIProvider>
        </MemberProvider>
      </body>
    </html>
  );
}
