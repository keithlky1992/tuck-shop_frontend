import Link from "next/link"

export default function Menu() {
    return (
        <div>
            <div>
                <Link href={"/users/login"}>
                    Login
                </Link>
            </div>
            <div>
                <Link href={"/users/register"}>
                    Register
                </Link>
            </div>
        </div>
    )
}