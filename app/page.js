"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import WaterProgress from "@/components/water-progress.js"
import RecordsList from "@/components/records-list.js"
import BottomNav from "@/components/bottom-nav.js"
import localFont from "next/font/local"
const monomakh = localFont({
  src: "./fonts/Monomakh-Regular.tff",
  variable: "--font-monomakh",
  weight: "100 900",
});
export default function Page() {

  
  const [waterPercentage, setWaterPercentage] = useState(0)
  const [records, setRecords] = useState([])
  const [data, setData] = useState({
    name: "",
    dailygoal: "",
    achivedgoal: "",
    currentlevel: "",
    LastIntakeAt: "2025-02-19 22:26:25",
    "water refilled": "",
    levelpercentage: ""

  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/proxy")        
        const resData = await response.json()
        setData(resData);
        setWaterPercentage((resData.achivedgoal/resData.dailygoal)*100);
        
        setRecords(prevRecords => [
          { time: data.LastIntakeAt.split(" ")[1], amount: parseInt(data.currentlevel), type: "water" },
          ...prevRecords.slice(0, 9) // Keeping the last 10 records
        ])
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    
    fetchData()
    const interval = setInterval(fetchData, 1000) // Fetch data every second
    return () => clearInterval(interval) // Cleanup interval on unmount
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-3xl text-[#389cfc] font-bold ">SmartSip</h1>
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-gray-600" />
          <button className="w-6 h-6 bg-black rounded-full" />
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        <WaterProgress percentage={waterPercentage} dailyGoal= {data.dailygoal} achievedGoal={data.achivedgoal} />
        <RecordsList records={records} />
      </main>

      <BottomNav />
    </div>
  )
}
