import { Home, LineChart, Settings, User } from "lucide-react"

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        <NavItem icon={Home} label="Home" isActive />
        <NavItem icon={LineChart} label="Analysis" />
        <NavItem icon={Settings} label="Setting" />
        <NavItem icon={User} label="Profile" />
      </div>
    </div>
  )
}

function NavItem({
  icon: Icon,
  label,
  isActive,
}) {
  return (
    <button className={`flex flex-col items-center gap-1 ${isActive ? "text-[#389cfc]" : "text-gray-400"}`}>
      <Icon className="w-6 h-6" />
      <span className="text-xs">{label}</span>
    </button>
  )
}