"use client"

import { useState, useMemo, useCallback } from "react"
import { Download, Mail } from "lucide-react"
import { toast } from "sonner"
import { rxData, APPROVAL_CLASS, WORK_CLASS, CANCEL_CLASS } from "@/lib/data"
import type { RxOrder } from "@/lib/data"
import { SearchFilters } from "@/components/rx-operation/search-filters"
import { OutboundModal } from "@/components/rx-operation/outbound-modal"
import { DetailView } from "@/components/rx-operation/detail-view"

export default function RxOperationPage() {
  // Search state
  const [approvals, setApprovals] = useState<Set<string>>(new Set())
  const [workStatuses, setWorkStatuses] = useState<Set<string>>(new Set())
  const [cancelRefunds, setCancelRefunds] = useState<Set<string>>(new Set())
  const [dateType, setDateType] = useState("ORDER")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [keyword, setKeyword] = useState("")

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(30)

  // Selection
  const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set())
  const [outboundRegisteredIds, setOutboundRegisteredIds] = useState<Set<string>>(new Set())

  // Outbound modal
  const [outboundOpen, setOutboundOpen] = useState(false)

  // Detail view
  const [detailOrder, setDetailOrder] = useState<RxOrder | null>(null)

  // Filtering
  const [searchTrigger, setSearchTrigger] = useState(0)
  const filtered = useMemo(() => {
    let result = [...rxData]
    if (approvals.size > 0) result = result.filter((d) => approvals.has(d.approval))
    if (workStatuses.size > 0) result = result.filter((d) => workStatuses.has(d.workStatus))
    if (cancelRefunds.size > 0) result = result.filter((d) => cancelRefunds.has(d.cancelRefund))
    if (dateFrom || dateTo) {
      result = result.filter((d) => {
        const dVal = dateType === "ORDER" ? d.orderDate : d.saveDate
        if (!dVal || dVal === "-") return false
        if (dateFrom && dVal < dateFrom) return false
        if (dateTo && dVal > dateTo) return false
        return true
      })
    }
    const q = keyword.trim().toLowerCase()
    if (q.length >= 2) {
      result = result.filter((d) => {
        const matchProduct = d.products.some(
          (p) => p.code.toLowerCase().includes(q) || p.name.toLowerCase().includes(q) || p.barcode.toLowerCase().includes(q)
        )
        const matchOrder = d.id.toLowerCase().includes(q) || d.invoiceNo.toLowerCase().includes(q)
        return matchProduct || matchOrder
      })
    }
    return result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTrigger])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(currentPage, totalPages)
  const startIdx = (safePage - 1) * pageSize
  const pageData = filtered.slice(startIdx, startIdx + pageSize)

  const doSearch = () => { setCurrentPage(1); setCheckedIds(new Set()); setSearchTrigger((p) => p + 1) }
  const resetSearch = () => {
    setApprovals(new Set()); setWorkStatuses(new Set()); setCancelRefunds(new Set())
    setDateType("ORDER"); setDateFrom(""); setDateTo(""); setKeyword("")
    setCurrentPage(1); setCheckedIds(new Set()); setSearchTrigger((p) => p + 1)
  }

  // Checkbox logic
  const canCheck = (d: RxOrder) => {
    const isCancelledOrRefunded = d.cancelRefund !== "-"
    return d.approval === "Confirm" && d.workStatus !== "Completed" && d.workStatus !== "Finalized" && !outboundRegisteredIds.has(d.id) && !isCancelledOrRefunded
  }

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAllChecks = (checked: boolean) => {
    if (checked) {
      const ids = pageData.filter(canCheck).map((d) => d.id)
      setCheckedIds(new Set(ids))
    } else {
      setCheckedIds(new Set())
    }
  }

  const allCheckable = pageData.filter(canCheck)
  const allChecked = allCheckable.length > 0 && allCheckable.every((d) => checkedIds.has(d.id))

  // Outbound
  const selectedItems = rxData.filter((d) => checkedIds.has(d.id))
  const onOutboundComplete = (ids: string[]) => {
    setOutboundRegisteredIds((prev) => {
      const next = new Set(prev)
      ids.forEach((id) => next.add(id))
      return next
    })
    setCheckedIds(new Set())
  }

  // Email
  const emailEnabled = (d: RxOrder) => d.approval === "Confirm" && d.workStatus === "Completed" && d.cancelRefund === "-"
  const sendEmail = (id: string) => {
    toast.success("Email sent to customer.")
  }

  // Detail
  if (detailOrder) {
    return <DetailView order={detailOrder} onBack={() => setDetailOrder(null)} />
  }

  return (
    <div>
      {/* Search Filters */}
      <SearchFilters
        approvals={approvals} setApprovals={setApprovals}
        workStatuses={workStatuses} setWorkStatuses={setWorkStatuses}
        cancelRefunds={cancelRefunds} setCancelRefunds={setCancelRefunds}
        dateType={dateType} setDateType={setDateType}
        dateFrom={dateFrom} setDateFrom={setDateFrom}
        dateTo={dateTo} setDateTo={setDateTo}
        keyword={keyword} setKeyword={setKeyword}
        onSearch={doSearch} onReset={resetSearch}
      />

      {/* Table */}
      <div className="rounded-lg border border-[#E5E5E5] bg-white p-[18px]">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[12px] text-[#555]">
            Total <b>{filtered.length}</b> Count
          </div>
          <div className="flex gap-2">
            <button
              disabled={checkedIds.size === 0}
              onClick={() => setOutboundOpen(true)}
              className={`inline-flex items-center gap-1 h-[28px] px-5 border-none rounded text-[11px] text-white font-semibold cursor-pointer transition-opacity ${
                checkedIds.size > 0 ? "bg-[#ff6b35] opacity-100 hover:bg-[#e55e2b]" : "bg-[#ff6b35] opacity-40 cursor-not-allowed"
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              Register Outbound
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <table className="border-collapse w-full">
            <thead>
              <tr>
                <th className="bg-[#ff6b35] text-white px-2.5 py-2 font-semibold text-[10px] text-center border-r border-white/20 border-b border-[#e0e0e0] w-9">
                  <input
                    type="checkbox"
                    checked={allChecked}
                    onChange={(e) => toggleAllChecks(e.target.checked)}
                    className="chk-custom"
                  />
                </th>
                <th className="bg-[#ff6b35] text-white px-2.5 py-2 font-semibold text-[10px] text-center border-r border-white/20 border-b border-[#e0e0e0] min-w-[120px] whitespace-nowrap">Order Date</th>
                <th className="bg-[#ff6b35] text-white px-2.5 py-2 font-semibold text-[10px] text-center border-r border-white/20 border-b border-[#e0e0e0] min-w-[120px] whitespace-nowrap">Save Date</th>
                <th className="bg-[#ff6b35] text-white px-2.5 py-2 font-semibold text-[10px] text-center border-r border-white/20 border-b border-[#e0e0e0] whitespace-nowrap">Approval Status</th>
                <th className="bg-[#ff6b35] text-white px-2.5 py-2 font-semibold text-[10px] text-center border-r border-white/20 border-b border-[#e0e0e0] whitespace-nowrap">Processing Status</th>
                <th className="bg-[#ff6b35] text-white px-2.5 py-2 font-semibold text-[10px] text-center border-r border-white/20 border-b border-[#e0e0e0] whitespace-nowrap">Cancel / Refund</th>
                <th className="bg-[#ff6b35] text-white px-2.5 py-2 font-semibold text-[10px] text-center border-r border-white/20 border-b border-[#e0e0e0] min-w-[150px] whitespace-nowrap">Order No.</th>
                <th className="bg-[#ff6b35] text-white px-2.5 py-2 font-semibold text-[10px] text-center border-r border-white/20 border-b border-[#e0e0e0] min-w-[150px] whitespace-nowrap">
                  Invoice No.<br /><span className="font-normal text-[11px]">(Inbound)</span>
                </th>
                <th className="bg-[#ff6b35] text-white px-2.5 py-2 font-semibold text-[10px] text-center border-r border-white/20 border-b border-[#e0e0e0] min-w-[300px] whitespace-nowrap">
                  Product Info<br /><span className="font-normal text-[11px]">Code / Name / Barcode</span>
                </th>
                <th className="bg-[#ff6b35] text-white px-2.5 py-2 font-semibold text-[10px] text-center border-b border-[#e0e0e0] whitespace-nowrap">Customer Email</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map((d) => {
                const isCR = d.cancelRefund !== "-"
                const cancelCls = isCR ? (CANCEL_CLASS[d.cancelRefund] || "bg-[#F5F5F5] text-[#888]") : "bg-[#FAFAFA] text-[#bbb]"
                const canChk = canCheck(d)
                const dimStyle = isCR ? "bg-[#f5f5f5] text-[#bbb]" : "bg-white text-[#555]"
                const dimBadge = isCR ? "opacity-40" : ""
                const emailOk = emailEnabled(d)

                return (
                  <tr key={d.id} onClick={() => setDetailOrder(d)} className="cursor-pointer hover:bg-blue-50/50">
                    <td className={`px-2.5 py-2.5 border-b border-[#eee] text-center text-[11px] ${dimStyle}`} onClick={(e) => e.stopPropagation()}>
                      {canChk ? (
                        <input
                          type="checkbox"
                          checked={checkedIds.has(d.id)}
                          onChange={() => toggleCheck(d.id)}
                          className="chk-custom"
                        />
                      ) : (
                        <input type="checkbox" disabled className="chk-custom" />
                      )}
                    </td>
                    <td className={`px-2.5 py-2.5 border-b border-[#eee] text-center text-[11px] whitespace-nowrap ${dimStyle}`}>{d.orderDate}</td>
                    <td className={`px-2.5 py-2.5 border-b border-[#eee] text-center text-[11px] whitespace-nowrap ${dimStyle}`}>{d.saveDate}</td>
                    <td className={`px-2.5 py-2.5 border-b border-[#eee] text-center text-[11px] ${dimStyle}`}>
                      <span className={`inline-flex items-center px-[7px] py-[2px] rounded-full text-[10px] font-semibold ${dimBadge} ${APPROVAL_CLASS[d.approval] || ""}`}>{d.approval}</span>
                    </td>
                    <td className={`px-2.5 py-2.5 border-b border-[#eee] text-center text-[11px] ${dimStyle}`}>
                      <span className={`inline-flex items-center px-[7px] py-[2px] rounded-full text-[10px] font-semibold ${dimBadge} ${WORK_CLASS[d.workStatus] || ""}`}>{d.workStatus}</span>
                    </td>
                    <td className={`px-2.5 py-2.5 border-b border-[#eee] text-center text-[11px] ${dimStyle}`}>
                      <span className={`inline-flex items-center px-[7px] py-[2px] rounded-full text-[10px] font-semibold ${dimBadge} ${cancelCls}`}>{d.cancelRefund}</span>
                    </td>
                    <td className={`px-2.5 py-2.5 border-b border-[#eee] text-center text-[11px] whitespace-nowrap ${dimStyle}`}>{d.id}</td>
                    <td className={`px-2.5 py-2.5 border-b border-[#eee] text-center text-[11px] whitespace-nowrap ${dimStyle}`}>{d.invoiceNo}</td>
                    <td className={`px-2.5 py-2.5 border-b border-[#eee] text-left text-[11px] whitespace-nowrap ${dimStyle}`}>
                      {d.products.map((p, i) => (
                        <div key={i}>{p.code} / {p.name} / {p.barcode}</div>
                      ))}
                    </td>
                    <td className={`px-2.5 py-2.5 border-b border-[#eee] text-center ${dimStyle}`} onClick={(e) => e.stopPropagation()}>
                      {emailOk ? (
                        <button onClick={() => sendEmail(d.id)} className="w-7 h-7 inline-flex items-center justify-center rounded-full hover:bg-black/[0.06]">
                          <Mail className="w-[18px] h-[18px] text-[#4CAF50]" />
                        </button>
                      ) : (
                        <span className="w-7 h-7 inline-flex items-center justify-center opacity-30">
                          <Mail className="w-[18px] h-[18px] text-[#888]" />
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-3 pt-2.5">
          <div className="flex items-center gap-1.5 text-[11px] text-[#888]">
            Rows per page
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); setSearchTrigger((p) => p + 1) }}
              className="h-7 border border-[#ddd] rounded text-[11px] px-1 outline-none"
            >
              <option value={30}>30</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={300}>300</option>
            </select>
          </div>
          <div className="flex items-center gap-[3px]">
            <span className="text-xs text-[#888] mx-3">
              {filtered.length > 0 ? startIdx + 1 : 0}-{Math.min(startIdx + pageSize, filtered.length)} of {filtered.length}
            </span>
            <button
              disabled={safePage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="min-w-7 h-7 border border-[#ddd] bg-white rounded text-[11px] text-[#555] cursor-pointer inline-flex items-center justify-center hover:bg-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &lsaquo;
            </button>
            <button
              disabled={safePage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="min-w-7 h-7 border border-[#ddd] bg-white rounded text-[11px] text-[#555] cursor-pointer inline-flex items-center justify-center hover:bg-[#f5f5f5] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              &rsaquo;
            </button>
          </div>
        </div>
      </div>

      {/* Outbound Modal */}
      <OutboundModal
        open={outboundOpen}
        onOpenChange={setOutboundOpen}
        selectedItems={selectedItems}
        onComplete={onOutboundComplete}
      />
    </div>
  )
}
