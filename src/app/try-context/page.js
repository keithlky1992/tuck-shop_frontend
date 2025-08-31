"use client"
import MemberProvider, {useMember} from "./MemberProvider"

export default function Page(){
    return (<MemberProvider>
        <Menu />
        <LoginRegisterPage />
    </MemberProvider>)
}

function LoginRegisterPage(){
    const memberContext = useMember();
    const {isLoggedIn, setIsLoggedIn} = memberContext;
    return (<div>
        {isLoggedIn? "Logged in":"Logged out"}
        <button onClick={()=>setIsLoggedIn(true)} >login</button>
        <button onClick={()=>setIsLoggedIn(false)} >logout</button>
    </div>)

}

function Menu(){
    const {isLoggedIn} = useMember();

    if(isLoggedIn){
        return <div>login menu</div>
    } 
        
    return (<div>
        logout menu
    </div>)
}