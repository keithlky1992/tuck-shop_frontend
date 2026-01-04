import Link from "next/link";
import menuStyles from '../css/menu.module.css';
import { useMember } from "../layout";
import { useRouter } from "next/navigation";
import subscribersImage from '@/app/img/subscribers.png';
import orderImage from '@/app/img/order.png';
import itemImage from '@/app/img/items.svg';
import loginImage from '@/app/img/login.svg';
import logoutImage from '@/app/img/logout.svg';
import registerImage from '@/app/img/register.png';
import merchantImage from '@/app/img/merchant.png';
import subscribedMerchantImage from '@/app/img/subscribed-merchant.svg';
import orderHistoryImage from '@/app/img/order-history.png';
import orderCartImage from '@/app/img/order-cart.svg';


export default function Menu() {
    const memberContext = useMember();
    const { isLoggedIn, setIsLoggedIn, type, setType, user, setUser, showMenuImage, setShowMenuImage, showCloseImage, setShowCloseImage } = memberContext;
    const router = useRouter();
    console.log('menu', isLoggedIn);
    const handleLogoutClick = () => {
        const userConfirmed = confirm("Log out now?");
        if (userConfirmed) {
            setShowMenuImage(true);
            setShowCloseImage(false);
            // console.log('setShowMenuImage', setShowMenuImage);
            // console.log('setShowCloseImage', setShowCloseImage);
            // Code to execute if the user clicked "OK" (Yes)
            localStorage.removeItem('token');
            localStorage.removeItem('userType');
            localStorage.removeItem('username');
            localStorage.removeItem('itemQuantity');
            localStorage.removeItem('orderCart');
            setIsLoggedIn(false);
            setType(null);
            setUser(null);
            router.replace('/');
            // window.location.href = '/';
        }
    }

    return (
        <div className={menuStyles.menu} >
            {/* login & register menu */}
            <Link
                id="login"
                href={"/users/login"}
                style={{
                    display: isLoggedIn || isLoggedIn === null ? 'none' : 'inline'
                }}
                className={menuStyles.link}
                onClick={() => {
                    setShowMenuImage(true);
                    setShowCloseImage(false);
                }}
            >
                <div className={menuStyles.menuLogin}>
                    <img src={loginImage.src} />
                    Login
                </div>
            </Link>
            <Link
                href={"/users/register"}
                style={{
                    display: isLoggedIn || isLoggedIn === null ? 'none' : 'inline'
                }}
                className={menuStyles.link}
                onClick={() => {
                    setShowMenuImage(true);
                    setShowCloseImage(false);
                }}
            >
                <div className={menuStyles.menuRegister}>
                    <img src={registerImage.src} />
                    Register
                </div>
            </Link>

            {/* client menu */}
            <Link
                href={"/members/clients/merchants"}
                style={{ display: type === 'client' ? 'inline' : 'none' }}
                className={menuStyles.link}
                onClick={() => {
                    setShowMenuImage(true);
                    setShowCloseImage(false);
                }}
            >
                <div className={menuStyles.menuMerchants}>
                    <img src={merchantImage.src} />
                    Merchants
                </div>
            </Link>
            <Link
                href={"/members/clients/subscribed-merchants"}
                style={{ display: type === 'client' ? 'inline' : 'none' }}
                className={menuStyles.link}
                onClick={() => {
                    setShowMenuImage(true);
                    setShowCloseImage(false);
                }}
            >
                <div className={menuStyles.menuSubscribedMerchants}>
                    <img src={subscribedMerchantImage.src} />
                    Subscribed<br />Merchants
                </div>
            </Link>
            <Link
                href={"/members/clients/order-history"}
                style={{ display: type === 'client' ? 'inline' : 'none' }}
                className={menuStyles.link}
                onClick={() => {
                    setShowMenuImage(true);
                    setShowCloseImage(false);
                }}
            >
                <div className={menuStyles.menuOrderHistory}>
                    <img src={orderHistoryImage.src} />
                    Order History
                </div>
            </Link>
            <Link
                href={"/members/clients/items"}
                style={{ display: type === 'client' ? 'inline' : 'none' }}
                className={menuStyles.link}
                onClick={() => {
                    setShowMenuImage(true);
                    setShowCloseImage(false);
                }}
            >
                <div className={menuStyles.menuClientItems}>
                    <img src={itemImage.src} />
                    Items
                </div>
            </Link>
            <Link
                href={"/members/clients/order-cart"}
                style={{ display: type === 'client' ? 'inline' : 'none' }}
                className={menuStyles.link}
                onClick={() => {
                    setShowMenuImage(true);
                    setShowCloseImage(false);
                }}
            >
                <div className={menuStyles.menuOrderCart}>
                    <img src={orderCartImage.src} />
                    Order Cart
                </div>
            </Link>

            {/* merchant menu */}
            <Link
                href={"/members/merchants/subscribers"}
                style={{ display: type === 'merchant' ? 'inline' : 'none' }}
                className={menuStyles.link}
                onClick={() => {
                    setShowMenuImage(true);
                    setShowCloseImage(false);
                }}
            >
                <div className={menuStyles.menuSubscribers}>
                    <img src={subscribersImage.src} />
                    {/* <div className={menuStyles.subscribers}> */}
                    My Subscribers
                    {/* </div> */}
                </div>
            </Link>
            <Link
                href={"/members/merchants/orders"}
                style={{ display: type === 'merchant' ? 'inline' : 'none' }}
                className={menuStyles.link}
                onClick={() => {
                    setShowMenuImage(true);
                    setShowCloseImage(false);
                }}
            >
                <div className={menuStyles.menuOrders}>
                    <img src={orderImage.src} />
                    Orders
                </div>
            </Link>
            <Link
                href={"/members/merchants/items"}
                style={{ display: type === 'merchant' ? 'inline' : 'none' }}
                className={menuStyles.link}
                onClick={() => {
                    setShowMenuImage(true);
                    setShowCloseImage(false);
                }}
            >
                <div className={menuStyles.menuMerchantItems}>
                    <img src={itemImage.src} />
                    My Items
                </div>
            </Link>





            {/* logout menu */}
            <div
                className={menuStyles.menuLogout}
                onClick={() => {
                    handleLogoutClick();
                    // setShowSoundImage(false);
                    // setShowMenuImage(true);
                    // setShowCloseImage(false);
                }}
                style={{ display: isLoggedIn ? 'flex' : 'none' }}>
                <img src={logoutImage.src} />
                Logout
            </div>
        </div>
    )
}