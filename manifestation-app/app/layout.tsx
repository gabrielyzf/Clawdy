import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Manifest — Intentional Living',
  description: 'Turn vague wishes into clear vision, embodied identity, and trackable action.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
