import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  La Nina Bracelets
                </h1>
              </div>
              <nav className="flex items-center space-x-4">
                <a href="/bracelets" className="text-gray-700 hover:text-gray-900">
                  Bracelets
                </a>
                <a href="/about" className="text-gray-700 hover:text-gray-900">
                  About
                </a>
              </nav>
            </div>
          </div>
        </header>
        
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