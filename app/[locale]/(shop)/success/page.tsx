import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Common'
import { PrimaryButton } from '@/components/ui/Button'

interface PageProps {
  searchParams: {
    design?: string
    mock?: string
  }
}

export default function SuccessPage({ searchParams }: PageProps) {
  const { design, mock } = searchParams
  
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        
        {/* Success Card */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="text-4xl">✅</div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order Successful!
            </h1>
            
            {mock ? (
              <p className="text-lg text-gray-600">
                Your design has been saved! (This was a demo checkout)
              </p>
            ) : (
              <p className="text-lg text-gray-600">
                Thank you for your order! We'll start crafting your custom bracelet right away.
              </p>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {design && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <p className="text-sm text-gray-600">
                  Design ID: <code className="bg-white px-2 py-1 rounded">{design}</code>
                </p>
              </div>
            )}
            
            <div className="space-y-4">
              <h3 className="font-semibold">What&apos;s Next?</h3>
              <ul className="text-left space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">📧</span>
                  You&apos;ll receive an order confirmation email shortly
                </li>
                <li className="flex items-center">
                  <span className="text-blue-500 mr-2">🔨</span>
                  Our artisans will carefully craft your bracelet
                </li>
                <li className="flex items-center">
                  <span className="text-purple-500 mr-2">📦</span>
                  We'll send tracking info when your order ships
                </li>
                <li className="flex items-center">
                  <span className="text-orange-500 mr-2">🚚</span>
                  Expected delivery: 5-7 business days
                </li>
              </ul>
            </div>
            
            {mock && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Demo Mode</h4>
                <p className="text-yellow-700 text-sm">
                  This was a demonstration checkout. No actual payment was processed. 
                  In production, this would integrate with a real payment provider.
                </p>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <PrimaryButton className="flex-1" asChild>
                <Link href="/bracelets">
                  Design Another Bracelet
                </Link>
              </PrimaryButton>
              
              <PrimaryButton variant="outline" className="flex-1" asChild>
                <Link href="/">
                  Return Home
                </Link>
              </PrimaryButton>
            </div>
          </CardContent>
        </Card>
        
        {/* Support Info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Questions about your order? 
            <a href="mailto:support@laninawbracelets.com" className="text-blue-600 hover:text-blue-800 ml-1">
              Contact us
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}