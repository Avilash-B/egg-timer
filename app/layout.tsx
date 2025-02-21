import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'egg-timer',
  description: 'Timer for cooking eggs',
  generator: 'avilash',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
