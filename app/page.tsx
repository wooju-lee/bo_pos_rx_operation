"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { OutboundModal } from "@/components/lens-work/outbound-modal"
import { LabelPrintModal } from "@/components/lens-work/label-print-modal"
import { AppHeader } from "@/components/app-header"
import { AppSidebar } from "@/components/app-sidebar"
import { FilterSection } from "@/components/lens-work/filter-section"
import { WorkTable, type WorkItem } from "@/components/lens-work/work-table"
import { ProcessingStats } from "@/components/lens-work/processing-stats"
import { InvoiceModal } from "@/components/lens-work/invoice-modal"
import { PickingListModal } from "@/components/lens-work/picking-list-modal"

// Helper to generate sample data with correct distribution to match stats
// Stats: (Basic) IIC Lab: 7, (Basic) Lab 1: 5, (Basic) Lab 2: 3, (Tint) IIC Lab: 9, (Tint) Lab 1: 4, (Tint) Lab 2: 2 = Total 30
const generateSampleData = (): WorkItem[] => {
  const items: WorkItem[] = []
  let id = 1
  
  const statuses: WorkItem["status"][] = ["Pending", "Inbound Inspection", "In Progress", "Re Do", "Outbound Inspection", "Completed", "Finalized"]
  const channels: WorkItem["channel"][] = ["Online", "Offline"]
  const stores = [
    { code: "US1001", name: "US_STORE_1" },
    { code: "US1002", name: "US_STORE_2" },
    { code: "US1003", name: "US_STORE_3" },
    { code: "US1004", name: "US_ONLINE" },
  ]
  const assignees = ["sam_01", "sam_02", "monster1437"]
  const workTypes = ["IN HOUSE", "OUTSOURCED"]
  
  const processingPeriods = [
    { period: "(Basic) IIC Lab", count: 7 },
    { period: "(Basic) Lab 1", count: 5 },
    { period: "(Basic) Lab 2", count: 3 },
    { period: "(Tint) IIC Lab", count: 9 },
    { period: "(Tint) Lab 1", count: 4 },
    { period: "(Tint) Lab 2", count: 2 },
  ]
  
  // 25 Normal, 5 Pre-order
  const preOrderIds = [3, 8, 14, 21, 27] // 5 Pre-order items spread across the list
  // IDs that have cancel/return status for sample data
  const cancelIds = [2, 7, 16, 22] // Cancel: only for non-Completed/Finalized
  const returnIds = [4, 9, 19, 24] // Refund: only for Completed/Finalized

  processingPeriods.forEach(({ period, count }) => {
    for (let i = 0; i < count; i++) {
      const status = statuses[id % statuses.length]
      const channel = channels[id % channels.length]
      const offlineStores = [stores[0], stores[1], stores[2]] // US_STORE_1~3
      const store = channel === "Online"
        ? stores[3] // US1004 / US_ONLINE
        : offlineStores[id % offlineStores.length]
      const isCompleted = status === "Completed" || status === "Finalized"
      const orderType = preOrderIds.includes(id) ? "Pre-order" : "Normal"

      // Cancel/Return status: Cancel only when NOT Completed/Finalized, Return only when Completed/Finalized
      let cancelReturnStatus: "Cancel" | "Refund" | undefined = undefined
      if (cancelIds.includes(id) && !isCompleted) {
        cancelReturnStatus = "Cancel"
      } else if (returnIds.includes(id) && isCompleted) {
        cancelReturnStatus = "Refund"
      }

      // Pending orders default to (Basic) IIC Lab
      const effectivePeriod = status === "Pending" ? "(Basic) IIC Lab" : period

      // Work ETA: approval date + 10 days (max days for processing period)
      const approvalDateStr = `2025-08-${String(10 + (id % 20)).padStart(2, "0")}`
      const etaDate = new Date(approvalDateStr)
      etaDate.setDate(etaDate.getDate() + 10)
      const workEta = `${etaDate.getFullYear()}-${String(etaDate.getMonth() + 1).padStart(2, "0")}-${String(etaDate.getDate()).padStart(2, "0")}`

      items.push({
        id: String(id),
        orderDate: `2025-08-${String(10 + (id % 20)).padStart(2, "0")} ${10 + (id % 12)}:00 (PST)`,
        approvalDate: `2025-08-${String(10 + (id % 20)).padStart(2, "0")} ${10 + (id % 12)}:00 (PST)`,
        orderNumber: `6060606060${String(60000 + id).padStart(5, "0")}`,
        orderType,
        number: String(1000 + id),
        channel,
        storeCode: store.code,
        storeName: store.name,
        status,
        workType: workTypes[id % workTypes.length],
        processingPeriod: effectivePeriod,
        assignee: assignees[id % assignees.length],
        leadTime: 5 + (id % 15),
        workEta,
        completionDate: isCompleted ? `2025-09-${String(1 + (id % 28)).padStart(2, "0")} 11:00 (PST)` : undefined,
        cancelReturnStatus,
      })
      id++
    }
  })
  
  return items
}

const sampleData: WorkItem[] = generateSampleData()

export default function LensWorkManagement() {
  const router = useRouter()
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false)
  const [selectedInvoiceItem, setSelectedInvoiceItem] = useState<WorkItem | null>(null)
  const [outboundModalOpen, setOutboundModalOpen] = useState(false)
  const [outboundSelectedItems, setOutboundSelectedItems] = useState<WorkItem[]>([])
  const [outboundRegisteredIds, setOutboundRegisteredIds] = useState<Set<string>>(new Set())
  const [pickingListModalOpen, setPickingListModalOpen] = useState(false)
  const [pickingListItems, setPickingListItems] = useState<WorkItem[]>([])
  const [labelRegisteredIds, setLabelRegisteredIds] = useState<Set<string>>(new Set())
  const [labelRegModalOpen, setLabelRegModalOpen] = useState(false)
  const [labelRegSelectedItems, setLabelRegSelectedItems] = useState<WorkItem[]>([])
  const [labelPrintModalOpen, setLabelPrintModalOpen] = useState(false)
  const [labelPrintItem, setLabelPrintItem] = useState<WorkItem | null>(null)
  const [labelCarrier, setLabelCarrier] = useState<string>("FedEx")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSearch = () => {
    console.log("[v0] Search triggered")
  }

  const handleExcelDownload = () => {
    // 엑셀 다운로드 - 리스트 기준 출력
  }

  const handleDetailClick = (item: WorkItem, tab: "customer" | "store") => {
    router.push(`/work/${item.id}?tab=${tab}`)
  }

  const handleInvoicePrint = (item: WorkItem) => {
    setSelectedInvoiceItem(item)
    setInvoiceModalOpen(true)
  }

  const handlePickingListPrint = (items: WorkItem | WorkItem[]) => {
    const itemArray = Array.isArray(items) ? items : [items]
    setPickingListItems(itemArray)
    setPickingListModalOpen(true)
  }

  const handleShippingTransmit = (item: WorkItem) => {
    // 송장 전송
  }

  const handleWorkLabelPrint = (selectedItems: WorkItem[]) => {
    // 작업 라벨 출력 - 체크박스 선택된 주문에 대한 라벨 출력
  }

  const handleCreateShipment = (selectedItems: WorkItem[]) => {
    setOutboundSelectedItems(selectedItems)
    setOutboundModalOpen(true)
  }

  const [workData, setWorkData] = useState<WorkItem[]>(sampleData)

  const handleBulkStatusChange = (selectedItems: WorkItem[], newStatus: string) => {
    const ids = new Set(selectedItems.map((item) => item.id))
    setWorkData((prev) =>
      prev.map((item) => ids.has(item.id) ? { ...item, status: newStatus as WorkItem["status"] } : item)
    )
    toast.success(`${selectedItems.length} order(s) status changed to "${newStatus}".`)

    // Auto label registration when bulk changing to Outbound Inspection
    if (newStatus === "Outbound Inspection") {
      setLabelRegisteredIds((prev) => {
        const next = new Set(prev)
        selectedItems.forEach((item) => next.add(item.id))
        return next
      })
      toast.success("Label registration has been sent to TMS automatically.")
    }
  }

  const handleLabelPrint = (selectedItems: WorkItem[]) => {
    if (selectedItems.length > 0) {
      setLabelPrintItem(selectedItems[0])
      setLabelPrintModalOpen(true)
    }
  }

  const handleLabelRegistration = (selectedItems: WorkItem[]) => {
    // Filter: only "Outbound Inspection" items that are not already registered
    const eligible = selectedItems.filter(
      (item) => item.status === "Outbound Inspection" && !labelRegisteredIds.has(item.id)
    )
    setLabelRegSelectedItems(eligible.length > 0 ? eligible : selectedItems)
    setLabelCarrier("FedEx")
    setLabelRegModalOpen(true)
  }

  const handleLabelRegConfirm = () => {
    const eligible = labelRegSelectedItems.filter(
      (item) => item.status === "Outbound Inspection" && !labelRegisteredIds.has(item.id)
    )
    if (eligible.length === 0) {
      toast.error("No eligible items. Only 'Outbound Inspection' status items can be registered.")
      setLabelRegModalOpen(false)
      return
    }
    if (!labelCarrier) {
      toast.error("Please select a carrier.")
      return
    }
    setLabelRegisteredIds((prev) => {
      const next = new Set(prev)
      eligible.forEach((item) => next.add(item.id))
      return next
    })
    toast.success(`Label registration sent to TMS for ${eligible.length} order(s) via ${labelCarrier}.`)
    setLabelRegModalOpen(false)
  }

  return (
    <div className="bg-[#f8f8f8] min-h-screen text-[#222] text-[13px]">
      {/* Header */}
      <AppHeader onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Sidebar */}
      <AppSidebar collapsed={sidebarCollapsed} />

      {/* Main Content */}
      <main
        className="min-h-[calc(100vh-64px)] px-6 transition-[margin-left] duration-[250ms] ease-in-out"
        style={{ marginLeft: sidebarCollapsed ? 0 : 300, marginTop: 64 }}
      >
        {/* Breadcrumb */}
        <div className="flex items-center pt-8 pl-3 text-sm">
          <span className="text-[rgba(115,115,115,1)]">Rx (LMS)</span>
          <span className="mx-2 text-[rgba(0,0,0,0.87)]">&rsaquo;</span>
          <span className="text-[rgba(217,119,6,1)]">Lens Work Management</span>
        </div>

        {/* Page Title */}
        <div className="flex items-center justify-between pt-[18px] pb-6 pl-3">
          <h1 className="text-[25px] font-bold text-[#222]">Lens Work Management</h1>
        </div>

          {/* Filter Section */}
          <FilterSection onSearch={handleSearch} />

          {/* Processing Stats - New Section */}
          <div className="mb-6">
            <ProcessingStats />
          </div>

          {/* Work Table */}
          <WorkTable
            data={workData}
            onDetailClick={handleDetailClick}
            onInvoicePrint={handleInvoicePrint}
            onPickingListPrint={handlePickingListPrint}
            onShippingTransmit={handleShippingTransmit}
            onExcelDownload={handleExcelDownload}
            onWorkLabelPrint={handleWorkLabelPrint}
            onCreateShipment={handleCreateShipment}
            onLabelRegistration={handleLabelRegistration}
            onLabelPrint={handleLabelPrint}
            onBulkStatusChange={handleBulkStatusChange}
            outboundRegisteredIds={outboundRegisteredIds}
            labelRegisteredIds={labelRegisteredIds}
          />

          {/* Outbound Modal */}
          <OutboundModal
            open={outboundModalOpen}
            onOpenChange={setOutboundModalOpen}
            selectedItems={outboundSelectedItems}
            onComplete={() => {
              setOutboundRegisteredIds((prev) => {
                const next = new Set(prev)
                outboundSelectedItems.forEach((item) => next.add(item.id))
                return next
              })
            }}
          />

          {/* Invoice Modal */}
          <InvoiceModal
            open={invoiceModalOpen}
            onOpenChange={setInvoiceModalOpen}
            item={selectedInvoiceItem}
          />


          {/* Picking List Modal */}
          <PickingListModal
            open={pickingListModalOpen}
            onOpenChange={setPickingListModalOpen}
            items={pickingListItems}
          />

          {/* Label Print Modal */}
          <LabelPrintModal
            open={labelPrintModalOpen}
            onOpenChange={setLabelPrintModalOpen}
            item={labelPrintItem ? {
              orderNumber: labelPrintItem.orderNumber,
              storeCode: labelPrintItem.storeCode,
              storeName: labelPrintItem.storeName,
              customer: {
                name: "John Doe",
                phone: "213-555-0100",
                address1: "1234 Main St",
                address2: "",
                city: "Los Angeles",
                state: "CA",
                zip: "90001",
              },
            } : null}
          />

          {/* Label Registration Confirm Dialog */}
          <Dialog open={labelRegModalOpen} onOpenChange={setLabelRegModalOpen}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4" />
                  Label Registration
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-1">
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-md p-3 space-y-1">
                  {labelRegSelectedItems.map((item) => {
                    const isEligible = item.status === "Outbound Inspection" && !labelRegisteredIds.has(item.id)
                    return (
                      <div key={item.id} className="flex items-center justify-between">
                        <span className={`font-medium ${isEligible ? "text-foreground" : "text-muted-foreground line-through"}`}>
                          {item.orderNumber}
                        </span>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${isEligible ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
                          {item.status}
                        </Badge>
                      </div>
                    )
                  })}
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">
                    Carrier <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={labelCarrier}
                    onChange={(e) => setLabelCarrier(e.target.value)}
                    className="w-full h-10 px-3 pr-8 text-xs border border-input rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_10px_center]"
                  >
                    <option value="">Select carrier</option>
                    <option value="FedEx">FedEx</option>
                    <option value="UPS">UPS</option>
                  </select>
                </div>
                <p className="text-xs text-muted-foreground">
                  Only <span className="font-semibold text-teal-600">Outbound Inspection</span> orders will be sent to TMS for label registration.
                  {labelRegSelectedItems.filter((item) => item.status !== "Outbound Inspection").length > 0 && (
                    <span className="block mt-1 text-orange-500">
                      {labelRegSelectedItems.filter((item) => item.status !== "Outbound Inspection").length} item(s) will be skipped (status not eligible).
                    </span>
                  )}
                </p>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleLabelRegConfirm}
                    disabled={!labelCarrier}
                    className="h-8 text-xs px-4 gap-1.5"
                  >
                    <Truck className="h-3.5 w-3.5" />
                    Confirm
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
      </main>
    </div>
  )
}
