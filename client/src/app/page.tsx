"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import Lenis from "lenis"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Search, Wrench, Zap, PenToolIcon as Tool, Award, Star } from "lucide-react"
import Link from "next/link"
import type React from "react"

export default function Home() {
  const heroRef = useRef(null)
  const servicesRef = useRef(null)

  useEffect(() => {
    // Initialize smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // GSAP animations
    const tl = gsap.timeline()

    tl.from(heroRef.current, {
      opacity: 0,
      duration: 1,
      y: 50,
      ease: "power4.out",
    }).from(
      servicesRef.current,
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.5",
    )

    return () => {
      lenis.destroy()
    }
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] -z-10" />

        <div ref={heroRef} className="container mx-auto px-4 pt-8 pb-20">
          {/* Logo */}
          <div className="flex justify-between items-center mb-8">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-k2Vf4va9d4gB5HLdTtxk8uyYh8SdpS.png"
              alt="QuickFixer Logo"
              className="h-16 w-auto"
            />
            <div className="space-x-4">
              <Link href="/login">
                <Button>Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>

          {/* Search Section */}
          <div className="max-w-xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Find Trusted Fixers
              <span className="block text-emerald-400">In Your Area</span>
            </h1>
            <p className="text-gray-400 mb-8">
              Connect with verified professionals within 5km for all your repair needs
            </p>

            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input placeholder="Enter your location" className="pl-10 bg-white/5 border-white/10 text-white" />
                </div>
                <Link href="/search">
                  <Button className="bg-emerald-500 hover:bg-emerald-600">
                    <Search className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div ref={servicesRef} className="bg-white/5 backdrop-blur-sm py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8 text-center">Popular Services</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            <ServiceCard icon={<Wrench />} title="Plumbing" count="48 Fixers" />
            <ServiceCard icon={<Zap />} title="Electrical" count="36 Fixers" />
            <ServiceCard icon={<Tool />} title="Carpentry" count="29 Fixers" />
          </div>

          {/* Top Rated Fixers */}
          <h2 className="text-2xl font-bold mb-8 text-center">Top Rated Fixers</h2>
          <div className="grid gap-4">
            <FixerCard name="John Smith" profession="Plumber" rating={4.9} jobs={127} price="$50-80" recommended />
            <FixerCard name="Mike Johnson" profession="Electrician" rating={4.8} jobs={98} price="$60-100" />
          </div>
        </div>
      </div>
    </main>
  )
}

function ServiceCard({ icon, title, count }: { icon: React.ReactNode; title: string; count: string }) {
  return (
    <Card className="group hover:bg-emerald-500/5 border-white/5 bg-white/5 transition-all duration-300">
      <CardContent className="p-6 text-center">
        <div className="mb-4 text-emerald-400 flex justify-center">{icon}</div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{count}</p>
      </CardContent>
    </Card>
  )
}

function FixerCard({
  name,
  profession,
  rating,
  jobs,
  price,
  recommended,
}: {
  name: string
  profession: string
  rating: number
  jobs: number
  price: string
  recommended?: boolean
}) {
  return (
    <Card className="border-white/5 bg-white/5 hover:bg-emerald-500/5 transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Tool className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold">{name}</h3>
              {recommended && (
                <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-400">
                  <Award className="h-3 w-3 mr-1" />
                  Recommended
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-400 mb-2">{profession}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <span>{rating}</span>
              </div>
              <div className="text-gray-400">{jobs} jobs</div>
              <div className="text-emerald-400">{price}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

