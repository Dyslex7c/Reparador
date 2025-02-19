"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, PenToolIcon as Tool, Wrench, Zap } from "lucide-react"
import Link from "next/link"

const dummyFixers = [
  { id: 1, name: "John Doe", service: "Plumbing", rate: "$50/hr", distance: 2.5, icon: Wrench },
  { id: 2, name: "Jane Smith", service: "Electrical", rate: "$60/hr", distance: 1.8, icon: Zap },
  { id: 3, name: "Mike Johnson", service: "Carpentry", rate: "$55/hr", distance: 3.2, icon: Tool },
]

export default function Search() {
  const [service, setService] = useState("")
  const [providers, setProviders] = useState(dummyFixers)
  const [error, setError] = useState("")
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)

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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!location) {
      setError("Location is not available")
      return
    }

    const filteredProviders = dummyFixers.filter((fixer) => fixer.service.toLowerCase().includes(service.toLowerCase()))
    setProviders(filteredProviders)

    // try {
    //   const response = await fetch(
    //     `/api/service/search?latitude=${location.latitude}&longitude=${location.longitude}&service=${service}`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       },
    //     }
    //   )

    //   const data = await response.json()

    //   if (data.success) {
    //     setProviders(data.providers)
    //   } else {
    //     setError(data.message)
    //   }
    // } catch (error) {
    //   setError("An error occurred. Please try again.")
    // }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Find Service Providers</h1>
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex gap-4 mb-8">
          <Input
            type="text"
            placeholder="Service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            className="bg-white/5 border-white/10 text-white flex-grow"
            required
          />
          <Button type="submit" disabled={!location}>
            Search
          </Button>
        </form>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {location && (
          <p className="text-sm text-gray-400 mb-4">
            Your location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </p>
        )}

        <div className="space-y-4">
          {providers.map((provider) => (
            <Card key={provider.id} className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <provider.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{provider.name}</h3>
                    <p className="text-sm text-gray-400">{provider.service}</p>
                  </div>
                  <div className="ml-auto text-right">
                    <p className="text-emerald-400">{provider.rate}</p>
                    <div className="flex items-center justify-end gap-1 text-sm">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.distance.toFixed(2)} km</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href={`/fixer/${provider.id}`}>
                    <Button variant="outline" className="w-full text-green-600">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

