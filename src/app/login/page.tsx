'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";


export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    async function handleLogin(event: React.FormEvent) {
        event.preventDefault();
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            console.error("Error logging in:", error.message);
            setErrorMsg(error.message);
        }
        else {
            console.log("Login successful:", data);
            router.push("/");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Login</h2>
                <form className="space-y-4" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="w-full border border-gray-400 p-2 rounded text-gray-800"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-800" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="w-full border border-gray-400 p-2 rounded text-gray-800"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium"
                    >
                        Login
                    </button>

                    <label className="block text-sm font-medium mb-1 text-center mt-4 text-gray-800">
                        Don't have an account?{' '}
                        <span
                            className="text-blue-500 cursor-pointer hover:underline"
                            onClick={() => router.push("/signup")}
                        >
                            Sign Up
                        </span>
                    </label>
                </form>
                {errorMsg && <p className="mt-4 text-red-500 text-center">{errorMsg}</p>}
            </div>
        </div>
    );
}