"use client"

import { LayoutGrid, BarChart3, Eye, Package, RefreshCw } from "lucide-react"

const TABS = [
  { label: "Front POS Main", icon: LayoutGrid },
  { label: "Daily Sales Summary", icon: BarChart3 },
  { label: "Rx Operation List", icon: Eye, active: true },
  { label: "Store Pickup List", icon: Package },
  { label: "Outbound Label Print", icon: RefreshCw },
]

export function TabNav() {
  return (
    <nav className="fixed top-16 left-0 right-0 z-[1100] bg-[#FAFAFA] flex items-center justify-start px-6 border-b border-[#E5E5E5] h-12 gap-0">
      {TABS.map((tab) => {
        const Icon = tab.icon
        return (
          <div
            key={tab.label}
            className={`flex items-center justify-center gap-1.5 px-5 h-12 text-[13px] font-medium cursor-pointer whitespace-nowrap transition-colors border-b-2 ${
              tab.active
                ? "text-[#D97706] border-[#D97706] font-semibold"
                : "text-[#222] border-transparent hover:text-[#D97706]"
            }`}
          >
            <Icon className={`w-[18px] h-[18px] ${tab.active ? "text-[#D97706]" : "text-[#888]"}`} />
            {tab.label}
          </div>
        )
      })}
    </nav>
  )
}
