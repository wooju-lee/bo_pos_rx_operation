"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { ChevronLeft, Search, Upload, X, Check, Trash2, AlertTriangle, CheckCircle, Info, Pencil } from "lucide-react"
import { toast } from "sonner"
import type { RxOrder } from "@/lib/data"
import {
  APPROVAL_CLASS, MOCK_MEMBERS, COUNTRIES, MOCK_ADDRESSES, MASTER_FRAMES,
  OCR_MOCK_RESPONSE, COMMENT_TYPE_COLORS,
} from "@/lib/data"

// ===== Rx Option Generators =====
function genSphOpts() {
  const opts = [""]
  for (let v = 8; v >= -12; v -= 0.25) opts.push(v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2))
  return opts
}
function genCylOpts() {
  const opts = [""]
  for (let v = 6; v >= -6; v -= 0.25) opts.push(v > 0 ? `+${v.toFixed(2)}` : v.toFixed(2))
  return opts
}
function genAxisOpts() {
  const opts = [""]
  for (let v = 0; v <= 180; v++) opts.push(String(v))
  return opts
}
function genPdOpts() {
  const opts = [""]
  for (let v = 1; v <= 100; v += 0.5) opts.push(v.toFixed(1))
  return opts
}
function genOcOpts() {
  const opts = [""]
  for (let v = 0; v <= 40; v += 0.5) opts.push(v.toFixed(1))
  return opts
}

const SPH_OPTS = genSphOpts()
const CYL_OPTS = genCylOpts()
const AXIS_OPTS = genAxisOpts()
const PD_OPTS = genPdOpts()
const OC_OPTS = genOcOpts()

interface Comment {
  id: string
  type: string
  author: string
  date: string
  text: string
}

interface DetailViewProps {
  order: RxOrder
  onBack: () => void
}

export function DetailView({ order, onBack }: DetailViewProps) {
  const [approval, setApproval] = useState(order.approval)

  // Customer
  const [country, setCountry] = useState("")
  const [countryOpen, setCountryOpen] = useState(false)
  const [customerSearch, setCustomerSearch] = useState("")
  const [memberDropOpen, setMemberDropOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<typeof MOCK_MEMBERS[0] | null>(null)
  const [isNonMember, setIsNonMember] = useState(false)
  const [selectedRxId, setSelectedRxId] = useState("")

  // Prescription
  const [rxValues, setRxValues] = useState({
    odSph: "", odCyl: "", odAxis: "", odPd: "", odOc: "",
    osSph: "", osCyl: "", osAxis: "", osPd: "", osOc: "",
  })
  const [pdMode, setPdMode] = useState<"single" | "dual">("dual")
  const [patientName, setPatientName] = useState("")
  const [patientDob, setPatientDob] = useState("")
  const [prescriber, setPrescriber] = useState("")
  const [license, setLicense] = useState("")
  const [rxAddress, setRxAddress] = useState("")
  const [rxPhone, setRxPhone] = useState("")
  const [rxFax, setRxFax] = useState("")
  const [issueDate, setIssueDate] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [signature, setSignature] = useState(false)
  const [files, setFiles] = useState<string[]>([])
  const [ocrScanning, setOcrScanning] = useState(false)
  const [ocrApplied, setOcrApplied] = useState(false)
  const [ocrFields, setOcrFields] = useState<Set<string>>(new Set())
  const [ocrLowConf, setOcrLowConf] = useState<Set<string>>(new Set())

  // Delivery
  const [dlvType, setDlvType] = useState<"address" | "store">("address")
  const [dlvMode, setDlvMode] = useState<"search" | "manual">("search")
  const [dlvSearchInput, setDlvSearchInput] = useState("")
  const [dlvSearchOpen, setDlvSearchOpen] = useState(false)
  const [dlvCityS, setDlvCityS] = useState("")
  const [dlvStateS, setDlvStateS] = useState("")
  const [dlvZipS, setDlvZipS] = useState("")
  const [dlvAddr2S, setDlvAddr2S] = useState("")
  const [dlvAddr1, setDlvAddr1] = useState("")
  const [dlvAddr2, setDlvAddr2] = useState("")
  const [dlvCity, setDlvCity] = useState("")
  const [dlvState, setDlvState] = useState("")
  const [dlvZip, setDlvZip] = useState("")
  const [dlvVerified, setDlvVerified] = useState(false)
  const [dlvSuggestion, setDlvSuggestion] = useState<typeof MOCK_ADDRESSES[0] | null>(null)

  // Policy
  const [chkRxTerms, setChkRxTerms] = useState(false)
  const [chkHipaa, setChkHipaa] = useState(false)
  const [chkMarketing, setChkMarketing] = useState(false)
  const [sigDrawn, setSigDrawn] = useState(false)
  const sigCanvas = useRef<HTMLCanvasElement>(null)
  const sigDrawing = useRef(false)

  // COF
  const [cofActive, setCofActive] = useState(false)

  // Mapped product
  const [mappedInput, setMappedInput] = useState("")
  const [mappedOpen, setMappedOpen] = useState(false)

  // Comment
  const [commentType, setCommentType] = useState("General")
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState<Comment[]>([
    { id: "c1", type: "Prescription", author: "monster818", date: "2026-07-30 15:08", text: "CYL value confirmed with prescriber. Proceeding with -0.75." },
    { id: "c2", type: "General", author: "monster1437", date: "2026-07-30 14:22", text: "Please check the frame alignment before processing." },
  ])
  const [editingComment, setEditingComment] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const isEditable = approval === "Unready"
  const isReadOnly = !isEditable

  // Init mapped product input with frame product
  useEffect(() => {
    const frame = order.products.find((p) => p.code.startsWith("11"))
    if (frame) setMappedInput(`${frame.code} / ${frame.name}`)
  }, [order])

  // Signature pad
  useEffect(() => {
    const canvas = sigCanvas.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.strokeStyle = "#333"

    const getPos = (e: MouseEvent | TouchEvent) => {
      const r = canvas.getBoundingClientRect()
      const t = "touches" in e ? e.touches[0] : e
      return { x: (t.clientX - r.left) * (canvas.width / r.width), y: (t.clientY - r.top) * (canvas.height / r.height) }
    }
    const start = (e: MouseEvent | TouchEvent) => {
      if (isReadOnly) return
      e.preventDefault()
      sigDrawing.current = true
      const p = getPos(e)
      ctx.beginPath()
      ctx.moveTo(p.x, p.y)
    }
    const move = (e: MouseEvent | TouchEvent) => {
      if (!sigDrawing.current) return
      e.preventDefault()
      const p = getPos(e)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
    }
    const end = () => {
      if (sigDrawing.current) { sigDrawing.current = false; setSigDrawn(true) }
    }
    canvas.addEventListener("mousedown", start)
    canvas.addEventListener("mousemove", move)
    canvas.addEventListener("mouseup", end)
    canvas.addEventListener("mouseleave", end)
    canvas.addEventListener("touchstart", start, { passive: false })
    canvas.addEventListener("touchmove", move, { passive: false })
    canvas.addEventListener("touchend", end)
    return () => {
      canvas.removeEventListener("mousedown", start)
      canvas.removeEventListener("mousemove", move)
      canvas.removeEventListener("mouseup", end)
      canvas.removeEventListener("mouseleave", end)
      canvas.removeEventListener("touchstart", start)
      canvas.removeEventListener("touchmove", move)
      canvas.removeEventListener("touchend", end)
    }
  }, [isReadOnly])

  const clearSignature = () => {
    const ctx = sigCanvas.current?.getContext("2d")
    if (ctx && sigCanvas.current) {
      ctx.clearRect(0, 0, sigCanvas.current.width, sigCanvas.current.height)
      setSigDrawn(false)
    }
  }

  // Summary checks
  const checkCustomer = () => {
    if (isNonMember) return { filled: 2, total: 2 }
    let filled = 0
    if (country) filled++
    if (selectedMember || customerSearch.trim()) filled++
    return { filled, total: 2 }
  }
  const checkPrescription = () => {
    const base = [rxValues.odSph, rxValues.odCyl, rxValues.odAxis, rxValues.osSph, rxValues.osCyl, rxValues.osAxis]
    const pdVals = pdMode === "single" ? [rxValues.odPd] : [rxValues.odPd, rxValues.osPd]
    const all = [...base, ...pdVals]
    return { filled: all.filter(Boolean).length, total: 8 }
  }
  const checkAttachment = () => {
    let filled = 0
    if (expiryDate) filled++
    if (files.length > 0) filled++
    return { filled, total: 2 }
  }
  const checkDelivery = () => {
    if (dlvType === "store") return { filled: 1, total: 1 }
    if (dlvMode === "search") {
      return { filled: dlvSearchInput && dlvCityS && dlvVerified ? 1 : 0, total: 1 }
    }
    return { filled: dlvAddr1 && dlvCity && dlvState && dlvZip && dlvVerified ? 1 : 0, total: 1 }
  }
  const checkPolicy = () => {
    let filled = 0
    if (chkRxTerms) filled++
    if (chkHipaa) filled++
    if (sigDrawn) filled++
    return { filled, total: 3 }
  }

  const sections = [
    { label: "Customer Info", check: checkCustomer, anchor: "sec-customer" },
    { label: "Order Info", check: () => ({ filled: 1, total: 1 }), anchor: "sec-order" },
    { label: "Prescription", check: checkPrescription, anchor: "sec-prescription" },
    { label: "Documents", check: checkAttachment, anchor: "sec-prescription" },
    { label: "Delivery", check: checkDelivery, anchor: "sec-delivery" },
    { label: "Policy Agreements", check: checkPolicy, anchor: "sec-policy" },
    { label: "Comment", check: () => ({ filled: 1, total: 1 }), anchor: "sec-comment" },
  ]

  const totalFilled = sections.reduce((a, s) => a + s.check().filled, 0)
  const totalRequired = sections.reduce((a, s) => a + s.check().total, 0)
  const allComplete = totalFilled >= totalRequired

  // OCR
  const handleOcrFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    const allowed = ["image/jpeg", "image/png", "application/pdf"]
    if (!allowed.includes(file.type)) { toast.error("Unsupported file type. JPG, PNG, or PDF only."); return }
    if (file.size > 10 * 1024 * 1024) { toast.error("File size exceeds 10MB limit."); return }
    setOcrScanning(true)
    setTimeout(() => {
      setOcrScanning(false)
      applyOcr(file.name)
    }, 2000)
  }

  const applyOcr = (fileName: string) => {
    const res = OCR_MOCK_RESPONSE
    const filled = new Set<string>()
    const lowConf = new Set<string>()

    setPatientName(res.patient.name.value)
    setPatientDob(res.patient.dob.value)
    setPrescriber(res.prescriber.name.value)
    setLicense(res.prescriber.license.value)
    setRxAddress(res.prescriber.address.value)
    if (res.prescriber.address.low_confidence) lowConf.add("rxAddress")
    setRxPhone(res.prescriber.phone.value)
    setRxFax(res.prescriber.fax.value)
    if (res.prescriber.fax.low_confidence) lowConf.add("rxFax")
    setIssueDate(res.dates.issue.value)
    setExpiryDate(res.dates.expiry.value)
    setSignature(res.prescriber.signature.value as boolean)

    const odSph = res.od.sph.value > 0 ? `+${res.od.sph.value.toFixed(2)}` : res.od.sph.value.toFixed(2)
    const odCyl = res.od.cyl.value > 0 ? `+${res.od.cyl.value.toFixed(2)}` : res.od.cyl.value.toFixed(2)
    const odAxis = String(Math.round(res.od.axis.value))
    const osSph = res.os.sph.value > 0 ? `+${res.os.sph.value.toFixed(2)}` : res.os.sph.value.toFixed(2)
    const osCyl = res.os.cyl.value > 0 ? `+${res.os.cyl.value.toFixed(2)}` : res.os.cyl.value.toFixed(2)
    const osAxis = String(Math.round(res.os.axis.value))
    const pdVal = res.pd.binocular.value
    const odPd = (pdVal / 2).toFixed(1)
    const osPd = (pdVal / 2).toFixed(1)

    if (res.os.cyl.low_confidence) lowConf.add("osCyl")
    if (res.os.axis.low_confidence) lowConf.add("osAxis")

    setRxValues({ odSph, odCyl, odAxis, odPd, odOc: "", osSph, osCyl, osAxis, osPd, osOc: "" })
    filled.add("all")
    setOcrFields(filled)
    setOcrLowConf(lowConf)
    setOcrApplied(true)
    setFiles((prev) => [...prev, fileName])
    toast.success("OCR auto-fill complete")
  }

  // Delivery address search
  const filteredAddresses = MOCK_ADDRESSES.filter((a) =>
    a.addr.toLowerCase().includes(dlvSearchInput.toLowerCase())
  )

  const selectAddress = (a: typeof MOCK_ADDRESSES[0]) => {
    setDlvSearchInput(a.addr)
    setDlvCityS(a.city)
    setDlvStateS(a.state)
    setDlvZipS(a.zip)
    setDlvSearchOpen(false)
    setDlvVerified(true)
  }

  const revalidateAddress = () => {
    const matched = MOCK_ADDRESSES.find((m) => dlvAddr1.toLowerCase().startsWith(m.addr.split(" ")[0].toLowerCase()))
    setDlvVerified(true)
    if (matched) setDlvSuggestion(matched)
    else setDlvSuggestion(null)
  }

  const applyDlvSuggestion = () => {
    if (!dlvSuggestion) return
    setDlvAddr1(dlvSuggestion.addr)
    setDlvCity(dlvSuggestion.city)
    setDlvState(dlvSuggestion.state)
    setDlvZip(dlvSuggestion.zip)
    setDlvSuggestion(null)
    toast.success("Suggested address applied.")
  }

  // Member search
  const memberResults = MOCK_MEMBERS.filter((m) => {
    const q = customerSearch.toLowerCase()
    return m.email.toLowerCase().includes(q) || m.phone.replace(/-/g, "").includes(q.replace(/-/g, "")) || m.name.toLowerCase().includes(q)
  })

  const selectMemberHandler = (m: typeof MOCK_MEMBERS[0]) => {
    setSelectedMember(m)
    setMemberDropOpen(false)
    setCustomerSearch("")
  }

  const deselectMember = () => {
    setSelectedMember(null)
    setSelectedRxId("")
  }

  const selectMemberRx = (rxId: string, rxPrescriber: string, rxExpiry: string) => {
    setSelectedRxId(rxId)
    setPrescriber(rxPrescriber)
    setExpiryDate(rxExpiry)
    toast.success(`Prescription ${rxId} loaded`)
  }

  // Country filter
  const filteredCountries = country
    ? COUNTRIES.filter((c) => c.toLowerCase().includes(country.toLowerCase()))
    : COUNTRIES

  // Mapped product search
  const frameProduct = order.products.find((p) => p.code.startsWith("11"))
  const orderFrames = order.products.filter((p) => p.code.startsWith("11"))
  const mappedQ = mappedInput.toLowerCase()
  const filteredMapped = [
    ...(orderFrames.filter((f) => `${f.code} ${f.name}`.toLowerCase().includes(mappedQ)).length > 0
      ? [{ group: "Order Frame", items: orderFrames.filter((f) => `${f.code} ${f.name}`.toLowerCase().includes(mappedQ)) }]
      : []),
    ...(MASTER_FRAMES.filter((f) => `${f.code} ${f.name}`.toLowerCase().includes(mappedQ)).length > 0
      ? [{ group: "Master Frame", items: MASTER_FRAMES.filter((f) => `${f.code} ${f.name}`.toLowerCase().includes(mappedQ)) }]
      : []),
  ]

  // Comment
  const addComment = () => {
    if (!commentText.trim()) { toast.error("Please enter a comment."); return }
    const now = new Date()
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
    setComments((prev) => [
      { id: `cmt-${Date.now()}`, type: commentType, author: "monster1437", date: ts, text: commentText.trim() },
      ...prev,
    ])
    setCommentText("")
    setCommentType("General")
  }

  const deleteComment = (id: string) => setComments((prev) => prev.filter((c) => c.id !== id))

  const saveEditComment = (id: string) => {
    if (!editText.trim()) { toast.error("Comment cannot be empty."); return }
    setComments((prev) => prev.map((c) => c.id === id ? { ...c, text: editText.trim() } : c))
    setEditingComment(null)
  }

  // Actions
  const onSave = () => {
    toast.success("Saved successfully.")
    setApproval("Requested")
  }
  const onConfirm = () => { toast.success("Confirmed."); setApproval("Confirm") }
  const onReject = () => { toast.success("Rejected."); setApproval("Reject") }

  const frameP = order.products.find((p) => p.code.startsWith("11"))
  const lensP = order.products.find((p) => p.code.startsWith("14"))
  const pkgP = order.products.find((p) => p.code.startsWith("15"))

  const rxSelectClass = (key: string) => {
    if (ocrLowConf.has(key)) return "border-[#4CAF50] bg-[#f1f8e9]"
    if (ocrApplied && ocrFields.size > 0) return "border-[#4CAF50] bg-[#f1f8e9]"
    return ""
  }

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="flex items-center gap-2.5 py-2 pb-6">
        <button onClick={onBack} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-black/[0.06]">
          <ChevronLeft className="w-5 h-5 text-[#555]" />
        </button>
        <span className="text-xl font-bold text-[#222]">{order.id}</span>
        <span className="text-[13px] text-[#888]">({order.id})</span>
        <span className={`inline-flex items-center px-[7px] py-[2px] rounded-full text-[9px] font-semibold ${APPROVAL_CLASS[approval] || "bg-[#FFF8E1] text-[#F57F17]"}`}>
          {approval}
        </span>
      </div>

      {/* Layout: Form + Summary */}
      <div className="flex gap-4 items-start">
        {/* Left: Form */}
        <div className="flex-1 min-w-0">
          {/* 1. Customer Info */}
          <div id="sec-customer" className="bg-white border border-[#e0e0e0] rounded-lg p-4 mb-5">
            <div className="text-xs font-medium text-[#333] mb-3 flex items-center gap-1.5">
              <span className="text-[#ff6b35]">&#9679;</span> Customer Membership Info
            </div>
            <div className="flex gap-4 items-end mb-4">
              <div className="w-1/2 relative">
                <label className="text-[10px] font-medium text-[#777] mb-1 block">Country <span className="text-[#ff6b35]">*</span></label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => { setCountry(e.target.value); setCountryOpen(true) }}
                  onFocus={() => setCountryOpen(true)}
                  onBlur={() => setTimeout(() => setCountryOpen(false), 150)}
                  placeholder="Search country"
                  disabled={isNonMember || isReadOnly}
                  className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:bg-[#f5f5f5] disabled:text-[#999]"
                />
                {countryOpen && filteredCountries.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-[#ddd] rounded-md shadow-lg max-h-[160px] overflow-y-auto z-[100] mt-0.5">
                    {filteredCountries.map((c) => (
                      <div key={c} onMouseDown={() => { setCountry(c); setCountryOpen(false) }} className="px-3 py-[7px] text-[11px] text-[#333] cursor-pointer hover:bg-[#f5f5f5]">
                        {c}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="text-[10px] font-medium text-[#777] mb-1.5">Email / Phone / Membership QR <span className="text-[#ff6b35]">*</span></div>
            <div className="flex gap-2.5 items-start">
              <div className="w-1/2">
                {!selectedMember ? (
                  <div className="relative">
                    <input
                      type="text"
                      value={customerSearch}
                      onChange={(e) => { setCustomerSearch(e.target.value); setMemberDropOpen(e.target.value.length >= 2) }}
                      onFocus={() => customerSearch.length >= 2 && setMemberDropOpen(true)}
                      onBlur={() => setTimeout(() => setMemberDropOpen(false), 150)}
                      placeholder="Search by Email OR Phone"
                      disabled={isNonMember || isReadOnly}
                      className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] placeholder:text-[10px] placeholder:text-[#bbb] disabled:bg-[#f5f5f5]"
                    />
                    {memberDropOpen && (
                      <div className="absolute top-[28px] left-0 right-0 bg-white border border-[#ddd] rounded-md shadow-lg max-h-[180px] overflow-y-auto z-[100]">
                        {memberResults.length === 0 ? (
                          <div className="px-3 py-2.5 text-[10px] text-[#999]">No matching membership found</div>
                        ) : (
                          memberResults.map((m) => (
                            <div key={m.id} onMouseDown={() => selectMemberHandler(m)} className="px-3 py-2 cursor-pointer border-b border-[#f0f0f0] hover:bg-[#f5f5f5]">
                              <div className="text-[10px] text-[#333] font-medium">{m.email} / {m.phone}</div>
                              <div className="text-[9px] text-[#999] mt-0.5">{m.name} | {m.provider}</div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="border border-[#4CAF50] rounded-md px-3 py-2 bg-[#f9fdf9] flex items-center justify-between gap-2">
                      <div>
                        <div className="text-[10px] font-medium text-[#333]">{selectedMember.email} / {selectedMember.phone}</div>
                        <div className="text-[9px] text-[#888] mt-0.5">{selectedMember.provider} | {selectedMember.id}</div>
                      </div>
                      {!isReadOnly && <X className="w-3.5 h-3.5 text-[#999] cursor-pointer shrink-0" onClick={deselectMember} />}
                    </div>
                    {/* Prescription list */}
                    {selectedMember.prescriptions.length > 0 ? (
                      <div className="mt-2.5">
                        <div className="text-[9px] font-medium text-[#777] mb-1.5">Registered Prescriptions</div>
                        <div className="flex flex-col gap-1.5">
                          {selectedMember.prescriptions.filter((rx) => rx.status === "Active").map((rx) => (
                            <div
                              key={rx.id}
                              onClick={() => !isReadOnly && selectMemberRx(rx.id, rx.prescriber, rx.expiry)}
                              className={`flex items-center gap-2 px-2.5 py-1.5 border rounded-md cursor-pointer text-[10px] text-[#555] transition-all ${
                                selectedRxId === rx.id ? "border-[#ff6b35] bg-[#FFF3E0]" : "border-[#eee] hover:border-[#ff6b35] hover:bg-[#fff8f5]"
                              }`}
                            >
                              {rx.id} | {rx.date}
                            </div>
                          ))}
                        </div>
                        {selectedRxId && (
                          <div className="mt-1.5 px-2.5 py-2 bg-[#f1f8e9] border border-[#4CAF50] rounded-md text-[10px] text-[#2E7D32] flex items-center gap-1.5">
                            <Check className="w-3 h-3" /> <strong>{selectedRxId}</strong> selected
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 text-[9px] text-[#bbb] text-center py-1.5">No registered prescriptions</div>
                    )}
                  </div>
                )}
                <div className="mt-1.5 flex items-center justify-end gap-2">
                  <span
                    className="text-[10px] text-[#888] cursor-pointer border-b border-dashed border-[#bbb] relative group"
                    onClick={() => !isReadOnly && setIsNonMember(!isNonMember)}
                  >
                    Non-Member
                    <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 bg-[#333] text-white text-[9px] px-2.5 py-1.5 rounded-md whitespace-nowrap z-[100] mb-2 shadow-md">
                      If no membership, enable Non-Member mode to skip customer search
                    </span>
                  </span>
                  <div
                    onClick={() => !isReadOnly && setIsNonMember(!isNonMember)}
                    className={`w-9 h-5 rounded-full cursor-pointer relative transition-colors ${isNonMember ? "bg-[#ff6b35]" : "bg-[#ddd]"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 shadow transition-all ${isNonMember ? "left-[18px]" : "left-0.5"}`} />
                  </div>
                </div>
              </div>
              {!isReadOnly && (
                <button
                  onClick={() => setMemberDropOpen(true)}
                  disabled={isNonMember}
                  className="h-[26px] px-3.5 text-[10px] font-medium border border-[#ddd] rounded-md bg-white text-[#555] flex items-center gap-1 shrink-0 hover:bg-[#f5f5f5] disabled:opacity-50"
                >
                  <Search className="w-3 h-3" /> Search
                </button>
              )}
            </div>
          </div>

          {/* 2. Order Info */}
          <div id="sec-order" className="bg-white border border-[#e0e0e0] rounded-lg p-4 mb-5">
            <div className="text-xs font-medium text-[#333] mb-3 flex items-center gap-1.5">
              <span className="text-[#ff6b35]">&#9679;</span> Order Info
            </div>
            <div className="flex gap-6 mb-3.5 text-[11px] text-[#888] mt-2">
              <div className="flex items-center gap-1.5">
                <span className="font-medium text-[#555]">Order Type</span>
                <span className={`text-[9px] px-2 py-[2px] rounded font-semibold ${order.orderType === "PREORDER" ? "bg-[#E3F2FD] text-[#1565C0]" : "bg-[#f0f0f0] text-[#555]"}`}>
                  {order.orderType || "NORMAL"}
                </span>
              </div>
              <div><span className="font-medium text-[#555]">Order Date</span>&nbsp;&nbsp;{order.orderDate}</div>
              <div><span className="font-medium text-[#555]">Store</span>&nbsp;&nbsp;US1001 / GM_LosAngeles_FS_Downtown</div>
            </div>
            <div className="overflow-visible">
              <table className="w-full border-collapse border border-[#e0e0e0] rounded-lg overflow-visible">
                <thead>
                  <tr>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-r border-[#e8e8e8] border-b border-[#e0e0e0]">Type</th>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-r border-[#e8e8e8] border-b border-[#e0e0e0]">
                      Product Info<br /><span className="font-normal text-[9px]">Code / Name / Barcode</span>
                    </th>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-r border-[#e8e8e8] border-b border-[#e0e0e0]">Mapped Product</th>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-r border-[#e8e8e8] border-b border-[#e0e0e0]">Qty</th>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-r border-[#e8e8e8] border-b border-[#e0e0e0]">Total Price</th>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-b border-[#e0e0e0] relative group cursor-help">
                      C.O.F
                      <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 bg-[#333] text-white text-[9px] px-2.5 py-1.5 rounded-md whitespace-nowrap z-[100] mb-2 shadow-md">
                        Customer&apos;s Own Frame
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {frameP && (
                    <tr>
                      <td className="px-2 py-1.5 border-b border-[#eee] border-r text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#555] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-[#E65100]" />FRAME</span>
                      </td>
                      <td className="px-2 py-1.5 border-b border-[#eee] border-r text-left text-[11px] text-[#333]">{frameP.code} / {frameP.name} / {frameP.barcode}</td>
                      <td className="px-2 py-1.5 border-b border-[#eee] border-r text-center text-[11px] text-[#999]">-</td>
                      <td className="px-2 py-1.5 border-b border-[#eee] border-r text-center text-[11px]">1</td>
                      <td className="px-2 py-1.5 border-b border-[#eee] border-r text-center text-[11px] font-semibold">{frameP.price}</td>
                      <td className="px-2 py-1.5 border-b border-[#eee] text-center text-[11px] text-[#999]">-</td>
                    </tr>
                  )}
                  {lensP && (
                    <tr>
                      <td className="px-2 py-1.5 border-b border-[#eee] border-r text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#555] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-[#1565C0]" />LENS</span>
                      </td>
                      <td className="px-2 py-1.5 border-b border-[#eee] border-r text-left text-[11px] text-[#333]">{lensP.code} / {lensP.name} / {lensP.barcode}</td>
                      <td className="px-2 py-1.5 border-b border-[#eee] border-r text-center relative">
                        <div className="relative min-w-[300px]">
                          <input
                            type="text"
                            value={mappedInput}
                            onChange={(e) => { setMappedInput(e.target.value); setMappedOpen(true) }}
                            onFocus={() => setMappedOpen(true)}
                            onBlur={() => setTimeout(() => setMappedOpen(false), 150)}
                            disabled={isReadOnly}
                            placeholder="Product Code / Name / Barcode"
                            className="w-full h-[26px] border border-[#ddd] rounded px-2 pr-7 text-[10px] outline-none focus:border-[#ff6b35] disabled:opacity-70"
                          />
                          <Search className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#999] pointer-events-none" />
                          {mappedOpen && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-[#ddd] rounded-md shadow-lg max-h-[180px] overflow-y-auto z-[100] mt-0.5">
                              {filteredMapped.length === 0 ? (
                                <div className="px-3 py-2.5 text-[10px] text-[#999]">No results</div>
                              ) : (
                                filteredMapped.map((group) => (
                                  <div key={group.group}>
                                    <div className="px-2.5 py-1 text-[9px] font-semibold text-[#999] bg-[#fafafa] border-b border-[#f0f0f0]">{group.group}</div>
                                    {group.items.map((f) => (
                                      <div
                                        key={f.code}
                                        onMouseDown={() => { setMappedInput(`${f.code} / ${f.name}`); setMappedOpen(false) }}
                                        className="px-2.5 py-[7px] text-[10px] text-[#333] cursor-pointer hover:bg-[#f5f5f5]"
                                      >
                                        {f.code} / {f.name}
                                      </div>
                                    ))}
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-2 py-1.5 border-b border-[#eee] border-r text-center text-[11px]">1</td>
                      <td className="px-2 py-1.5 border-b border-[#eee] border-r text-center text-[11px] font-semibold">{lensP.price}</td>
                      <td className="px-2 py-1.5 border-b border-[#eee] text-center">
                        <span
                          onClick={() => !isReadOnly && setCofActive(!cofActive)}
                          className={`inline-block w-6 h-5 leading-5 text-center text-[9px] font-semibold rounded-full cursor-pointer transition-all select-none ${
                            cofActive ? "bg-[#ff6b35] text-white" : "bg-[#eee] text-[#999]"
                          }`}
                        >
                          {cofActive ? "Y" : "N"}
                        </span>
                      </td>
                    </tr>
                  )}
                  {pkgP && (
                    <tr>
                      <td className="px-2 py-1.5 border-r text-center">
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#555] font-medium"><span className="w-1.5 h-1.5 rounded-full bg-[#7B1FA2]" />PACKAGE</span>
                      </td>
                      <td className="px-2 py-1.5 border-r text-left text-[11px] text-[#333]">{pkgP.code} / {pkgP.name} / {pkgP.barcode}</td>
                      <td className="px-2 py-1.5 border-r text-center text-[11px] text-[#999]">-</td>
                      <td className="px-2 py-1.5 border-r text-center text-[11px]">1</td>
                      <td className="px-2 py-1.5 border-r text-center text-[11px] font-semibold">{pkgP.price}</td>
                      <td className="px-2 py-1.5 text-center text-[11px] text-[#999]">-</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. Prescription */}
          <div id="sec-prescription" className="bg-white border border-[#e0e0e0] rounded-lg p-4 mb-5">
            <div className="text-xs font-medium text-[#333] mb-3 flex items-center gap-1.5">
              <span className="text-[#ff6b35]">&#9679;</span> Prescription
            </div>

            {/* Step 1: OCR Upload */}
            <div className="mb-4 pb-4 border-b border-[#eee]">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#333] text-white text-[8px] font-semibold">1</span>
                <span className="text-[10px] font-medium text-[#555]">Scan Prescription</span>
              </div>
              {!ocrScanning ? (
                <label className={`flex flex-col items-center justify-center gap-1.5 py-3.5 px-4 border border-dashed border-[#ff6b35] rounded-md cursor-pointer bg-[#fff8f5] hover:bg-[#fff0e8] transition-all ${isReadOnly ? "pointer-events-none opacity-60" : ""}`}>
                  <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={handleOcrFile} disabled={isReadOnly} />
                  <Upload className="w-[22px] h-[22px] text-[#ff6b35]" />
                  <span className="text-[11px] font-semibold text-[#ff6b35]">Upload Prescription</span>
                  <span className="text-[9px] text-[#999]">JPG, PNG, PDF (max 10MB, 1 page) &middot; OCR auto-filling supported</span>
                </label>
              ) : (
                <div className="flex items-center gap-3 px-[18px] py-3.5 border border-[#eee] rounded-[10px] bg-white">
                  <div className="w-5 h-5 border-[2.5px] border-[#eee] border-t-[#ff6b35] rounded-full animate-spin shrink-0" />
                  <div>
                    <div className="text-[11px] font-semibold text-[#333]">Analyzing prescription...</div>
                    <div className="text-[9px] text-[#999] mt-0.5">Extracting values via AWS Textract</div>
                  </div>
                </div>
              )}
              {/* File list */}
              {files.length > 0 && (
                <div className="mt-2 flex flex-col gap-1.5">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-1.5 w-full px-2.5 py-[5px] border border-[#eee] rounded-md text-[11px] text-[#ff6b35] bg-[#fafafa]">
                      <span className="flex-1">{f}</span>
                      {!isReadOnly && <Trash2 className="w-4 h-4 text-[#C62828] cursor-pointer" onClick={() => setFiles((prev) => prev.filter((_, idx) => idx !== i))} />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Prescription Values */}
            <div className="mb-4 pb-4 border-b border-[#eee]">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#333] text-white text-[8px] font-semibold">2</span>
                <span className="text-[10px] font-medium text-[#555]">Prescription Values</span>
                {ocrApplied && (
                  <span className="text-[9px] px-1.5 py-[2px] rounded-full bg-[#E3F2FD] text-[#1565C0] font-medium ml-auto">OCR Auto-filled</span>
                )}
              </div>

              {/* Basic Info: Patient + Prescriber */}
              <div className="text-[9px] font-semibold text-[#999] uppercase tracking-wider mb-2">Basic Info</div>
              <div className="grid grid-cols-2 gap-3 mb-3.5">
                {/* Patient */}
                <div className="bg-[#f9fafb] border border-[#eee] rounded-lg p-3">
                  <div className="text-[9px] font-semibold text-[#999] uppercase tracking-wider mb-2 flex items-center gap-1">Patient</div>
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Name <span className="text-[#ff6b35]">*</span></label>
                      <input type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} disabled={isReadOnly} placeholder="Patient name" className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70 disabled:pointer-events-none" />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Date of Birth <span className="text-[#ff6b35]">*</span></label>
                      <input type="date" value={patientDob} onChange={(e) => setPatientDob(e.target.value)} disabled={isReadOnly} className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70 disabled:pointer-events-none" />
                    </div>
                  </div>
                </div>
                {/* Prescriber */}
                <div className="bg-[#f9fafb] border border-[#eee] rounded-lg p-3">
                  <div className="text-[9px] font-semibold text-[#999] uppercase tracking-wider mb-2 flex items-center gap-1">Prescriber</div>
                  <div className="flex flex-col gap-1.5">
                    <div>
                      <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Prescriber <span className="text-[#ff6b35]">*</span></label>
                      <input type="text" value={prescriber} onChange={(e) => setPrescriber(e.target.value)} disabled={isReadOnly} placeholder="Prescriber name" className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70 disabled:pointer-events-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="text-[10px] font-medium text-[#777] mb-0.5 block">License No. <span className="text-[#ff6b35]">*</span></label>
                        <input type="text" value={license} onChange={(e) => setLicense(e.target.value)} disabled={isReadOnly} placeholder="LIC number" className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70 disabled:pointer-events-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Signature</label>
                        <div className="h-[26px] flex items-center gap-1.5">
                          <span onClick={() => !isReadOnly && setSignature(true)} className={`inline-block w-[30px] h-6 leading-6 text-center text-[10px] font-semibold rounded-xl cursor-pointer transition-all ${signature ? "bg-[#ff6b35] text-white" : "bg-[#eee] text-[#999]"}`}>Y</span>
                          <span onClick={() => !isReadOnly && setSignature(false)} className={`inline-block w-[30px] h-6 leading-6 text-center text-[10px] font-semibold rounded-xl cursor-pointer transition-all ${!signature ? "bg-[#ff6b35] text-white" : "bg-[#eee] text-[#999]"}`}>N</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Address <span className="text-[#ff6b35]">*</span></label>
                      <input type="text" value={rxAddress} onChange={(e) => setRxAddress(e.target.value)} disabled={isReadOnly} placeholder="City, State, ZIP" className={`w-full h-[26px] border rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70 disabled:pointer-events-none ${ocrLowConf.has("rxAddress") ? "border-[#4CAF50] bg-[#f1f8e9]" : "border-[#ddd]"}`} />
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Phone</label>
                        <input type="text" value={rxPhone} onChange={(e) => setRxPhone(e.target.value)} disabled={isReadOnly} placeholder="Optional" className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70 disabled:pointer-events-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Fax</label>
                        <input type="text" value={rxFax} onChange={(e) => setRxFax(e.target.value)} disabled={isReadOnly} placeholder="Optional" className={`w-full h-[26px] border rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70 disabled:pointer-events-none ${ocrLowConf.has("rxFax") ? "border-[#4CAF50] bg-[#f1f8e9]" : "border-[#ddd]"}`} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <div>
                        <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Issue Date</label>
                        <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} disabled={isReadOnly} className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70 disabled:pointer-events-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Expiry Date <span className="text-[#ff6b35]">*</span></label>
                        <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} disabled={isReadOnly} className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70 disabled:pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prescription Values Table */}
              <div className="border-t border-[#eee] pt-3 mt-0.5 text-[9px] font-semibold text-[#999] uppercase tracking-wider mb-2">Prescription Values</div>
              <table className="w-full border-collapse border border-[#e0e0e0] rounded-lg overflow-visible mb-3">
                <thead>
                  <tr>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-r border-[#e8e8e8] border-b border-[#e0e0e0] w-20" />
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-r border-[#e8e8e8] border-b border-[#e0e0e0]">SPH <span className="text-[#ffcdd2]">*</span></th>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-r border-[#e8e8e8] border-b border-[#e0e0e0]">CYL <span className="text-[#ffcdd2]">*</span></th>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-r border-[#e8e8e8] border-b border-[#e0e0e0]">AXIS <span className="text-[#ffcdd2]">*</span></th>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-r border-[#e8e8e8] border-b border-[#e0e0e0]">
                      PD <span className="text-[#ffcdd2]">*</span>
                      <br />
                      <span className="inline-flex gap-0 mt-1 border border-[#ccc] rounded overflow-hidden">
                        <button onClick={() => setPdMode("single")} className={`px-2.5 py-[3px] text-[10px] border-none cursor-pointer ${pdMode === "single" ? "bg-[#ff6b35] text-white font-semibold" : "bg-transparent text-[#999]"}`}>Single</button>
                        <button onClick={() => setPdMode("dual")} className={`px-2.5 py-[3px] text-[10px] border-none cursor-pointer ${pdMode === "dual" ? "bg-[#ff6b35] text-white font-semibold" : "bg-transparent text-[#999]"}`}>Dual</button>
                      </span>
                    </th>
                    <th className="bg-[#f5f5f5] text-[#555] px-2.5 py-2 text-[10px] font-medium text-center border-b border-[#e0e0e0]">OC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-[#f7f8fa] font-medium text-[#666] text-left pl-4 text-[11px] border-r border-[#eee] border-b border-[#eee]">OD (R)</td>
                    {(["odSph", "odCyl", "odAxis", "odPd", "odOc"] as const).map((key, i) => {
                      const opts = i === 0 ? SPH_OPTS : i === 1 ? CYL_OPTS : i === 2 ? AXIS_OPTS : i === 3 ? PD_OPTS : OC_OPTS
                      return (
                        <td key={key} className={`px-2 py-1.5 border-b border-[#eee] ${i < 4 ? "border-r border-[#eee]" : ""} text-center`}>
                          <select
                            value={rxValues[key]}
                            onChange={(e) => setRxValues((p) => ({ ...p, [key]: e.target.value }))}
                            disabled={isReadOnly}
                            className={`w-full max-w-[90px] h-7 border rounded-md text-center text-[11px] outline-none cursor-pointer appearance-none pr-5 bg-white bg-[url('data:image/svg+xml,%3Csvg+xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22+width%3D%228%22+height%3D%225%22+viewBox%3D%220+0+8+5%22%3E%3Cpath+d%3D%22M0+0l4+5+4-5z%22+fill%3D%22%23999%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center] bg-[length:7px_4px] focus:border-[#ff6b35] focus:shadow-[0_0_0_2px_rgba(255,107,53,0.12)] disabled:bg-[#f5f5f5] disabled:text-[#999] ${ocrApplied ? "border-[#4CAF50] bg-[#f1f8e9]" : "border-[#ddd]"}`}
                          >
                            {opts.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
                          </select>
                        </td>
                      )
                    })}
                  </tr>
                  <tr>
                    <td className="bg-[#f7f8fa] font-medium text-[#666] text-left pl-4 text-[11px] border-r border-[#eee]">OS (L)</td>
                    {(["osSph", "osCyl", "osAxis", "osPd", "osOc"] as const).map((key, i) => {
                      const opts = i === 0 ? SPH_OPTS : i === 1 ? CYL_OPTS : i === 2 ? AXIS_OPTS : i === 3 ? PD_OPTS : OC_OPTS
                      const disabled = isReadOnly || (i === 3 && pdMode === "single")
                      return (
                        <td key={key} className={`px-2 py-1.5 ${i < 4 ? "border-r border-[#eee]" : ""} text-center`}>
                          <select
                            value={rxValues[key]}
                            onChange={(e) => setRxValues((p) => ({ ...p, [key]: e.target.value }))}
                            disabled={disabled}
                            className={`w-full max-w-[90px] h-7 border rounded-md text-center text-[11px] outline-none cursor-pointer appearance-none pr-5 bg-white bg-[url('data:image/svg+xml,%3Csvg+xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22+width%3D%228%22+height%3D%225%22+viewBox%3D%220+0+8+5%22%3E%3Cpath+d%3D%22M0+0l4+5+4-5z%22+fill%3D%22%23999%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_10px_center] bg-[length:7px_4px] focus:border-[#ff6b35] focus:shadow-[0_0_0_2px_rgba(255,107,53,0.12)] disabled:bg-[#f5f5f5] disabled:text-[#999] ${disabled ? "opacity-40 bg-[#e0e0e0]" : ""} ${ocrApplied && !disabled ? "border-[#4CAF50] bg-[#f1f8e9]" : "border-[#ddd]"}`}
                          >
                            {opts.map((o) => <option key={o} value={o}>{o || "—"}</option>)}
                          </select>
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. Delivery */}
          <div id="sec-delivery" className="bg-white border border-[#e0e0e0] rounded-lg p-4 mb-5">
            <div className="text-xs font-medium text-[#333] mb-3 flex items-center gap-1.5">
              <span className="text-[#ff6b35]">&#9679;</span> Address (Ship to Address / Ship to Store) <span className="text-[#ff6b35]">*</span>
            </div>
            <div className="flex gap-4 mb-3">
              <label onClick={() => !isReadOnly && setDlvType("address")} className={`flex items-center gap-1.5 cursor-pointer text-[11px] ${dlvType === "address" ? "text-[#333]" : "text-[#999]"}`}>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dlvType === "address" ? "border-[#ff6b35]" : "border-[#ccc]"}`}>
                  {dlvType === "address" && <span className="w-2 h-2 rounded-full bg-[#ff6b35]" />}
                </span>
                Ship to Address
              </label>
              <label onClick={() => !isReadOnly && setDlvType("store")} className={`flex items-center gap-1.5 cursor-pointer text-[11px] ${dlvType === "store" ? "text-[#333]" : "text-[#999]"}`}>
                <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${dlvType === "store" ? "border-[#ff6b35]" : "border-[#ccc]"}`}>
                  {dlvType === "store" && <span className="w-2 h-2 rounded-full bg-[#ff6b35]" />}
                </span>
                Ship to Store
              </label>
            </div>

            {dlvType === "store" ? (
              <div>
                <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Pickup Store</label>
                <input type="text" value="US1001 / GM_LosAngeles_FS_Downtown" disabled className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[9px] bg-[#f5f5f5] text-[#999]" />
              </div>
            ) : dlvMode === "search" ? (
              <div>
                <div className="relative mb-2">
                  <input
                    type="text"
                    value={dlvSearchInput}
                    onChange={(e) => { setDlvSearchInput(e.target.value); setDlvSearchOpen(true); setDlvVerified(false) }}
                    onFocus={() => dlvSearchInput && setDlvSearchOpen(true)}
                    onBlur={() => setTimeout(() => setDlvSearchOpen(false), 150)}
                    disabled={isReadOnly}
                    placeholder="Search address"
                    className="w-full h-[26px] border border-[#ddd] rounded-md pl-[30px] pr-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70"
                  />
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#999]" />
                  {dlvSearchOpen && (
                    <div className="absolute top-[28px] left-0 right-0 bg-white border border-[#ddd] rounded-md shadow-lg z-[100] overflow-hidden max-h-[200px] overflow-y-auto">
                      {filteredAddresses.map((a) => (
                        <div key={a.addr + a.zip} onMouseDown={() => selectAddress(a)} className="px-3 py-2 text-[11px] text-[#333] cursor-pointer border-b border-[#f0f0f0] hover:bg-[#fafafa]">
                          {a.addr}, {a.city}, {a.state} {a.zip}
                        </div>
                      ))}
                      <div onMouseDown={() => { setDlvMode("manual"); setDlvSearchOpen(false) }} className="px-3 py-2 text-[10px] text-[#ff6b35] cursor-pointer flex items-center gap-1">
                        <Pencil className="w-2.5 h-2.5" /> Can&apos;t find your address? Enter it manually
                      </div>
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <input type="text" value={dlvAddr2S} onChange={(e) => setDlvAddr2S(e.target.value)} disabled={isReadOnly} placeholder="Address Line 2" className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div><label className="text-[10px] font-medium text-[#777] mb-0.5 block">City <span className="text-[#ff6b35]">*</span></label><input type="text" value={dlvCityS} readOnly className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] bg-[#f5f5f5]" /></div>
                  <div><label className="text-[10px] font-medium text-[#777] mb-0.5 block">State <span className="text-[#ff6b35]">*</span></label><input type="text" value={dlvStateS} readOnly className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] bg-[#f5f5f5]" /></div>
                  <div><label className="text-[10px] font-medium text-[#777] mb-0.5 block">ZIP <span className="text-[#ff6b35]">*</span></label><input type="text" value={dlvZipS} readOnly className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] bg-[#f5f5f5]" /></div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-end mb-2">
                  <button onClick={() => { setDlvMode("search"); setDlvVerified(false) }} className="text-[10px] text-[#555] bg-white border border-[#ddd] rounded px-2.5 py-1 cursor-pointer flex items-center gap-1 hover:bg-[#f5f5f5]">
                    <Search className="w-2.5 h-2.5" /> Back to Search
                  </button>
                </div>
                <div className="mb-2">
                  <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Address <span className="text-[#ff6b35]">*</span></label>
                  <input type="text" value={dlvAddr1} onChange={(e) => { setDlvAddr1(e.target.value); setDlvVerified(false); setDlvSuggestion(null) }} disabled={isReadOnly} className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70" />
                </div>
                <div className="mb-2">
                  <label className="text-[10px] font-medium text-[#777] mb-0.5 block">Address Line 2</label>
                  <input type="text" value={dlvAddr2} onChange={(e) => setDlvAddr2(e.target.value)} disabled={isReadOnly} placeholder="Apt, Suite, Unit, etc." className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70" />
                </div>
                <div className="grid grid-cols-3 gap-2 mb-2.5">
                  <div><label className="text-[10px] font-medium text-[#777] mb-0.5 block">City <span className="text-[#ff6b35]">*</span></label><input type="text" value={dlvCity} onChange={(e) => { setDlvCity(e.target.value); setDlvVerified(false) }} disabled={isReadOnly} className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70" /></div>
                  <div><label className="text-[10px] font-medium text-[#777] mb-0.5 block">State <span className="text-[#ff6b35]">*</span></label><input type="text" value={dlvState} onChange={(e) => { setDlvState(e.target.value); setDlvVerified(false) }} disabled={isReadOnly} className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70" /></div>
                  <div><label className="text-[10px] font-medium text-[#777] mb-0.5 block">ZIP <span className="text-[#ff6b35]">*</span></label><input type="text" value={dlvZip} onChange={(e) => { setDlvZip(e.target.value); setDlvVerified(false) }} disabled={isReadOnly} className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none focus:border-[#ff6b35] disabled:opacity-70" /></div>
                </div>
                {/* Validation */}
                {!dlvVerified ? (
                  <div className="flex items-center justify-between px-3 py-2 bg-[#FFF8E1] border border-[#FFE0B2] rounded-md">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#E65100]">
                      <AlertTriangle className="w-3.5 h-3.5" /> Unverified Address &middot; Check Address Required
                    </div>
                    <button onClick={revalidateAddress} disabled={!dlvAddr1 || !dlvCity || !dlvState || !dlvZip} className="h-[26px] px-3 bg-white text-[#555] border border-[#ddd] rounded text-[10px] cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#f5f5f5]">
                      Check Address
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[10px] text-[#4CAF50]">
                    <CheckCircle className="w-3 h-3" /> Verified
                  </div>
                )}
                {dlvSuggestion && (
                  <div className="mt-2 p-2.5 bg-[#f9fafb] border border-[#eee] rounded-md">
                    <div className="text-[9px] text-[#999] mb-1">Suggested standardization — use this address?</div>
                    <div className="text-[11px] font-medium text-[#333] mb-2">{dlvSuggestion.addr}, {dlvSuggestion.city}, {dlvSuggestion.state} {dlvSuggestion.zip}</div>
                    <button onClick={applyDlvSuggestion} className="h-[26px] px-3.5 bg-[#ff6b35] text-white border-none rounded text-[10px] font-medium cursor-pointer hover:bg-[#e55e2b]">Apply</button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. Policy Agreements */}
          <div id="sec-policy" className="bg-white border border-[#e0e0e0] rounded-lg p-4 mb-5">
            <div className="text-xs font-medium text-[#333] mb-3 flex items-center gap-1.5">
              <span className="text-[#ff6b35]">&#9679;</span> Policy Agreements
            </div>
            <div className="flex flex-col gap-2.5">
              <label className="flex items-center gap-1.5 text-[11px] text-[#777] cursor-pointer">
                <input type="checkbox" checked={chkRxTerms} onChange={(e) => { setChkRxTerms(e.target.checked) }} disabled={isReadOnly} className="w-3.5 h-3.5 accent-[#ff6b35] rounded" />
                <span>I have read and agree to the Consent &amp; Agreement Policy for prescription lens services. <span className="text-[#ff6b35]">*</span></span>
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-[#777] cursor-pointer">
                <input type="checkbox" checked={chkHipaa} onChange={(e) => { setChkHipaa(e.target.checked) }} disabled={isReadOnly} className="w-3.5 h-3.5 accent-[#ff6b35] rounded" />
                <span>I authorize the use and disclosure of my health information as described in the HIPAA Authorization. <span className="text-[#ff6b35]">*</span></span>
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-[#777] cursor-pointer">
                <input type="checkbox" checked={chkMarketing} onChange={(e) => { setChkMarketing(e.target.checked) }} disabled={isReadOnly} className="w-3.5 h-3.5 accent-[#ff6b35] rounded" />
                <span>I agree to receive marketing communications. (Optional)</span>
              </label>
            </div>
            {/* Signature */}
            <div className="mt-3.5 pt-3.5 border-t border-[#eee]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-semibold text-[#555]">Customer Signature <span className="text-[#ff6b35]">*</span></span>
                {!isReadOnly && (
                  <button onClick={clearSignature} className="h-[26px] px-3.5 bg-[#eee] text-[#555] border-none rounded-md text-[10px] font-medium cursor-pointer">Clear</button>
                )}
              </div>
              <canvas
                ref={sigCanvas}
                width={600}
                height={120}
                className={`w-full h-[120px] border border-[#ddd] rounded-md bg-[#fafafa] ${isReadOnly ? "pointer-events-none opacity-60" : "cursor-crosshair"}`}
              />
            </div>
          </div>

          {/* 6. Comment */}
          <div id="sec-comment" className="bg-white border border-[#e0e0e0] rounded-lg p-4 mb-5">
            <div className="text-xs font-medium text-[#333] mb-3 flex items-center gap-1.5">
              <span className="text-[#ff6b35]">&#9679;</span> Comment
            </div>
            <div className="flex gap-2 mb-2.5">
              <div className="w-40">
                <select value={commentType} onChange={(e) => setCommentType(e.target.value)} className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 text-[11px] outline-none">
                  <option>General</option>
                  <option>Prescription</option>
                  <option>Lens</option>
                  <option>Frame</option>
                  <option>Delivery</option>
                </select>
              </div>
              <div className="flex-1">
                <div className="flex gap-1.5">
                  <div className="flex-1 flex flex-col">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      maxLength={200}
                      placeholder="Enter comment"
                      className="w-full h-[26px] border border-[#ddd] rounded-md px-2.5 py-1 text-[11px] resize-none outline-none font-sans text-[#333]"
                    />
                    <div className="text-right text-[9px] text-[#bbb] mt-0.5">{commentText.replace(/\s/g, "").length} / 200</div>
                  </div>
                  <button onClick={addComment} className="h-[26px] px-3.5 bg-[#ff6b35] text-white border-none rounded-md text-[10px] font-medium cursor-pointer whitespace-nowrap hover:bg-[#e55e2b]">Add</button>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2.5 mt-1">
              {comments.map((c) => (
                <div key={c.id} className="p-2.5 bg-[#f9fafb] rounded-md border border-[#eee]">
                  <div className="flex items-center gap-1.5 mb-[3px]">
                    <span className={`text-[9px] px-1.5 py-[2px] rounded font-medium ${COMMENT_TYPE_COLORS[c.type] || COMMENT_TYPE_COLORS.General}`}>{c.type}</span>
                    <span className="text-[10px] font-semibold text-[#333]">{c.author}</span>
                    <span className="text-[9px] text-[#bbb] ml-auto">{c.date}</span>
                    {c.author === "monster1437" && editingComment !== c.id && (
                      <span className="flex gap-1 ml-1.5">
                        <button onClick={() => { setEditingComment(c.id); setEditText(c.text) }} className="text-[9px] text-[#1565C0] bg-transparent border-none cursor-pointer underline">Edit</button>
                        <button onClick={() => deleteComment(c.id)} className="text-[9px] text-[#e53935] bg-transparent border-none cursor-pointer underline">Delete</button>
                      </span>
                    )}
                  </div>
                  {editingComment === c.id ? (
                    <div>
                      <div className="flex gap-1.5 items-center">
                        <input value={editText} onChange={(e) => setEditText(e.target.value)} maxLength={200} className="flex-1 h-7 border-[1.5px] border-[#ff6b35] rounded px-2 text-[11px] outline-none bg-[#fff8f5]" />
                        <button onClick={() => saveEditComment(c.id)} className="h-7 px-3 bg-[#ff6b35] text-white border-none rounded text-[10px] font-medium cursor-pointer">Save</button>
                        <button onClick={() => setEditingComment(null)} className="w-7 h-7 bg-[#eee] text-[#888] border-none rounded text-[14px] cursor-pointer flex items-center justify-center">&times;</button>
                      </div>
                      <div className="text-right text-[9px] text-[#bbb] mt-0.5">{editText.replace(/\s/g, "").length} / 200</div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-[#555] leading-relaxed">{c.text}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="w-60 shrink-0 sticky top-[112px]">
          <div className="bg-white border border-[#e0e0e0] rounded-lg overflow-hidden">
            <div className="bg-[#ff6b35] text-white px-3.5 py-2.5 text-[11px] font-semibold">Index</div>
            <ul className="list-none m-0 p-0">
              {sections.map((s) => {
                const { filled, total } = s.check()
                const done = filled === total
                const isDisabledStyle = approval === "Reject" || approval === "Canceled"
                const isRO = approval === "Requested" || approval === "Confirm" || approval === "Reject" || approval === "Canceled"
                let checkCls = ""
                let rowCls = ""
                if (isRO) {
                  if (isDisabledStyle) { checkCls = "bg-[#f5f5f5] border-[#ccc]"; rowCls = "bg-[#f5f5f5] text-[#aaa]" }
                  else { checkCls = "bg-[#4CAF50] border-[#4CAF50]"; rowCls = "bg-[#E8F0FE]" }
                } else {
                  checkCls = done ? "bg-[#4CAF50] border-[#4CAF50]" : "border-[#ccc] bg-white"
                }
                return (
                  <li
                    key={s.label}
                    onClick={() => document.getElementById(s.anchor)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                    className={`flex items-center gap-2 px-3.5 py-2.5 border-b border-[#f0f0f0] cursor-pointer transition-colors text-[10px] font-medium text-[#555] hover:bg-[#fafafa] ${rowCls}`}
                  >
                    <div className={`w-4 h-4 rounded border-[1.5px] flex items-center justify-center shrink-0 transition-all ${checkCls}`}>
                      {(done || isRO) && <Check className="w-2.5 h-2.5 text-white" />}
                    </div>
                    {s.label}
                  </li>
                )
              })}
            </ul>
            {/* Actions */}
            <div className="px-3.5 py-2.5 border-t border-[#eee] flex flex-col gap-[5px]">
              {approval === "Confirm" || approval === "Reject" || approval === "Canceled" ? (
                <div className="text-center text-[10px] text-[#888] py-1">This order has been {approval.toLowerCase()}.</div>
              ) : approval === "Requested" ? (
                <div className="flex gap-[5px]">
                  <button onClick={onReject} className="flex-1 h-[30px] flex items-center justify-center bg-white text-[#ff6b35] border border-[#ff6b35] rounded-md text-[10px] font-semibold cursor-pointer hover:bg-[#fff8f5]">Reject</button>
                  <button onClick={onConfirm} className="flex-1 h-[30px] flex items-center justify-center bg-[#333] text-white border-none rounded-md text-[10px] font-semibold cursor-pointer hover:bg-[#222]">Confirm</button>
                </div>
              ) : (
                <button
                  onClick={onSave}
                  disabled={!allComplete}
                  className={`w-full h-[30px] flex items-center justify-center bg-[#ff6b35] text-white border-none rounded-md text-[10px] font-semibold cursor-pointer transition-opacity ${allComplete ? "opacity-100 hover:bg-[#e55e2b]" : "opacity-40 cursor-not-allowed"}`}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
