"use client"

import { useState } from "react"
import { Truck } from "lucide-react"
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
import type { RxOrder } from "@/lib/data"

interface OutboundModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedItems: RxOrder[]
  onComplete: (ids: string[]) => void
}

export function OutboundModal({ open, onOpenChange, selectedItems, onComplete }: OutboundModalProps) {
  const [carrier, setCarrier] = useState("FedEx")

  const handleConfirm = () => {
    const ids = selectedItems.map((item) => item.id)
    onComplete(ids)
    onOpenChange(false)
    toast.success(`Outbound registered via ${carrier}. ${selectedItems.length} orders sent to TMS.`)
  }

  return (
    <Dialog open={open && selectedItems.length > 0} onOpenChange={(v) => { if (v) setCarrier("FedEx"); onOpenChange(v) }}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-5 pt-4 pb-3">
          <DialogTitle className="text-[14px] font-bold">Outbound Registration</DialogTitle>
          <DialogDescription className="sr-only">Create outbound registration for selected orders</DialogDescription>
        </DialogHeader>

        <hr className="border-gray-200" />

        <div className="px-5 py-4">
          {/* Carrier Selection */}
          <div className="grid grid-cols-[100px_1fr] items-center gap-x-3 mb-4 bg-muted/30 rounded-md p-3.5 border border-muted">
            <label className="text-[12px] font-medium text-foreground">
              Carrier <span className="text-red-500">*</span>
            </label>
            <div>
              <CarrierSelect value={carrier} onChange={setCarrier} />
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[12px] font-medium text-foreground">Order List</span>
          </div>

          <div className="border rounded-md overflow-hidden max-h-[40vh] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-left font-semibold text-[10px] uppercase tracking-wide px-3 py-2">Order No.</TableHead>
                  <TableHead className="text-center font-semibold text-[10px] uppercase tracking-wide px-3 py-2">Order Type</TableHead>
                  <TableHead className="text-left font-semibold text-[10px] uppercase tracking-wide px-3 py-2">Store</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-left text-[11px] font-medium px-3 py-2">
                      {item.invoiceNo !== "-" ? item.invoiceNo : item.id.slice(-10)}
                    </TableCell>
                    <TableCell className="text-center text-[11px] px-3 py-2">
                      {item.orderType === "PREORDER" ? (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] px-1.5 py-0">
                          {item.orderType}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-left text-[11px] px-3 py-2">
                      US1001 / GM_LA_Downtown
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="bg-muted/50 rounded-md p-3.5 mt-3.5">
            <div className="flex items-start gap-2">
              <Truck className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Selected orders will be sent to TMS for outbound registration and the status will be updated to{" "}
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 mx-0.5 text-[10px] px-1.5 py-0">
                  Outbound Registered
                </Badge>
                .
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-5">
            <Button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
              className="gap-1.5 bg-[#ff6b35] hover:bg-[#e55e2b] text-white text-[11px] h-8 px-5"
            >
              <Truck className="h-3.5 w-3.5" />
              REGISTER OUTBOUND
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
