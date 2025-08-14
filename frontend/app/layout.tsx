import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/Navbar"
import { SessionWrapper } from "@/components/SessionWrapper"
import styles from "./layout.module.scss"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OpenAI Quiz Generator",
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
      <body>
        <SessionWrapper>
          <div className={styles.layout}>
            <Navbar />
            <main className={styles.main}>
              {children}
            </main>
          </div>
        </SessionWrapper>
      </body>
    </html>
  )
}