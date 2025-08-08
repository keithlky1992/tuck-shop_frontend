import Link from "next/link";

export default function Register() {
    return (
        <div>
            <div>Welcome to use Tuck Shop Restocking System</div>
            <div>
                <div>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input id="username" type="text" />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input id="password" type="password"/>
                    </div>
                    <div>
                        Registration Type:
                        <input id="client" type="radio" name="registration-type" value="client" />
                        <label htmlFor="client">Client</label>
                        <input id="merchant" type="radio" name="registration-type" value="merchant" />
                        <label htmlFor="merchant">Merchant</label>
                    </div>
                    <div>
                        <button>Register</button>
                    </div>
                    <div>Already have an account?</div>
                    <div>
                        <Link href="/users/login">Login</Link>
                    </div>
                    

                </div>
            </div>
        </div>
    )
}