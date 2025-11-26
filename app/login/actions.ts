"use server"

import { cookies } from "next/headers"
import { LoginPayload } from "./definitions"

export async function loginUser(payload: LoginPayload) {
    const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

    try {
        const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        })

        let data
        const contentType = response.headers.get("content-type")

        if (contentType && contentType.includes("application/json")) {
            data = await response.json()
        } else {
            const text = await response.text()
            if (!response.ok) {
                return {
                    success: false,
                    message: `API Error (${response.status}): ${text.slice(0, 200)}`,
                }
            }
            return {
                success: true, // Should not happen for login usually
                user: {},
            }
        }

        if (data && data.success === false) {
            return {
                success: false,
                message: data.message,
                errors: data.errors,
            }
        }

        if (!response.ok) {
            return {
                success: false,
                message:
                    data.message ||
                    (data.errors ? "Validation failed" : `Error ${response.status}`),
                errors: data.errors,
            }
        }

        // Set session cookie
        if (data.token) {
            const cookieStore = await cookies()
            cookieStore.set("token", data.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 7, // 1 week
                path: "/",
            })
        }

        return {
            success: true,
            user: data.user,
            token: data.token,
        }
    } catch (error) {
        console.error("Login Error:", error)
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again later.",
        }
    }
}

export async function logoutUser() {
    const cookieStore = await cookies()
    cookieStore.delete("token")
    return { success: true }
}
