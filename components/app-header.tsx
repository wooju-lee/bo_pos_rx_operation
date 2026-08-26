"use client"

import { Menu, ChevronDown } from "lucide-react"

interface AppHeaderProps {
  onToggleSidebar?: () => void
}

export function AppHeader({ onToggleSidebar }: AppHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-[1201] h-16 bg-white flex items-center justify-between px-4 border-b border-[#e0e0e0]">
      {/* Left */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/[0.04] transition-colors"
        >
          <Menu className="w-[22px] h-[22px] text-[#555]" />
        </button>
        <span className="text-xl font-medium text-[#222] tracking-normal" style={{ fontFamily: "'Inter','Roboto',sans-serif" }}>
          IIC BO
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button className="flex items-center gap-1 py-[5px] px-[9px] text-[10px] text-[#222] rounded hover:bg-black/[0.04] transition-colors">
          Language <b className="font-bold ml-0.5">English</b>
          <ChevronDown className="w-5 h-5 text-[#222]" />
        </button>
        <button className="flex items-center gap-1 h-[34px] px-[9px] pl-[14px] bg-[#ff6b35] text-white rounded-md text-[10px] font-medium hover:bg-[#e55e2b] transition-colors">
          monster1437 / BO_SUPER_ADMIN
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  )
}
