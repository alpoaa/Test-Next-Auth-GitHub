"use client";

import { signIn } from "next-auth/react";
import { ChangeEvent, SetStateAction, useState } from "react";

const LoginPage = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const submitCredentials = async(e: React.FormEvent) => {
        e.preventDefault();

        await signIn("credentials", {
            email,
            password,
            redirect: true,
        })


    }

    const registerAccount = async(e: React.FormEvent) => {
        e.preventDefault();

        await fetch(`${process.env.PUBLIC_BACKEND_BASE_URL ?? ""}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password})
        });

        await submitCredentials(e);
    }

    const changeValueEmail = (e: { target: { value: SetStateAction<string>; }; }) => setEmail(e.target.value);
    const changeValuePassword = (e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value);

    return (
        <main className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
            <button 
                className="w-full bg-black text-white rounded py-2 mb-6"
                onClick={() => signIn("github")}>
                    Continue with GitHub
            </button>

            <form onSubmit={submitCredentials} className="space-y-4">
                <input className="w-full border rounded p-2" type="email" placeholder="Email" value={email} onChange={changeValueEmail} required/>
                <input className="w-full border rounded p-2" type="password" placeholder="Password" value={password} onChange={changeValuePassword} required/>
                <div className="flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white rounded py-2" type="submit">
                        Sign in
                    </button>
                    <button className="flex-1 bg-gray-700 text-white rounded py-2" onClick={registerAccount}>
                        Create account
                    </button>
                </div>
            </form>
        </main>
    )
}

export default LoginPage;