import type { Metadata } from "next"
import "./globals.css"
import { ubuntu } from "./ui/fonts"
import { Toaster } from "sonner"

export const metadata: Metadata = {
    title: {
        template: "%s | TTTalk.nl",
        default: "TTTalk.nl",
    },
    description: "Platform that allows tourist experience the local culture",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={`${ubuntu.className} antialiased bg-gray-50`}>
                {children}
                <Toaster richColors />
            </body>
        </html>
    )
}
