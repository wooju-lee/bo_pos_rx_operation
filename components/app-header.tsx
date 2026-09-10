"use client"

import { ChevronDown } from "lucide-react"

export function AppHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-[1200] h-16 bg-white flex items-center justify-between px-6 border-b border-[#e0e0e0]">
      {/* Left — Store Info */}
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-[#ff6b35] tracking-wide">US1001</span>
          <span className="text-lg font-bold text-[#222]">GM_LosAngeles_FS_Downtown</span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1">
        <button className="flex items-center gap-1 py-[5px] px-[9px] text-[10px] text-[#222] rounded hover:bg-black/[0.04] transition-colors">
          Language <b className="font-bold ml-0.5">English</b>
          <ChevronDown className="w-4 h-4 text-[#222]" />
        </button>
        <button className="flex items-center gap-1 h-[34px] px-[9px] pl-[14px] bg-[#ff6b35] text-white rounded-md text-[10px] font-medium hover:bg-[#e55e2b] transition-colors">
          monster1437 / BO_SUPER_ADMIN
          <ChevronDown className="w-4 h-4 text-white" />
        </button>
      </div>
    </header>
  )
}
