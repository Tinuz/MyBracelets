import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Common'
import { PrimaryButton } from '@/components/ui/Button'

interface Bracelet {
  id: string
  slug: string
  name: string
  basePriceCents: number
  imageUrl?: string | null
  svgPath: string
  lengthMm: number
}

async function getBracelets(): Promise<Bracelet[]> {
  try {
    const res = await fetch(`${process.env.APP_URL || 'http://localhost:3000'}/api/bracelets`, {
      cache: 'no-store', // Always get fresh data
    })
    
    if (!res.ok) {
      throw new Error('Failed to fetch bracelets')
    }
    
    return res.json()
  } catch (error) {
    console.error('Error fetching bracelets:', error)
    return []
  }
}

export default async function BraceletsPage() {
  const bracelets = await getBracelets()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Base Bracelet
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start your design journey by selecting the perfect base bracelet. 
            Each one can be customized with your choice of charms.
          </p>
        </div>

        {/* Bracelets Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {bracelets.map((bracelet) => (
            <Card key={bracelet.slug} hover className="overflow-hidden">
              {/* Bracelet image or SVG */}
              <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative">
                {bracelet.imageUrl ? (
                  <img 
                    src={bracelet.imageUrl} 
                    alt={bracelet.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <svg 
                    viewBox="0 0 1000 300" 
                    className="w-full h-full p-4"
                  >
                    <path
                      d={bracelet.svgPath}
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth={12}
                      strokeLinecap="round"
                      className="drop-shadow-sm"
                    />
                  </svg>
                )}
              </div>
              
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900">
                  {bracelet.name}
                </h3>
                <p className="text-gray-600 mt-2">
                  Length: {bracelet.lengthMm}mm • Customizable with charms
                </p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    €{(bracelet.basePriceCents / 100).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    base price
                  </span>
                </div>
                
                <PrimaryButton 
                  className="w-full"
                  asChild
                >
                  <Link href={`/designer/${bracelet.slug}`}>
                    Start Designing
                  </Link>
                </PrimaryButton>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-center mb-8">
            What Makes Our Bracelets Special?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="font-semibold mb-2">Premium Materials</h3>
              <p className="text-gray-600 text-sm">
                Made with high-quality metals and genuine materials for lasting beauty
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">🎨</span>
              </div>
              <h3 className="font-semibold mb-2">Fully Customizable</h3>
              <p className="text-gray-600 text-sm">
                Position charms exactly where you want with our interactive designer
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl">💝</span>
              </div>
              <h3 className="font-semibold mb-2">Perfect Gift</h3>
              <p className="text-gray-600 text-sm">
                Create something truly unique and personal for yourself or someone special
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Not sure which bracelet to choose? Each one can be fully customized!
          </p>
          <PrimaryButton variant="outline" asChild>
            <Link href="/#how-it-works">
              Learn How It Works
            </Link>
          </PrimaryButton>
        </div>
      </div>
    </div>
  )
}