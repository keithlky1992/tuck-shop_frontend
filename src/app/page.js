"use client";

import pageStyles from './css/page.module.css';
import { useMember } from './layout';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function Home() {
  const memberContext = useMember();
  const { isLoggedIn, setLoggedIn } = memberContext;
  console.log('home', isLoggedIn);
  const router = useRouter();
  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/client');
    } else {
      router.replace('/');
    }
  }, [isLoggedIn])
  if (isLoggedIn || isLoggedIn === null) {
    return null;
  } 

  return (
    <div className={pageStyles.welcomeMsgWrapper}>
      <div className={pageStyles.welcomeMsg}>
        Welcome to Tuck Shop Restocking System
      </div>
    </div>
  );
}
