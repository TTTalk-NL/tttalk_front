"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Header } from "../ui/header"
import { loginUser } from "./actions"
import { loginSchema, LoginPayload } from "./definitions"
import { InputGroup } from "../ui/inputGroup"

export default function LoginForm() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
    const result = await loginUser(data)

    if (result.success) {
      toast.success("Logged in successfully!")
      // Redirect to dashboard or home
      router.push("/dashboard")
    } else if (result.errors) {
      Object.keys(result.errors).forEach((key) => {
        setError(key as keyof LoginPayload, {
          type: "server",
          message: result.errors[key][0],
        })
      })
      const firstErrorMessage =
        result.message ||
        (result.errors &&
          Object.values(result.errors as Record<string, string[]>)[0]?.[0])
      toast.error(firstErrorMessage || "Please correct the errors in the form.")
    } else {
      toast.error(result.message || "Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="grow flex flex-col items-center justify-center py-10 px-10">
        <div className="w-full max-w-md flex flex-col items-center md:bg-white md:p-8 md:rounded-lg md:shadow-md">
          <h1 className="text-2xl text-center mb-8">Login</h1>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-4"
            noValidate
          >
            <InputGroup
              label="Email Address"
              id="email"
              type="email"
              placeholder="Enter your email address"
              register={register}
              error={errors.email?.message}
            />

            <div className="flex flex-col gap-1">
              <InputGroup
                label="Password"
                id="password"
                type="password"
                placeholder="Enter your password"
                register={register}
                error={errors.password?.message}
              />
              <div className="text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-4 bg-black text-white py-2 rounded"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <div className="text-center text-sm text-gray-500 mt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Register
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
