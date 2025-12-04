import RegisterForm from "./register-form"

async function getCountries() {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"
  const url = `${baseUrl}/countries`

  try {
    const res = await fetch(url, {
      cache: "no-store", // Changed from 'force-cache' to ensure fresh fetch
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!res.ok) {
      console.error("[Server] Response not OK:", res.status, res.statusText)
      return []
    }

    const data = await res.json()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const countries = Object.values(data).map((c: any) => ({
      name: c.name,
      calling_code: c.calling_code,
      code: c.iso_3166_1_alpha2,
      emoji: c.emoji,
    }))

    return countries
  } catch (error) {
    console.error("[Server] Failed to fetch countries", error)
    return []
  }
}

export default async function Page() {
  const countries = await getCountries()
  return <RegisterForm countries={countries} />
}
