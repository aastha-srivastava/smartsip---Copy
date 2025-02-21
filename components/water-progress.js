"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function WaterProgress({ dailyGoal, achievedGoal, percentage }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const radius = 90 // Radius of the circle
  const circumference = 2 * Math.PI * radius // Full circle length
  const progress = (percentage / 100) * circumference // Arc length based on percentage

  if (isLoading) {
    return (
      <div className="relative w-64 h-64 mx-auto">
        <div className="absolute inset-0 rounded-full bg-gray-200 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Background Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#dbeafe"
          strokeWidth="10"
        />
        {/* Progress Arc */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="#389cfc"
          strokeWidth="6"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </svg>

      {/* Progress Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-bold text-[#389cfc]">{achievedGoal} mL</span>
        <span className="text-gray-400 text-xl">/ {dailyGoal} mL</span>
      </div>
    </div>
  )
}
