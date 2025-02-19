"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wrench, Zap, PenToolIcon as Tool, Star, MapPin } from "lucide-react"

// Dummy fixer data
const dummyFixers = [
  {
    id: 1,
    name: "John Doe",
    service: "Plumbing",
    rate: "$50/hr",
    distance: 2.5,
    icon: Wrench,
    rating: 4.8,
    jobsCompleted: 127,
  },
  {
    id: 2,
    name: "Jane Smith",
    service: "Electrical",
    rate: "$60/hr",
    distance: 1.8,
    icon: Zap,
    rating: 4.9,
    jobsCompleted: 98,
  },
  {
    id: 3,
    name: "Mike Johnson",
    service: "Carpentry",
    rate: "$55/hr",
    distance: 3.2,
    icon: Tool,
    rating: 4.7,
    jobsCompleted: 112,
  },
]

export default function FixerProfile() {
  const params = useParams()
  const router = useRouter()
  const [fixer, setFixer] = useState<(typeof dummyFixers)[0] | null>(null)

  useEffect(() => {
    const fixerId = Number(params.id)
    const selectedFixer = dummyFixers.find((f) => f.id === fixerId)
    if (selectedFixer) {
      setFixer(selectedFixer)
    } else {
      // Redirect to search page if fixer not found
      router.push("/search")
    }
  }, [params.id, router])

  const handleHire = async () => {
    try {
      const response = await fetch("/api/payment/pay", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      const data = await response.json()
      if (data.success) {
        window.location.href = data.url
      } else {
        console.error("Failed to initiate payment")
      }
    } catch (error) {
      console.error("Error initiating payment:", error)
    }
  }

  if (!fixer) return null

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <Card className="max-w-2xl mx-auto bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">{fixer.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <fixer.icon className="h-12 w-12" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-xl font-semibold">{fixer.service}</p>
            <p className="text-emerald-400 text-lg">{fixer.rate}</p>
          </div>
          <div className="flex justify-center items-center space-x-4">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-400 mr-1" />
              <span>{fixer.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center">
              <Tool className="h-5 w-5 mr-1" />
              <span>{fixer.jobsCompleted} jobs completed</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-1" />
              <span>{fixer.distance.toFixed(2)} km away</span>
            </div>
          </div>
          <Button onClick={handleHire} className="w-full">
            Hire Now
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

