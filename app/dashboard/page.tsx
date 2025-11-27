import { Header } from "../ui/header"

export default function DashboardPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header showProfile={true} />
            <div className="grow flex flex-col items-center justify-center py-10 px-10">
                <h1 className="text-3xl font-bold">Welcome to the Dashboard</h1>
                <p className="mt-4 text-gray-600">
                    You are successfully logged in.
                </p>
            </div>
        </div>
    )
}
