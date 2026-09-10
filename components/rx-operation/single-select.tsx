"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface SingleSelectProps {
  options: { label: string; value: string }[]
  value: string
  onChange: (value: string) => void
}

export function SingleSelect({ options, value, onChange }: SingleSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const selectedLabel = options.find((o) => o.value === value)?.label || options[0]?.label

  return (
    <div ref={ref} className="relative min-w-[140px] select-none">
      <div
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between h-[33px] px-3 border rounded-md bg-white text-[12px] text-[#333] cursor-pointer transition-all ${
          open ? "border-[#ff6b35] shadow-[0_0_0_2px_rgba(255,107,53,0.12)] rounded-b-none" : "border-[#ddd] hover:border-[#ccc]"
        }`}
      >
        <span>{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 text-[#666] shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 z-[100] bg-white border border-[#ff6b35] border-t-0 rounded-b-md max-h-[180px] overflow-y-auto shadow-lg">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => { onChange(opt.value); setOpen(false) }}
              className={`px-3.5 py-[8px] text-[12px] cursor-pointer transition-colors ${
                value === opt.value ? "text-[#ff6b35] font-semibold bg-[#FFF8F3]" : "text-[#333] hover:bg-[#FFF3E0]"
              }`}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
