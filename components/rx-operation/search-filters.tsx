"use client"

import { Search, RotateCcw } from "lucide-react"
import { MultiSelect } from "./multi-select"
import { SingleSelect } from "./single-select"

const APPROVAL_OPTIONS = ["Unready", "Requested", "Confirm", "Reject", "Canceled"]
const WORK_STATUS_OPTIONS = ["Pending", "Inbound Inspection", "In Progress", "Re Do", "Outbound Inspection", "Completed", "Finalized"]
const CANCEL_OPTIONS = ["Canceled", "Refunded"]
const DATE_TYPE_OPTIONS = [
  { label: "Order Date", value: "ORDER" },
  { label: "Save Date", value: "SAVE" },
]

interface SearchFiltersProps {
  approvals: Set<string>
  setApprovals: (v: Set<string>) => void
  workStatuses: Set<string>
  setWorkStatuses: (v: Set<string>) => void
  cancelRefunds: Set<string>
  setCancelRefunds: (v: Set<string>) => void
  dateType: string
  setDateType: (v: string) => void
  dateFrom: string
  setDateFrom: (v: string) => void
  dateTo: string
  setDateTo: (v: string) => void
  keyword: string
  setKeyword: (v: string) => void
  onSearch: () => void
  onReset: () => void
}

export function SearchFilters({
  approvals, setApprovals,
  workStatuses, setWorkStatuses,
  cancelRefunds, setCancelRefunds,
  dateType, setDateType,
  dateFrom, setDateFrom,
  dateTo, setDateTo,
  keyword, setKeyword,
  onSearch, onReset,
}: SearchFiltersProps) {
  return (
    <div className="rounded-lg border border-[#e0e0e0] bg-white mb-6 overflow-visible">
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b border-[#f0f0f0]">
            <th className="bg-[#f7f8fa] px-3.5 py-3 text-[11px] font-semibold text-[#555] text-left whitespace-nowrap w-[140px] border-r border-[#eee] tracking-wide">
              Approval Status
            </th>
            <td className="px-3.5 py-2.5">
              <MultiSelect options={APPROVAL_OPTIONS} selected={approvals} onChange={setApprovals} />
            </td>
            <th className="bg-[#f7f8fa] px-3.5 py-3 text-[11px] font-semibold text-[#555] text-left whitespace-nowrap w-[140px] border-r border-[#eee] tracking-wide">
              Processing Status
            </th>
            <td className="px-3.5 py-2.5">
              <MultiSelect options={WORK_STATUS_OPTIONS} selected={workStatuses} onChange={setWorkStatuses} />
            </td>
          </tr>
          <tr className="border-b border-[#f0f0f0]">
            <th className="bg-[#f7f8fa] px-3.5 py-3 text-[11px] font-semibold text-[#555] text-left whitespace-nowrap w-[140px] border-r border-[#eee] tracking-wide">
              Cancel / Refund
            </th>
            <td className="px-3.5 py-2.5">
              <MultiSelect options={CANCEL_OPTIONS} selected={cancelRefunds} onChange={setCancelRefunds} />
            </td>
            <th className="bg-[#f7f8fa] px-3.5 py-3 text-[11px] font-semibold text-[#555] text-left whitespace-nowrap w-[140px] border-r border-[#eee] tracking-wide">
              Search Period
            </th>
            <td className="px-3.5 py-2.5">
              <div className="flex items-center gap-2.5">
                <SingleSelect options={DATE_TYPE_OPTIONS} value={dateType} onChange={setDateType} />
                <input
                  type="date"
                  lang="en"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="h-[33px] border border-[#ddd] rounded-md px-3 text-[12px] text-[#333] outline-none focus:border-[#ff6b35] focus:shadow-[0_0_0_2px_rgba(255,107,53,0.12)] min-w-[140px]"
                />
                <span className="text-[#aaa]">~</span>
                <input
                  type="date"
                  lang="en"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="h-[33px] border border-[#ddd] rounded-md px-3 text-[12px] text-[#333] outline-none focus:border-[#ff6b35] focus:shadow-[0_0_0_2px_rgba(255,107,53,0.12)] min-w-[140px]"
                />
              </div>
            </td>
          </tr>
          <tr className="border-t border-[#eee]">
            <th className="bg-[#f7f8fa] px-3.5 py-3 text-[11px] font-semibold text-[#555] text-left whitespace-nowrap w-[140px] border-r border-[#eee] tracking-wide">
              Keyword
              <br />
              <span className="font-normal text-[11px] text-[#999]">Order No, Invoice No, Product Code, Product Name, Barcode</span>
            </th>
            <td colSpan={3} className="px-3.5 py-2.5">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Please enter at least 2 characters"
                className="w-full h-[33px] border border-[#ddd] rounded-md px-3 text-[12px] text-[#333] outline-none focus:border-[#ff6b35] focus:shadow-[0_0_0_2px_rgba(255,107,53,0.12)] placeholder:text-[11px] placeholder:text-[#bbb]"
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="flex justify-center py-2 px-3 bg-[#f7f8fa] border-t border-[#eee] gap-1.5">
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-1 h-[30px] px-5 bg-white text-[#555] border border-[#ddd] rounded text-[11px] font-medium cursor-pointer hover:bg-[#f5f5f5]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </button>
        <button
          onClick={onSearch}
          className="flex items-center justify-center gap-1 h-[30px] px-6 bg-[#ff6b35] text-white border-none rounded text-[11px] font-semibold cursor-pointer hover:bg-[#e55e2b]"
        >
          <Search className="w-3.5 h-3.5" />
          Search
        </button>
      </div>
    </div>
  )
}
