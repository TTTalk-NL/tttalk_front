"use client"

import { useEffect } from "react"
import { useForm, SubmitHandler, useWatch } from "react-hook-form"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Header } from "../ui/header"
import { registerUser } from "./actions"
import { RegisterPayload } from "./definitions"
import { InputGroup } from "../ui/inputGroup"
import { SelectGroup } from "../ui/selectGroup"
import { PhoneInputGroup } from "../ui/phoneInputGroup"

interface CountryOption {
    name: string
    calling_code: string
    code: string
}

const formSchema = z
    .object({
        role: z.enum(["Tourist", "Host"]),
        name: z.string().trim().min(1, "Name is required"),
        email: z.string().trim().email("Invalid email address"),
        password: z.string().min(8, "Min 8 chars"),
        password_confirmation: z.string(),
        calling_code: z.string().trim().min(1, "Calling code is required"),
        phone: z.string().trim().min(1, "Phone number is required"),
        country: z.string().trim().optional(),
        city: z.string().trim().optional(),
        address: z.string().trim().optional(),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.password_confirmation) {
            ctx.addIssue({
                code: "custom",
                message: "Passwords do not match",
                path: ["password_confirmation"],
            })
        }
        if (data.role === "Tourist") {
            if (!data.country)
                ctx.addIssue({
                    code: "custom",
                    message: "Country is required",
                    path: ["country"],
                })
            if (!data.city)
                ctx.addIssue({
                    code: "custom",
                    message: "City is required",
                    path: ["city"],
                })
            if (!data.address)
                ctx.addIssue({
                    code: "custom",
                    message: "Address is required",
                    path: ["address"],
                })
        }
    })

type FormValues = z.infer<typeof formSchema>

export default function RegisterForm({
    countries,
}: {
    countries: CountryOption[]
}) {
    // Prepare options for the dropdowns
    const countryOptions =
        countries.length > 0
            ? countries.map((c) => ({ label: c.name, value: c.name }))
            : []
    const callingCodeOptions =
        countries.length > 0
            ? countries.map((c) => ({
                  label: `${c.name} (+${c.calling_code})`,
                  value: c.code,
                  code: c.code,
                  dialCode: `+${c.calling_code}`,
              }))
            : []

    const {
        register,
        handleSubmit,
        setError,
        control,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: "Tourist",
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
            calling_code: "",
            phone: "",
            country: "",
            city: "",
            address: "",
        },
    })

    const role = useWatch({ control, name: "role" })

    useEffect(() => {
        if (role === "Host") {
            setValue("calling_code", "NL")
        }
    }, [role, setValue])

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        const selectedCountry = countries.find(
            (c) => c.code === data.calling_code,
        )

        const payload: RegisterPayload = {
            ...data,
            calling_code: selectedCountry
                ? `+${selectedCountry.calling_code}`
                : data.calling_code,
            country: data.country || "",
            city: data.city || "",
            address: data.address || "",
        }

        const result = await registerUser(payload)
        if (result.success) {
            toast.success("Account created successfully!")
        } else if (result.errors) {
            Object.keys(result.errors).forEach((key) => {
                // Cast key to keyof FormValues since RegisterPayload keys overlap
                setError(key as keyof FormValues, {
                    type: "server",
                    message: result.errors[key][0],
                })
            })
            // Use result.message or try to get the first error message from the errors object
            const firstErrorMessage =
                result.message ||
                (result.errors &&
                    Object.values(
                        result.errors as Record<string, string[]>,
                    )[0]?.[0])
            toast.error(
                firstErrorMessage || "Please correct the errors in the form.",
            )
        } else {
            toast.error(result.message || "Something went wrong.")
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="grow flex flex-col items-center justify-center py-10 px-10">
                <div className="w-full max-w-md flex flex-col items-center md:bg-white md:p-8 md:rounded-lg md:shadow-md">
                    <h1 className="text-2xl text-center">Create an account</h1>
                    <span className="text-sm text-center mt-2 text-gray-500">
                        Create an account to participate as a Host or Tourist.
                    </span>

                    <div className="flex items-center justify-center gap-4 mt-8 mb-8">
                        <Button
                            type="button"
                            onClick={() => setValue("role", "Tourist")}
                            className={`${role === "Tourist" ? "bg-primary text-white shadow-md" : "bg-white text-gray-500 border"}`}
                        >
                            Tourist
                        </Button>
                        <Button
                            type="button"
                            onClick={() => setValue("role", "Host")}
                            className={`${role === "Host" ? "bg-primary text-white shadow-md" : "bg-white text-gray-500 border"}`}
                        >
                            Host
                        </Button>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="w-full flex flex-col gap-4"
                        noValidate
                    >
                        <InputGroup
                            label="Full Name"
                            id="name"
                            placeholder="Enter your full name"
                            register={register}
                            error={errors.name?.message}
                        />

                        <InputGroup
                            label="Email Address"
                            id="email"
                            type="email"
                            placeholder="Enter your email address"
                            register={register}
                            error={errors.email?.message}
                        />

                        <InputGroup
                            label="Password"
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            register={register}
                            error={errors.password?.message}
                        />
                        <InputGroup
                            label="Confirm Password"
                            id="password_confirmation"
                            type="password"
                            placeholder="Confirm your password"
                            register={register}
                            error={errors.password_confirmation?.message}
                        />
                        <PhoneInputGroup
                            label="Phone Number"
                            countryCodeId="calling_code"
                            phoneId="phone"
                            register={register}
                            control={control}
                            countryCodeOptions={callingCodeOptions}
                            countryCodeError={errors.calling_code?.message}
                            phoneError={errors.phone?.message}
                            countryCodePlaceholder="+00"
                            phonePlaceholder="555-987-6543"
                            defaultCountry="NL"
                            disabled={role === "Host"}
                        />

                        <div
                            className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${
                                role === "Tourist"
                                    ? "grid-rows-[1fr] opacity-100"
                                    : "grid-rows-[0fr] opacity-0"
                            }`}
                        >
                            <div className="overflow-hidden flex flex-col gap-4">
                                <SelectGroup
                                    label="Country"
                                    id="country"
                                    register={register}
                                    options={countryOptions}
                                    error={errors.country?.message}
                                    disabled={role !== "Tourist"}
                                />

                                <InputGroup
                                    label="City"
                                    id="city"
                                    placeholder="Enter your city"
                                    register={register}
                                    error={errors.city?.message}
                                    disabled={role !== "Tourist"}
                                />
                                <InputGroup
                                    label="Address"
                                    id="address"
                                    placeholder="Enter your address"
                                    register={register}
                                    error={errors.address?.message}
                                    disabled={role !== "Tourist"}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-4 bg-black text-white py-2 rounded"
                        >
                            {isSubmitting ? "Creating Account..." : "Register"}
                        </Button>

                        <div className="text-center text-sm text-gray-500 mt-4">
                            I already have an account,{" "}
                            <Link
                                href="/login"
                                className="text-primary hover:underline font-medium"
                            >
                                Login
                            </Link>
                        </div>

                        <div className="my-6 border-t border-gray-300 w-full"></div>

                        <p className="text-xs text-gray-500 text-center">
                            By creating an account, you agree to TTTalk&apos;s
                            Conditions of Use. Please check the{" "}
                            <Link
                                href="/terms"
                                className="text-primary hover:underline"
                            >
                                Terms of Use
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="/privacy"
                                className="text-primary hover:underline"
                            >
                                Privacy Policy
                            </Link>
                            .
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}
