interface LabStatCard {
  count: number
  name: string
  description: string
  color: string
}

const statsData: LabStatCard[][] = [
  [
    { count: 0, name: "(Basic) IIC Lab", description: "Standard processing 7 ~ 10 D", color: "#ff6b35" },
    { count: 1, name: "(Basic) Outsource Lab1", description: "Additional time 10 ~ 14 D", color: "#ff6b35" },
    { count: 0, name: "(Basic) Outsource Lab2", description: "Additional time 12 ~ 16 D", color: "#ff6b35" },
  ],
  [
    { count: 0, name: "(Tint) IIC Lab", description: "Standard processing 9 ~ 12 D", color: "#4caf50" },
    { count: 0, name: "(Tint) Lab 1", description: "Standard processing 12 ~ 16 D", color: "#4caf50" },
    { count: 0, name: "(Tint) Lab 2", description: "Standard processing 14 ~ 18 D", color: "#4caf50" },
  ],
]

export function ProcessingStats() {
  return (
    <div className="mb-6">
      {statsData.map((row, rowIdx) => (
        <div key={rowIdx} className="grid grid-cols-3 gap-4 mb-4 last:mb-0">
          {row.map((stat) => (
            <div
              key={stat.name}
              className="bg-white rounded-lg border border-[#e0e0e0] px-5 py-4"
              style={{ borderLeft: `4px solid ${stat.color}` }}
            >
              <div className="text-[22px] font-bold text-[#222] mb-1">{stat.count}</div>
              <div className="text-[13px] font-semibold text-[#222]">{stat.name}</div>
              <div className="text-[11px] text-[#999] mt-0.5">{stat.description}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
