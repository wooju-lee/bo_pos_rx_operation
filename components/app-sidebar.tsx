"use client"

import React, { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: string
  label: string
  icon: React.ReactNode
  children: { label: string; href?: string; active?: boolean }[]
  defaultOpen?: boolean
}

const menuItems: MenuItem[] = [
  {
    id: "master",
    label: "Master Information",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#555">
        <path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" />
      </svg>
    ),
    children: [
      { label: "Store" },
      { label: "Product" },
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#555">
        <path d="M14 2H6c-1.1 0-2 .9-2 2v16l4-2 4 2 4-2 4 2V4c0-1.1-.9-2-2-2zm4 14.5l-2-1-4 2-4-2-2 1V4h12v12.5zM14 9H8V7h6v2zm-2 4H8v-2h4v2z" />
      </svg>
    ),
    children: [
      { label: "Daily Record View" },
      { label: "Period Sales View" },
    ],
  },
  {
    id: "order",
    label: "Order",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#555">
        <path d="M18 6h-2c0-2.21-1.79-4-4-4S8 3.79 8 6H6c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-6-2c1.1 0 2 .9 2 2h-4c0-1.1.9-2 2-2zm6 16H6V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h4v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
      </svg>
    ),
    children: [
      { label: "Order List" },
    ],
  },
  {
    id: "inv",
    label: "Inventory",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#555">
        <path d="M20 2H4c-1 0-2 .9-2 2v3.01c0 .72.43 1.34 1 1.69V20c0 1.1 1.1 2 2 2h14c.9 0 2-.9 2-2V8.7c.57-.35 1-.97 1-1.69V4c0-1.1-1-2-2-2zm-5 12H9v-2h6v2zm5-7H4V4h16v3z" />
      </svg>
    ),
    children: [
      { label: "Inbound List" },
      { label: "Outbound List" },
      { label: "Inventory Snapshot" },
      { label: "Inventory Adjustment" },
      { label: "Inventory Stocktaking" },
    ],
  },
  {
    id: "rx",
    label: "Rx (LMS)",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#555">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
      </svg>
    ),
    defaultOpen: true,
    children: [
      { label: "Prescription Review List" },
      { label: "Lens Work Management", active: true },
    ],
  },
  {
    id: "rpt",
    label: "Global Report",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#555">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
      </svg>
    ),
    children: [
      { label: "Report Board" },
    ],
  },
  {
    id: "sys",
    label: "System Setting",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#555">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
    ),
    children: [
      { label: "POS Display Setting" },
    ],
  },
]

interface AppSidebarProps {
  collapsed: boolean
}

export function AppSidebar({ collapsed }: AppSidebarProps) {
  const [openMenus, setOpenMenus] = useState<Set<string>>(() => {
    const defaults = new Set<string>()
    menuItems.forEach((item) => {
      if (item.defaultOpen) defaults.add(item.id)
    })
    return defaults
  })

  const toggleMenu = (id: string) => {
    setOpenMenus((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <nav
      className={cn(
        "fixed top-16 left-0 bottom-0 bg-white overflow-y-auto overflow-x-hidden z-[1200] flex flex-col pb-[100px] transition-all duration-[250ms] ease-in-out",
        collapsed ? "w-0 overflow-hidden border-r-0" : "w-[300px] border-r border-black/[0.08]"
      )}
      style={{ scrollbarWidth: "thin" }}
    >
      {menuItems.map((item) => {
        const isOpen = openMenus.has(item.id)
        return (
          <React.Fragment key={item.id}>
            {/* Depth 1 */}
            <button
              onClick={() => toggleMenu(item.id)}
              className={cn(
                "flex items-center w-full min-h-[48px] px-4 py-2 cursor-pointer border-none bg-transparent text-[#222] transition-colors duration-150 hover:bg-black/[0.04]",
                isOpen && item.children.some((c) => c.active) && "bg-black/[0.02]"
              )}
            >
              <div className="w-10 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <span className="flex-1 text-[13px] font-semibold text-left">{item.label}</span>
              <div className={cn("transition-transform duration-[250ms]", isOpen && "rotate-180")}>
                <ChevronDown className="w-5 h-5 text-[#888]" />
              </div>
            </button>

            {/* Submenu */}
            <div
              className={cn(
                "overflow-hidden transition-[max-height] duration-300 ease-in-out",
                isOpen ? "max-h-[500px]" : "max-h-0"
              )}
            >
              {item.children.map((child, i) => (
                <a
                  key={i}
                  href="#"
                  className={cn(
                    "flex items-center w-full min-h-[40px] pl-[55px] pr-4 py-2 cursor-pointer no-underline text-[#222] transition-colors duration-150 hover:bg-black/[0.04]",
                    child.active && "bg-[rgb(255_153_116/30%)]"
                  )}
                  onClick={(e) => e.preventDefault()}
                >
                  <span className="flex-1 text-[13px] font-medium text-left">{child.label}</span>
                </a>
              ))}
            </div>
          </React.Fragment>
        )
      })}

      {/* POS Button */}
      <div className={cn(
        "fixed bottom-10 left-4 w-[268px] z-[1201] transition-opacity duration-[250ms]",
        collapsed && "opacity-0 pointer-events-none"
      )}>
        <button className="flex items-center justify-center gap-1.5 ml-auto px-3.5 py-2 bg-[#ff6b35] text-white rounded-md text-xs font-medium hover:bg-[#d35f00] transition-colors">
          <span>Front POS</span>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </nav>
  )
}
