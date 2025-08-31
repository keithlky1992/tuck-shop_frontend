"use client";

import './css/globals.css';
import rootStyles from './css/root.module.css';
import Menu from './components/menu';
import logoImage from './img/logo.jpg';
import Link from 'next/link';
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
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      console.log(token);
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  },[]);
  

  const memberValue = useMemo(
    () => {
      return { isLoggedIn, setIsLoggedIn }
    },
    [isLoggedIn]
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
  // const memberContext = useMember();
  // const { isLoggedIn, setIsLoggedIn } = memberContext;
  // console.log('root layout', memberContext);
  return (
    <html lang="en">
      <body>
        <MemberProvider>
          <div className={rootStyles.rootBackground}>
            <div className={rootStyles.menuContainer}>
              <div className={rootStyles.menuHeader}>
                <div className={rootStyles.logoContainer}>
                  <Link href={"/"}>
                    <img src={logoImage.src} className={rootStyles.logo} alt='logo' width="50px" />
                  </Link>
                </div>
                <div className={rootStyles.systemName}>
                  Tuck Shop<br />
                  Restocking System
                </div>
              </div>
              <Menu />
            </div>
            <div className={rootStyles.mainContent}>
              {children}
            </div>
          </div>
        </MemberProvider>
      </body>
    </html>
  );
}
