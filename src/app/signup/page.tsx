'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    async function handleSignup(event: React.FormEvent) {
        event.preventDefault();
        setIsLoading(true);
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            console.error("Error signing up:", error.message);
            setErrorMsg(error.message);
        }
        else {
            console.log("Signup successful:", data);
            setIsLoading(false);
            router.push("/login");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">Sign Up</h2>
                <form className="space-y-4" onSubmit={handleSignup}>
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
                    {isLoading ? (
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium"
                            disabled
                        >
                            Loading...
                        </button>
                    ) : (
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-medium"
                        >
                            Sign Up
                        </button>
                    )}
                    <label className="block text-sm font-medium mt-4 text-center text-gray-800">
                        Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login here</a>
                    </label>
                </form>
                {errorMsg && <p className="text-red-500 text-sm mt-4 text-center">{errorMsg}</p>}
            </div>
        </div>
    );
}