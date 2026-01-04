"use client";

import pageStyles from './css/page.module.css';
import { useMember } from './layout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const memberContext = useMember();
  const {
    isLoggedIn,
    type,
    isInitialized,
    setShowMenuImage,
    setShowCloseImage,
    setShowSoundImage
  } = memberContext;
  console.log('home', isLoggedIn);
  const router = useRouter();
  useEffect(() => {
    if (!isInitialized) {
      // return null;
      return;
    }
    if (isLoggedIn) {
      if (type === "client") {
        router.replace('/members/clients');
      }
      if (type === "merchant") {
        router.replace('/members/merchants');
      }

    } else {
      router.replace('/');
      setShowMenuImage(true);
      setShowCloseImage(false);
      setShowSoundImage(false);
    }



  }, [isLoggedIn, type, isInitialized])
  if (isLoggedIn || isLoggedIn === null) {
    return null;
  }

  return (
    <div className={pageStyles.welcomeMsgWrapper}>
      <div className={pageStyles.welcomeMsgForBrowser}>
        Welcome to <b className={pageStyles.tuckShopRestockingSystemForBrowser}> Tuck Shop Restocking System </b>
      </div>
      <div className={pageStyles.welcomeMsgForPhone}>
        Welcome to <br /> <b className={pageStyles.tuckShopRestockingSystemForPhone}>Tuck Shop Restocking System</b>
      </div>
    </div>
  );
}
