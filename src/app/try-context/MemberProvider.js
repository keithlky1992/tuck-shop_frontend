"use client";

import {
    useState,
    createContext,
    useContext,
    useMemo,
    useEffect,
} from "react";

const MemberContext = createContext(null);

export default function MemberProvider({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const memberValue = useMemo(
        () => {
            return { isLoggedIn, setIsLoggedIn };
        },
        [isLoggedIn]
    );
    console.log(memberValue);


    return (
        <MemberContext.Provider value={memberValue}>
            {children}
        </MemberContext.Provider>
    );
}

export function useMember() {
    const member = useContext(MemberContext);
    if (member === null) {
        throw new Error(
            "useMember hook must be used within MemberContextProvider"
        );
    }
    console.log(member);

    return member;
}
