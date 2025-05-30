'use server';

import { cookies } from "next/headers";
import { IInputLogin } from "./page";

export default async function doLogin(input: IInputLogin) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(input),
            cache: 'no-store',
        })

        const data = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: data.message
            }
        }

        console.log(data, "<<<<< data doLogin");

        const cookieStore = await cookies()
        cookieStore.set("access_token", data.access_token, {
            path: "/",
        })

        return {
            success: true,
            message: "Login successful!"
        }

    } catch (error: unknown) {
        console.log(error, "<<<<< error doLogin");
        return {
            success: false,
            message: "Network error occurred"
        }
    }
}