"use client"

import { useState } from "react"
import { Check } from "lucide-react"

interface FilterSectionProps {
  onSearch: () => void
}

type QuickDate = "today" | "week" | "month" | "3months"

const PERIOD_OPTIONS = [
  { value: "basic-iic", label: "(Basic) IIC Lab" },
  { value: "basic-lab1", label: "(Basic) Lab 1" },
  { value: "basic-lab2", label: "(Basic) Lab 2" },
  { value: "tint-iic", label: "(Tint) IIC Lab" },
  { value: "tint-lab1", label: "(Tint) Lab 1" },
  { value: "tint-lab2", label: "(Tint) Lab 2" },
]

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "inbound-inspection", label: "Inbound Inspection" },
  { value: "in-progress", label: "In Progress" },
  { value: "re-do", label: "Re Do" },
  { value: "outbound-inspection", label: "Outbound Inspection" },
  { value: "completed", label: "Completed" },
  { value: "finalized", label: "Finalized" },
]

const BP_OPTIONS = [
  { value: "C1002", label: "C1002 / IICOMBINED US" },
  { value: "C1003", label: "C1003 / IICOMBINED CA" },
]

const STORE_OPTIONS_BY_BP: Record<string, { value: string; label: string }[]> = {
  C1002: [
    { value: "US1001", label: "US1001 / US_STORE_1" },
    { value: "US1002", label: "US1002 / US_STORE_2" },
    { value: "US1003", label: "US1003 / US_STORE_3" },
    { value: "US1004", label: "US1004 / US_ONLINE" },
  ],
  C1003: [
    { value: "CA1001", label: "CA1001 / CA_STORE_1" },
    { value: "CA1002", label: "CA1002 / CA_STORE_2" },
    { value: "CA1003", label: "CA1003 / CA_STORE_3" },
  ],
}

const formatDate = (date: Date) => date.toISOString().split("T")[0]
const today = new Date()
const thirtyDaysAgo = new Date(today)
thirtyDaysAgo.setDate(today.getDate() - 30)

/* ── Multi-select dropdown (reusable) ── */
function MultiSelectDropdown({
  id,
  options,
  selected,
  onToggle,
  placeholder,
  disabled,
  minWidth = "200px",
}: {
  id: string
  options: { value: string; label: string }[]
  selected: string[]
  onToggle: (value: string) => void
  placeholder: string
  disabled?: boolean
  minWidth?: string
}) {
  const [open, setOpen] = useState(false)

  const label =
    selected.length === 0
      ? `${placeholder} (All)`
      : selected.length === 1
      ? options.find((o) => o.value === selected[0])?.label ?? selected[0]
      : `${options.find((o) => o.value === selected[0])?.label ?? selected[0]} +${selected.length - 1}`

  return (
    <div className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }} tabIndex={-1}>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        className="h-[34px] border border-[#d5d5d5] rounded px-2.5 pr-7 text-xs bg-white text-[#222] flex items-center cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap transition-colors hover:border-[#999] bg-no-repeat"
        style={{
          minWidth,
          opacity: disabled ? 0.6 : 1,
          pointerEvents: disabled ? "none" : "auto",
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z' fill='%23666'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
        }}
      >
        {label}
      </button>
      {open && (
        <div className="absolute top-[38px] left-0 min-w-full bg-white border border-[#d5d5d5] rounded shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-[100] max-h-[200px] overflow-y-auto">
          {options.map((opt) => {
            const isSelected = selected.includes(opt.value)
            return (
              <div
                key={opt.value}
                className={`flex items-center gap-2 px-3 py-2 text-xs cursor-pointer transition-colors whitespace-nowrap ${
                  isSelected ? "bg-[#FFF3E0] text-[#ff6b35] font-semibold" : "text-[#333] hover:bg-[#f5f5f5]"
                }`}
                onMouseDown={(e) => { e.preventDefault(); onToggle(opt.value) }}
              >
                <span className={`w-3.5 h-3.5 inline-flex items-center justify-center text-[#ff6b35] text-sm ${isSelected ? "visible" : "invisible"}`}>
                  <Check className="w-3.5 h-3.5" />
                </span>
                {opt.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function FilterSection({ onSearch }: FilterSectionProps) {
  const [quickDate, setQuickDate] = useState<QuickDate | null>(null)
  const [selectedBP, setSelectedBP] = useState<string[]>([])
  const [selectedStores, setSelectedStores] = useState<string[]>([])
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const currentStoreOptions = selectedBP.length > 0
    ? selectedBP.flatMap((bp) => STORE_OPTIONS_BY_BP[bp] ?? [])
    : []

  const handleBPToggle = (value: string) => {
    setSelectedBP((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
    setSelectedStores([])
  }

  const handleStoreToggle = (value: string) => {
    setSelectedStores((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handlePeriodToggle = (value: string) => {
    setSelectedPeriods((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleStatusToggle = (value: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  const handleReset = () => {
    setQuickDate(null)
    setSelectedBP([])
    setSelectedStores([])
    setSelectedPeriods([])
    setSelectedStatuses([])
  }

  /* ── Toggle button group (segmented control) ── */
  const ToggleGroup = ({
    options,
    defaultValue,
  }: {
    options: { value: string; label: string }[]
    defaultValue?: string
  }) => {
    const [active, setActive] = useState(defaultValue ?? options[0]?.value ?? "")
    return (
      <div className="inline-flex border border-[#d5d5d5] rounded-md overflow-hidden">
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setActive(opt.value)}
            className={`h-[34px] px-[18px] text-xs font-semibold cursor-pointer transition-all whitespace-nowrap ${
              i < options.length - 1 ? "border-r border-[#d5d5d5]" : ""
            } ${
              active === opt.value
                ? "bg-[#ff6b35] text-white"
                : "bg-white text-[#555] hover:bg-[#f5f5f5]"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    )
  }

  /* ── Inline select ── */
  const InlineSelect = ({
    options,
    defaultValue,
    minWidth = "150px",
  }: {
    options: { value: string; label: string }[]
    defaultValue?: string
    minWidth?: string
  }) => (
    <select
      defaultValue={defaultValue ?? options[0]?.value}
      className="h-[34px] border border-[#d5d5d5] rounded px-2.5 pr-7 text-xs bg-white text-[#222] outline-none transition-colors appearance-none focus:border-[#ff6b35] focus:shadow-[0_0_0_2px_rgba(255,107,53,0.12)]"
      style={{
        minWidth,
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z' fill='%23666'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )

  return (
    <div className="rounded-lg border border-[#e0e0e0] bg-white mb-6" style={{ overflow: "visible" }}>
      <table className="w-full border-collapse" style={{ tableLayout: "auto" }}>
        <tbody>
          {/* Row 1: BP / Store */}
          <tr className="border-b border-[#f0f0f0]">
            <th className="bg-[#f7f8fa] px-5 py-3 text-xs font-semibold text-[#555] text-left whitespace-nowrap w-[140px] align-middle border-r border-[#eee] tracking-wide">
              BP / Store
            </th>
            <td className="px-4 py-2.5 align-middle">
              <div className="flex gap-0 items-center">
                <div style={{ width: 240 }}>
                  <MultiSelectDropdown
                    id="bp"
                    options={BP_OPTIONS}
                    selected={selectedBP}
                    onToggle={handleBPToggle}
                    placeholder="BP"
                    minWidth="228px"
                  />
                </div>
                <div style={{ width: 280 }}>
                  <MultiSelectDropdown
                    id="store"
                    options={currentStoreOptions}
                    selected={selectedStores}
                    onToggle={handleStoreToggle}
                    placeholder="Store"
                    disabled={selectedBP.length === 0}
                    minWidth="268px"
                  />
                </div>
              </div>
            </td>
          </tr>

          {/* Row 2: Channel / Work Type */}
          <tr className="border-b border-[#f0f0f0]">
            <th className="bg-[#f7f8fa] px-5 py-3 text-xs font-semibold text-[#555] text-left whitespace-nowrap w-[140px] align-middle border-r border-[#eee] tracking-wide">
              Channel / Work Type
            </th>
            <td className="px-4 py-2.5 align-middle">
              <div className="flex gap-0 items-center">
                <div style={{ width: 240 }}>
                  <ToggleGroup
                    options={[
                      { value: "all", label: "ALL" },
                      { value: "online", label: "Online" },
                      { value: "offline", label: "Offline" },
                    ]}
                    defaultValue="all"
                  />
                </div>
                <div style={{ width: 280 }}>
                  <ToggleGroup
                    options={[
                      { value: "all", label: "ALL" },
                      { value: "in-house", label: "IN HOUSE" },
                      { value: "outsourced", label: "OUTSOURCED" },
                    ]}
                    defaultValue="all"
                  />
                </div>
              </div>
            </td>
          </tr>

          {/* Row 3: Work Status */}
          <tr className="border-b border-[#f0f0f0]">
            <th className="bg-[#f7f8fa] px-5 py-3 text-xs font-semibold text-[#555] text-left whitespace-nowrap w-[140px] align-middle border-r border-[#eee] tracking-wide">
              Work Status
            </th>
            <td className="px-4 py-2.5 align-middle">
              <div className="flex gap-0 items-center">
                <div style={{ width: 240 }}>
                  <MultiSelectDropdown
                    id="status"
                    options={STATUS_OPTIONS}
                    selected={selectedStatuses}
                    onToggle={handleStatusToggle}
                    placeholder="Status"
                    minWidth="228px"
                  />
                </div>
                <div style={{ width: 280 }}>
                  <MultiSelectDropdown
                    id="period"
                    options={PERIOD_OPTIONS}
                    selected={selectedPeriods}
                    onToggle={handlePeriodToggle}
                    placeholder="Processing Period"
                    minWidth="268px"
                  />
                </div>
                <div style={{ width: 200 }}>
                  <InlineSelect
                    options={[
                      { value: "all", label: "Cancel / Refund (All)" },
                      { value: "cancel", label: "Cancel" },
                      { value: "refund", label: "Refund" },
                    ]}
                    minWidth="188px"
                  />
                </div>
              </div>
            </td>
          </tr>

          {/* Row 4: Search Period */}
          <tr className="border-b border-[#f0f0f0]">
            <th className="bg-[#f7f8fa] px-5 py-3 text-xs font-semibold text-[#555] text-left whitespace-nowrap w-[140px] align-middle border-r border-[#eee] tracking-wide">
              Search Period
            </th>
            <td className="px-4 py-2.5 align-middle">
              <div className="flex gap-0 items-center">
                <div style={{ width: 240 }}>
                  <InlineSelect
                    options={[
                      { value: "order", label: "Order Date" },
                      { value: "approval", label: "Approval Date" },
                      { value: "completion", label: "Completion Date" },
                    ]}
                    minWidth="228px"
                  />
                </div>
                <div className="flex items-center gap-2" style={{ width: 280 }}>
                  <input
                    type="text"
                    placeholder="yyyy-mm-dd"
                    defaultValue={formatDate(thirtyDaysAgo)}
                    onFocus={(e) => { e.currentTarget.type = "date" }}
                    onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = "text" }}
                    className="h-[34px] border border-[#d5d5d5] rounded px-2.5 text-xs bg-white text-[#222] outline-none transition-colors focus:border-[#ff6b35] focus:shadow-[0_0_0_2px_rgba(255,107,53,0.12)] w-[124px]"
                  />
                  <span className="text-[#999] text-[13px]">~</span>
                  <input
                    type="text"
                    placeholder="yyyy-mm-dd"
                    defaultValue={formatDate(today)}
                    onFocus={(e) => { e.currentTarget.type = "date" }}
                    onBlur={(e) => { if (!e.currentTarget.value) e.currentTarget.type = "text" }}
                    className="h-[34px] border border-[#d5d5d5] rounded px-2.5 text-xs bg-white text-[#222] outline-none transition-colors focus:border-[#ff6b35] focus:shadow-[0_0_0_2px_rgba(255,107,53,0.12)] w-[124px]"
                  />
                </div>
                <div className="flex gap-1">
                  {[
                    { key: "today", label: "Today" },
                    { key: "week", label: "1W" },
                    { key: "month", label: "1M" },
                    { key: "3months", label: "3M" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setQuickDate(item.key as QuickDate)}
                      className={`h-7 px-3 border rounded-full text-[11px] font-medium cursor-pointer transition-all whitespace-nowrap ${
                        quickDate === item.key
                          ? "bg-[#ff6b35] text-white border-[#ff6b35]"
                          : "bg-white text-[#666] border-[#d5d5d5] hover:border-[#ff6b35] hover:text-[#ff6b35]"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </td>
          </tr>

          {/* Row 5: Keyword Search */}
          <tr>
            <th className="bg-[#f7f8fa] px-5 py-3 text-xs font-semibold text-[#555] text-left whitespace-nowrap w-[140px] align-middle border-r border-[#eee] tracking-wide">
              Keyword
            </th>
            <td className="px-4 py-2.5 align-middle">
              <div className="flex gap-0 items-center">
                <div style={{ width: 520 }}>
                  <input
                    type="text"
                    placeholder="Store Code, Store Name, Order No. #, Number #"
                    className="h-[34px] border border-[#d5d5d5] rounded px-2.5 text-xs bg-white text-[#222] outline-none transition-colors focus:border-[#ff6b35] focus:shadow-[0_0_0_2px_rgba(255,107,53,0.12)]"
                    style={{ width: 508 }}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Search Actions */}
      <div className="flex justify-center py-3.5 px-5 bg-[#f7f8fa] border-t border-[#eee] gap-2 rounded-b-lg">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center justify-center gap-1.5 h-9 px-8 bg-white text-[#555] border border-[#d5d5d5] rounded text-[13px] font-semibold cursor-pointer transition-all hover:bg-[#f5f5f5] hover:border-[#bbb]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#555">
            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
          </svg>
          Reset
        </button>
        <button
          type="button"
          onClick={onSearch}
          className="flex items-center justify-center gap-1.5 h-9 px-8 bg-[#ff6b35] text-white border-none rounded text-[13px] font-semibold cursor-pointer transition-colors hover:bg-[#e55e2b]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          Search
        </button>
      </div>
    </div>
  )
}
