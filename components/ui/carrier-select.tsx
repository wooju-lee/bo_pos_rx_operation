"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronUp, ChevronDown } from "lucide-react"

const CARRIERS = [
  { value: "FedEx", label: "FedEx" },
  { value: "UPS", label: "UPS" },
]

interface CarrierSelectProps {
  value: string
  onChange: (value: string) => void
}

export function CarrierSelect({ value, onChange }: CarrierSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selectedLabel = CARRIERS.find((c) => c.value === value)?.label || "Select carrier"

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full h-8 px-2.5 pr-7 text-[12px] text-left rounded flex items-center transition-colors ${
          open
            ? "border-2 border-orange-400 bg-orange-50"
            : "border border-input bg-white"
        }`}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>{selectedLabel}</span>
        {open ? (
          <ChevronUp className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="absolute right-2.5 h-3.5 w-3.5 text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="absolute top-[calc(100%+2px)] left-0 w-full z-50 border border-gray-200 rounded-md bg-white shadow-lg overflow-hidden">
          {CARRIERS.map((carrier) => (
            <button
              key={carrier.value}
              type="button"
              onClick={() => {
                onChange(carrier.value)
                setOpen(false)
              }}
              className={`w-full text-left px-2.5 py-2 text-[12px] border-b last:border-b-0 border-gray-100 transition-colors ${
                value === carrier.value
                  ? "bg-gray-50 font-medium text-foreground"
                  : "bg-white text-foreground hover:bg-gray-50"
              }`}
            >
              {carrier.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
