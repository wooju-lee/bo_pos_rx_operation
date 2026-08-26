"use client"

import { useState } from "react"
import { Package, Truck } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CarrierSelect } from "@/components/ui/carrier-select"
import type { WorkItem } from "./work-table"

interface OutboundModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: WorkItem[]
  onComplete: () => void
}

const EXCLUDED_STATUSES = ["Completed", "Finalized"]

export function OutboundModal({ open, onOpenChange, selectedItems, onComplete }: OutboundModalProps) {
  const [carrier, setCarrier] = useState("FedEx")
  const eligibleItems = selectedItems.filter((item) => !EXCLUDED_STATUSES.includes(item.status))

  const handleConfirm = () => {
    console.log("TMS Outbound Registration:", {
      carrier,
      items: eligibleItems.map((item) => ({
        orderId: item.id,
        orderNumber: item.orderNumber,
        storeCode: item.storeCode,
        storeName: item.storeName,
      })),
    })
    onComplete()
    onOpenChange(false)
    toast.success(`Outbound registration completed via ${carrier}. ${eligibleItems.length} orders have been sent to TMS.`)
  }

  return (
    <Dialog open={open && selectedItems.length > 0} onOpenChange={(v) => { if (v) setCarrier("FedEx"); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Outbound Registration / Request</DialogTitle>
          <DialogDescription className="sr-only">
            Create outbound registration for selected orders
          </DialogDescription>
        </DialogHeader>

        <hr className="border-gray-200" />

        <div className="pt-2">
          {/* Carrier Selection */}
          <div className="grid grid-cols-[120px_1fr] items-center gap-x-4 mb-5 bg-muted/30 rounded-lg p-4 border border-muted">
            <label className="text-sm font-medium text-foreground">
              Carrier <span className="text-red-500">*</span>
            </label>
            <div className="max-w-[280px]">
              <CarrierSelect value={carrier} onChange={setCarrier} />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-foreground">Order List</span>
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {eligibleItems.length}
            </Badge>
          </div>

          <div className="border rounded-lg overflow-hidden max-h-[45vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-left font-semibold text-xs uppercase tracking-wide">Order No.</TableHead>
                  <TableHead className="text-center font-semibold text-xs uppercase tracking-wide">Order Tag</TableHead>
                  <TableHead className="text-left font-semibold text-xs uppercase tracking-wide">Store</TableHead>
                  <TableHead className="text-center font-semibold text-xs uppercase tracking-wide">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eligibleItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-left text-sm font-medium">
                      {item.number}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.orderType === "Pre-order" ? (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {item.orderType}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-left text-sm">
                      {item.storeCode} / {item.storeName}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {item.status.toUpperCase().replace(/ /g, "_")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="text-sm text-muted-foreground">
                <p>
                  Selected orders will be sent to TMS for outbound registration and the status will be updated to <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mx-1 text-xs">Outbound Registered</Badge>.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              onClick={handleConfirm}
              disabled={eligibleItems.length === 0}
              className="gap-2 bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Truck className="h-4 w-4" />
              REGISTER OUTBOUND
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
