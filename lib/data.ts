export interface Product {
  code: string
  name: string
  barcode: string
  price: number
}

export interface RxOrder {
  id: string
  orderDate: string
  orderType: string
  approval: string
  workStatus: string
  cancelRefund: string
  invoiceNo: string
  products: Product[]
  saveDate: string
  emailSent: boolean
}

export const rxData: RxOrder[] = [
  {
    id: "SLUS1001260508161127VESWH",
    orderDate: "2026-07-20 14:32 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "Finalized",
    cancelRefund: "Refunded",
    invoiceNo: "STM2605188213",
    products: [
      { code: "11000000", name: "SMART ALIO-01", barcode: "8809639024362", price: 295 },
      { code: "14000225", name: "POLY-AR", barcode: "-", price: 280 },
      { code: "15000001", name: "RX PACKAGE-01", barcode: "-", price: 0 },
    ],
    saveDate: "2026-07-20 15:10 (PST)",
    emailSent: true,
  },
  {
    id: "SLUS100126050811264DNNNU",
    orderDate: "2026-07-21 09:15 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "Outbound Inspection",
    cancelRefund: "-",
    invoiceNo: "STM2605192847",
    products: [
      { code: "11000005", name: "GATTA-01", barcode: "8809639021927", price: 320 },
      { code: "14000220", name: "174-AR", barcode: "-", price: 350 },
      { code: "15000002", name: "RX PACKAGE-02", barcode: "-", price: 0 },
    ],
    saveDate: "2026-07-21 10:42 (PST)",
    emailSent: true,
  },
  {
    id: "SLUS10012605071446QYZMO",
    orderDate: "2026-07-22 11:48 (PST)",
    orderType: "PREORDER",
    approval: "Requested",
    workStatus: "Pending",
    cancelRefund: "-",
    invoiceNo: "-",
    products: [
      { code: "11000006", name: "HAVANA-01", barcode: "8809639022009", price: 275 },
      { code: "14000223", name: "PL-167-AR", barcode: "-", price: 310 },
      { code: "15000001", name: "RX PACKAGE-01", barcode: "-", price: 0 },
    ],
    saveDate: "-",
    emailSent: false,
  },
  {
    id: "SLUS1001260507144204O85MX",
    orderDate: "2026-07-22 16:05 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "Re Do",
    cancelRefund: "-",
    invoiceNo: "STM2605201534",
    products: [
      { code: "11000008", name: "HEY-01 OPT", barcode: "8809639023815", price: 245 },
      { code: "14000226", name: "POLY-BG", barcode: "-", price: 280 },
      { code: "15000002", name: "RX PACKAGE-02", barcode: "-", price: 0 },
    ],
    saveDate: "2026-07-23 16:30 (PST)",
    emailSent: false,
  },
  {
    id: "SLUS10012605071354TN0NM",
    orderDate: "2026-07-23 10:22 (PST)",
    orderType: "NORMAL",
    approval: "Reject",
    workStatus: "Pending",
    cancelRefund: "-",
    invoiceNo: "-",
    products: [
      { code: "11000003", name: "DAY-01 OPT", barcode: "8809639023860", price: 265 },
      { code: "14000222", name: "CR39-TINT", barcode: "-", price: 190 },
      { code: "15000001", name: "RX PACKAGE-01", barcode: "-", price: 0 },
    ],
    saveDate: "-",
    emailSent: false,
  },
  {
    id: "SLUS100126050713480PALEC",
    orderDate: "2026-07-24 13:37 (PST)",
    orderType: "PREORDER",
    approval: "Unready",
    workStatus: "Pending",
    cancelRefund: "-",
    invoiceNo: "-",
    products: [
      { code: "11000014", name: "WESTCOAST-01", barcode: "8809639021989", price: 310 },
      { code: "14000227", name: "POLY-PF-AR", barcode: "-", price: 340 },
      { code: "15000002", name: "RX PACKAGE-02", barcode: "-", price: 0 },
    ],
    saveDate: "-",
    emailSent: false,
  },
  {
    id: "SLUS10012605071335063P6PG",
    orderDate: "2026-07-25 08:50 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "Completed",
    cancelRefund: "Canceled",
    invoiceNo: "STM2605215678",
    products: [
      { code: "11000010", name: "TOM21-A02", barcode: "8809639021941", price: 290 },
      { code: "14000228", name: "POLY-POL-AR", barcode: "-", price: 300 },
      { code: "15000001", name: "RX PACKAGE-01", barcode: "-", price: 0 },
    ],
    saveDate: "2026-07-25 09:18 (PST)",
    emailSent: true,
  },
  {
    id: "SLUS100126050709304QGN03",
    orderDate: "2026-07-26 17:58 (PST)",
    orderType: "NORMAL",
    approval: "Unready",
    workStatus: "Inbound Inspection",
    cancelRefund: "-",
    invoiceNo: "-",
    products: [
      { code: "11000016", name: "DAISY-032", barcode: "8809639023334", price: 255 },
      { code: "14000217", name: "167-PF-AR", barcode: "-", price: 330 },
      { code: "15000002", name: "RX PACKAGE-02", barcode: "-", price: 0 },
    ],
    saveDate: "-",
    emailSent: false,
  },
  {
    id: "SLUS10012605081520ABCDE",
    orderDate: "2026-07-27 10:15 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "Completed",
    cancelRefund: "Canceled",
    invoiceNo: "STM2605227890",
    products: [
      { code: "11000012", name: "RICK-01", barcode: "8809639023501", price: 285 },
      { code: "14000230", name: "CR39-AR", barcode: "-", price: 220 },
      { code: "15000001", name: "RX PACKAGE-01", barcode: "-", price: 0 },
    ],
    saveDate: "2026-07-27 11:30 (PST)",
    emailSent: true,
  },
  {
    id: "SLUS10012605081633FGHIJ",
    orderDate: "2026-07-28 14:22 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "Finalized",
    cancelRefund: "Refunded",
    invoiceNo: "STM2605231456",
    products: [
      { code: "11000018", name: "LUNA-02", barcode: "8809639024001", price: 310 },
      { code: "14000231", name: "174-PF-AR", barcode: "-", price: 360 },
      { code: "15000002", name: "RX PACKAGE-02", barcode: "-", price: 0 },
    ],
    saveDate: "2026-07-28 15:45 (PST)",
    emailSent: true,
  },
  {
    id: "SLUS10012605081745KLMNO",
    orderDate: "2026-07-29 09:30 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "In Progress",
    cancelRefund: "-",
    invoiceNo: "STM2605242367",
    products: [
      { code: "11000020", name: "CLEO-01 OPT", barcode: "8809639024105", price: 275 },
      { code: "14000232", name: "POLY-PF-BG", barcode: "-", price: 300 },
      { code: "15000001", name: "RX PACKAGE-01", barcode: "-", price: 0 },
    ],
    saveDate: "2026-07-29 10:15 (PST)",
    emailSent: false,
  },
  {
    id: "SLUS10012605081858PQRST",
    orderDate: "2026-07-30 16:45 (PST)",
    orderType: "PREORDER",
    approval: "Confirm",
    workStatus: "Completed",
    cancelRefund: "Canceled",
    invoiceNo: "STM2605253478",
    products: [
      { code: "11000022", name: "MARS-01", barcode: "8809639024208", price: 330 },
      { code: "14000233", name: "167-TINT", barcode: "-", price: 250 },
      { code: "15000002", name: "RX PACKAGE-02", barcode: "-", price: 0 },
    ],
    saveDate: "2026-07-30 17:20 (PST)",
    emailSent: true,
  },
  {
    id: "SLUS10012605081911UVWXY",
    orderDate: "2026-07-31 11:10 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "Outbound Inspection",
    cancelRefund: "-",
    invoiceNo: "STM2605264589",
    products: [
      { code: "11000024", name: "VEGA-02", barcode: "8809639024312", price: 295 },
      { code: "14000234", name: "POLY-AR", barcode: "-", price: 280 },
      { code: "15000001", name: "RX PACKAGE-01", barcode: "-", price: 0 },
    ],
    saveDate: "2026-07-31 12:05 (PST)",
    emailSent: false,
  },
  {
    id: "SLUS10012605082024ZABCD",
    orderDate: "2026-08-01 08:55 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "Finalized",
    cancelRefund: "Refunded",
    invoiceNo: "STM2605275690",
    products: [
      { code: "11000026", name: "SIRIUS-01", barcode: "8809639024415", price: 340 },
      { code: "14000235", name: "174-POL-AR", barcode: "-", price: 380 },
      { code: "15000002", name: "RX PACKAGE-02", barcode: "-", price: 0 },
    ],
    saveDate: "2026-08-01 09:40 (PST)",
    emailSent: true,
  },
  {
    id: "SLUS10012605082135EMAILA",
    orderDate: "2026-08-02 10:30 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "Completed",
    cancelRefund: "-",
    invoiceNo: "STM2605286701",
    products: [
      { code: "11000028", name: "NERO-01", barcode: "8809639024520", price: 305 },
      { code: "14000236", name: "167-AR", barcode: "-", price: 330 },
      { code: "15000001", name: "RX PACKAGE-01", barcode: "-", price: 0 },
    ],
    saveDate: "2026-08-02 11:15 (PST)",
    emailSent: false,
  },
  {
    id: "SLUS10012605082248EMAILB",
    orderDate: "2026-08-03 13:45 (PST)",
    orderType: "NORMAL",
    approval: "Confirm",
    workStatus: "Completed",
    cancelRefund: "-",
    invoiceNo: "STM2605297812",
    products: [
      { code: "11000030", name: "ORION-02", barcode: "8809639024633", price: 280 },
      { code: "14000237", name: "POLY-BG", barcode: "-", price: 290 },
      { code: "15000002", name: "RX PACKAGE-02", barcode: "-", price: 0 },
    ],
    saveDate: "2026-08-03 14:20 (PST)",
    emailSent: false,
  },
  {
    id: "SLUS10012605082351EMAILC",
    orderDate: "2026-08-04 09:10 (PST)",
    orderType: "PREORDER",
    approval: "Confirm",
    workStatus: "Completed",
    cancelRefund: "-",
    invoiceNo: "STM2605308923",
    products: [
      { code: "11000032", name: "ATLAS-01", barcode: "8809639024746", price: 320 },
      { code: "14000238", name: "174-PF-AR", barcode: "-", price: 360 },
      { code: "15000001", name: "RX PACKAGE-01", barcode: "-", price: 0 },
    ],
    saveDate: "2026-08-04 10:05 (PST)",
    emailSent: false,
  },
]

export const APPROVAL_CLASS: Record<string, string> = {
  Unready: "bg-[#FFF8E1] text-[#F57F17]",
  Confirm: "bg-[#E8F5E9] text-[#2E7D32]",
  Requested: "bg-[#FFF3E0] text-[#E65100]",
  Reject: "bg-[#FFEBEE] text-[#C62828]",
}

export const WORK_CLASS: Record<string, string> = {
  Pending: "bg-[#FFF8E1] text-[#F57F17]",
  "Inbound Inspection": "bg-[#FFF3E0] text-[#E65100]",
  "In Progress": "bg-[#E3F2FD] text-[#1565C0]",
  "Re Do": "bg-[#FFEBEE] text-[#C62828]",
  "Outbound Inspection": "bg-[#FFF3E0] text-[#E65100]",
  Completed: "bg-[#E3F2FD] text-[#1565C0]",
  Finalized: "bg-[#E8F5E9] text-[#2E7D32]",
}

export const CANCEL_CLASS: Record<string, string> = {
  Canceled: "bg-[#F5F5F5] text-[#888]",
  Refunded: "bg-[#FFEBEE] text-[#C62828]",
}

export const MOCK_MEMBERS = [
  {
    id: "MBR-001",
    email: "y7ol****@gmail.com",
    phone: "010-7211-9843",
    provider: "GOOGLE",
    name: "Kim Yujin",
    prescriptions: [
      { id: "RX-2025-0812", date: "2025-08-12", prescriber: "Dr. Smith", expiry: "2026-08-12", status: "Active" },
      { id: "RX-2024-0305", date: "2024-03-05", prescriber: "Dr. Lee", expiry: "2025-03-05", status: "Expired" },
    ],
  },
  {
    id: "MBR-002",
    email: "mons****@naver.com",
    phone: "010-5523-4421",
    provider: "NAVER",
    name: "Park Jihoon",
    prescriptions: [
      { id: "RX-2026-0115", date: "2026-01-15", prescriber: "Dr. Tanaka", expiry: "2027-01-15", status: "Active" },
    ],
  },
  {
    id: "MBR-003",
    email: "monster1437@gmail.com",
    phone: "010-3344-5566",
    provider: "GOOGLE",
    name: "Lee Soyeon",
    prescriptions: [],
  },
]

export const COUNTRIES = [
  "United States", "Japan", "Singapore", "South Korea", "China", "United Kingdom",
  "France", "Germany", "Canada", "Australia", "Italy", "Spain", "Brazil",
  "India", "Thailand", "Vietnam", "Indonesia", "Malaysia", "Philippines", "Taiwan",
]

export const MOCK_ADDRESSES = [
  { addr: "123 Main St", city: "Los Angeles", state: "CA", zip: "90012" },
  { addr: "123 Main Street", city: "Irvine", state: "CA", zip: "92602" },
  { addr: "456 New Plaza Dr", city: "Fremont", state: "CA", zip: "94538" },
  { addr: "789 Broadway", city: "New York", state: "NY", zip: "10003" },
]

export const MASTER_FRAMES = [
  { code: "11000001", name: "SMART ALIO-02" },
  { code: "11000002", name: "BOLD-01 OPT" },
  { code: "11000003", name: "DAY-01 OPT" },
  { code: "11000005", name: "GATTA-01" },
  { code: "11000006", name: "HAVANA-01" },
  { code: "11000008", name: "HEY-01 OPT" },
  { code: "11000010", name: "TOM21-A02" },
  { code: "11000012", name: "CARIN-01" },
  { code: "11000014", name: "WESTCOAST-01" },
  { code: "11000016", name: "DAISY-032" },
  { code: "11000018", name: "ROMEO-01" },
  { code: "11000020", name: "LUNA-05 OPT" },
]

export const OCR_MOCK_RESPONSE = {
  patient: {
    name: { value: "Kim Yujin", confidence: 96.5, low_confidence: false },
    dob: { value: "1992-03-15", confidence: 94.2, low_confidence: false },
  },
  prescriber: {
    name: { value: "Dr. James Smith", confidence: 97.8, low_confidence: false },
    license: { value: "OPT-2024-83721", confidence: 91.3, low_confidence: false },
    address: { value: "350 5th Ave, New York, NY 10118", confidence: 72.4, low_confidence: true },
    phone: { value: "212-555-0147", confidence: 88.0, low_confidence: false },
    fax: { value: "212-555-0148", confidence: 65.3, low_confidence: true },
    signature: { value: true, confidence: 92.0, low_confidence: false },
  },
  dates: {
    issue: { value: "2026-06-10", confidence: 98.1, low_confidence: false },
    expiry: { value: "2027-06-10", confidence: 97.5, low_confidence: false },
  },
  od: {
    sph: { value: -2.0, confidence: 99.1, low_confidence: false },
    cyl: { value: -0.5, confidence: 97.3, low_confidence: false },
    axis: { value: 125, confidence: 88.2, low_confidence: false },
  },
  os: {
    sph: { value: -2.25, confidence: 98.5, low_confidence: false },
    cyl: { value: -0.75, confidence: 62.1, low_confidence: true },
    axis: { value: 30, confidence: 45.3, low_confidence: true },
  },
  pd: { binocular: { value: 63, confidence: 95.0, low_confidence: false } },
}

export const COMMENT_TYPE_COLORS: Record<string, string> = {
  General: "bg-[#E8F5E9] text-[#2E7D32]",
  Prescription: "bg-[#E3F2FD] text-[#1565C0]",
  Lens: "bg-[#FFF3E0] text-[#E65100]",
  Frame: "bg-[#F3E5F5] text-[#7B1FA2]",
  Delivery: "bg-[#E0F2F1] text-[#00695C]",
}
