import Link from "next/link";
import menuStyles from '../css/menu.module.css';
import { useMember } from "../layout";

export default function Menu() {
    const memberContext = useMember();
    const { isLoggedIn, setIsLoggedIn } = memberContext;
    console.log('menu', isLoggedIn);


    return (
        <div className={menuStyles.menu} style={{ display: isLoggedIn || isLoggedIn === null ? 'none' : 'inline'}}>
            <Link id="login" href={"/users/login"}>
                <div className={menuStyles.menuLogin}>
                    Login
                </div>
            </Link>
            <Link href={"/users/register"}>
                <div className={menuStyles.menuRegister}>
                    Register
                </div>
            </Link>
        </div>
    )
}