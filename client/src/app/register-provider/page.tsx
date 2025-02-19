"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function RegisterProvider() {
  const [name, setName] = useState("")
  const [service, setService] = useState("")
  const [rate, setRate] = useState("")
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        () => {
          setError("Unable to retrieve your location")
        },
      )
    } else {
      setError("Geolocation is not supported by your browser")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!location) {
      setError("Location is not available")
      return
    }

    try {
      const response = await fetch("/api/service/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          name,
          service,
          rate,
          latitude: location.latitude,
          longitude: location.longitude,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push("/dashboard")
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <Card className="w-full max-w-md bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Register as Service Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
                required
              />
            </div>
            {location && (
              <p className="text-sm text-gray-400">
                Your location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={!location}>
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

