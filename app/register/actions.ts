"use server"

import { RegisterPayload } from "./definitions"

export async function registerUser(payload: RegisterPayload) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080/api"

  // Determine endpoint based on role
  const endpoint =
    payload.role === "Host" ? "/register-host" : "/register-traveller"

  // Extract role to not send it to the backend if not needed,
  // keeping the rest of the data
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { role: _role, ...dataToSend } = payload

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(dataToSend),
    })

    let data
    const contentType = response.headers.get("content-type")

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      // Handle non-JSON responses (like HTML error pages)
      const text = await response.text()
      // If status is 404/500 etc, use the text or statusText
      if (!response.ok) {
        return {
          success: false,
          message: `API Error (${response.status}): ${text.slice(0, 200)}`, // limit length
        }
      }
      // If success but not JSON?
      return {
        success: true,
        user: {}, // fallback
      }
    }

    // Check for explicit success: false in payload
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

    return {
      success: true,
      user: data,
    }
  } catch (error) {
    console.error("Registration Error:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later.",
    }
  }
}
