"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, X } from "lucide-react"

interface MultiSelectProps {
  options: string[]
  selected: Set<string>
  onChange: (selected: Set<string>) => void
  placeholder?: string
}

export function MultiSelect({ options, selected, onChange, placeholder = "All" }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const toggle = (val: string) => {
    const next = new Set(selected)
    if (next.has(val)) next.delete(val)
    else next.add(val)
    onChange(next)
  }

  const remove = (val: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const next = new Set(selected)
    next.delete(val)
    onChange(next)
  }

  return (
    <div ref={ref} className="relative min-w-[170px] select-none">
      <div
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between min-h-[33px] px-3 border rounded-md bg-white text-[12px] text-[#333] cursor-pointer transition-all ${
          open ? "border-[#ff6b35] shadow-[0_0_0_2px_rgba(255,107,53,0.12)] rounded-b-none" : "border-[#ddd] hover:border-[#ccc]"
        }`}
      >
        <div className="flex flex-wrap gap-1 items-center flex-1 min-w-0 py-1">
          {selected.size === 0 ? (
            <span className="text-[#999]">{placeholder}</span>
          ) : (
            Array.from(selected).map((val) => (
              <span key={val} className="inline-flex items-center gap-1 bg-[#FFF3E0] text-[#e55a00] text-[11px] font-medium px-[8px] py-[2px] rounded-full whitespace-nowrap">
                {val}
                <X className="w-3 h-3 cursor-pointer opacity-60 hover:opacity-100" onClick={(e) => remove(val, e)} />
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-[#666] shrink-0 ml-2 transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 z-[100] bg-white border border-[#ff6b35] border-t-0 rounded-b-md max-h-[180px] overflow-y-auto shadow-lg">
          {options.map((opt) => (
            <div
              key={opt}
              onClick={() => toggle(opt)}
              className={`px-3.5 py-[8px] text-[12px] cursor-pointer transition-colors ${
                selected.has(opt) ? "text-[#ff6b35] font-semibold bg-[#FFF8F3]" : "text-[#333] hover:bg-[#FFF3E0]"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
