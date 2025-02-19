"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface User {
  name: string
  email: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      fetchUserData(token)
    }
  }, [router])

  const fetchUserData = async (token: string) => {
    try {
      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        setUser(data.user)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      router.push("/login")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/login")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Email: {user.email}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/search">
                <Button className="w-full">Find Services</Button>
              </Link>
              <Link href="/register-provider">
                <Button className="w-full">Register as Service Provider</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
