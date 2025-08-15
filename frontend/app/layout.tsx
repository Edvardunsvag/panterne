import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/common/layout/Navbar"
import { SessionWrapper } from "@/components/common/layout/SessionWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Panterne Quiz Generator",
  description: "Generate random quiz questions using OpenAI",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionWrapper>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </SessionWrapper>
      </body>
    </html>
  )
}