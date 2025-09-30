import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/Common'
import { PrimaryButton } from '@/components/ui/Button'

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Create Your Perfect
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              {" "}Bracelet
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Design a unique bracelet with our interactive designer tools. 
            Create chain bracelets with charms, beads-only bracelets, or combine both for endless possibilities.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PrimaryButton size="lg" asChild>
              <Link href="/designer">
                Start Designing
              </Link>
            </PrimaryButton>
            <PrimaryButton variant="outline" size="lg" asChild>
              <Link href="#how-it-works">
                Learn More
              </Link>
            </PrimaryButton>
          </div>
          
          {/* Cart Link */}
          <div className="mt-6 text-center">
            <Link 
              href="/cart" 
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m9.5-6v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span>View Cart</span>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            How It Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card hover>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📿</span>
                </div>
                <h3 className="text-xl font-semibold">1. Choose Base</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Select from our beautiful base bracelets in different styles and colors.
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-semibold">2. Add Charms</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Drag and drop charms along the bracelet path. Position them exactly where you want.
                </p>
              </CardContent>
            </Card>

            <Card hover>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h3 className="text-xl font-semibold">3. Order</h3>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Save your design and proceed to checkout. We'll craft your unique bracelet.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose La Nina Bracelets?
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold mb-2">Interactive Design</h3>
              <p className="text-sm text-gray-600">Real-time visual designer with drag & drop charm placement</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">💝</div>
              <h3 className="font-semibold mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">High-quality materials and careful craftsmanship</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">🚚</div>
              <h3 className="font-semibold mb-2">Fast Shipping</h3>
              <p className="text-sm text-gray-600">Quick and secure delivery to your door</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="font-semibold mb-2">Smart Pricing</h3>
              <p className="text-sm text-gray-600">Volume discounts: 5% off 5+ charms, 10% off 10+ charms</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Create Something Beautiful?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start designing your perfect bracelet today. It only takes a few minutes!
          </p>
          
          <PrimaryButton 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100"
            asChild
          >
            <Link href="/bracelets">
              Start Your Design
            </Link>
          </PrimaryButton>
        </div>
      </section>
    </div>
  )
}