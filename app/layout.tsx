import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/ui/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bracelet Designer - Create Your Custom Bracelet',
  description: 'Design your perfect bracelet with our interactive charm placement tool. Choose from a variety of charms and create something truly unique.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        
        <main>{children}</main>
        
        <footer className="bg-gray-50 border-t mt-16">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center text-gray-500">
              <p>&copy; 2024 La Nina Bracelets. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}