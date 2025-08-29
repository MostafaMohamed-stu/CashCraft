"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check, Crown } from "lucide-react"

export default function PremiumPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = () => {
    setIsLoading(true)
    // Simulate subscription process
    setTimeout(() => {
      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#084f5a] to-[#0a2e36] text-white">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Crown className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h1 className="text-4xl font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-xl text-gray-300">Unlock advanced financial management features</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Premium Plan</h2>
            <div className="text-5xl font-bold mb-2">EGP 90</div>
            <p className="text-gray-300">per month</p>
          </div>

          <div className="space-y-4 mb-8">
            {[
              "Advanced Savings Challenges",
              "AI-Powered Financial Insights",
              "Personalized Financial Coaching",
              "Exclusive Educational Content",
              "Investment Simulators",
              "Priority Customer Support",
              "Advanced Budgeting Tools",
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center space-x-3"
              >
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-lg">{feature}</span>
              </motion.div>
            ))}
          </div>

          <Button
            onClick={handleSubscribe}
            disabled={isLoading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-4 text-lg"
          >
            {isLoading ? "Processing..." : "Subscribe Now"}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
