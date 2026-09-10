import React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { AppHeader } from "@/components/app-header"
import { TabNav } from "@/components/tab-nav"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IIC POS - Rx Operation",
  description: "POS Rx Operation Management",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <AppHeader />
        <TabNav />
        <main className="mt-[112px] px-8 py-6 min-h-[calc(100vh-112px)] bg-[#f5f5f5]">
          {children}
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            classNames: {
              success: "!bg-green-50 !text-green-800 !border-green-200",
              error: "!bg-red-50 !text-red-800 !border-red-200",
            },
          }}
        />
      </body>
    </html>
  )
}
