import { Card, CardContent, CardHeader } from '@/components/ui/Common';
import { PrimaryButton } from '@/components/ui/Button';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function AboutPage() {
  const locale = useLocale();
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                {" "}La Nina Bracelets
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Crafting unique, personalized jewelry experiences through innovative design and premium materials.
            </p>
          </div>

          <div className="grid gap-8 mb-16">
            
            {/* Our Story */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">💎</span>
                  Our Story
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La Nina Bracelets was founded with a simple vision: to make beautiful, personalized jewelry accessible to everyone. Our innovative design platform allows customers to create truly unique pieces that reflect their personal style and story.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  We combine traditional craftsmanship with modern technology, offering an interactive design experience that lets you visualize your bracelet before it&apos;s created.
                </p>
              </CardContent>
            </Card>

            {/* Our Process */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">🔨</span>
                  Our Process
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎨</span>
                    </div>
                    <h3 className="font-semibold mb-2">Design</h3>
                    <p className="text-sm text-gray-600">Use our interactive designer to create your perfect bracelet</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">⚒️</span>
                    </div>
                    <h3 className="font-semibold mb-2">Craft</h3>
                    <p className="text-sm text-gray-600">Our skilled artisans carefully assemble your unique piece</p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="font-semibold mb-2">Deliver</h3>
                    <p className="text-sm text-gray-600">Your bracelet arrives beautifully packaged and ready to wear</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality & Materials */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">✨</span>
                  Quality & Materials
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">Premium Metals</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Sterling Silver (925)</li>
                      <li>• 14K Gold & Rose Gold</li>
                      <li>• White Gold & Platinum</li>
                      <li>• Surgical Steel Options</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-lg">Quality Charms</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Hand-selected designs</li>
                      <li>• Durable plating & finishes</li>
                      <li>• Hypoallergenic materials</li>
                      <li>• Ethically sourced components</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                  <span className="text-3xl mr-3">📧</span>
                  Get in Touch
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Customer Support</h3>
                    <p className="text-gray-700 mb-2">
                      <strong>Email:</strong> support@laninabbracelets.com
                    </p>
                    <p className="text-gray-700 mb-2">
                      <strong>Response time:</strong> Within 24 hours
                    </p>
                    <p className="text-gray-700">
                      <strong>Available:</strong> Monday - Friday, 9AM - 6PM CET
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Custom Orders</h3>
                    <p className="text-gray-700 mb-4">
                      Looking for something special? We also accept custom design requests for unique pieces.
                    </p>
                    <PrimaryButton size="sm" asChild>
                      <Link href="mailto:custom@laninabbracelets.com">
                        Contact for Custom Work
                      </Link>
                    </PrimaryButton>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Create Your Unique Bracelet?</h2>
            <p className="text-lg mb-6 opacity-90">
              Start designing today and bring your vision to life!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <PrimaryButton 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100"
                asChild
              >
                <Link href={`/${locale}/designer`}>
                  Start Designing
                </Link>
              </PrimaryButton>
              <PrimaryButton 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white hover:text-purple-600"
                asChild
              >
                <Link href={`/${locale}/bracelets`}>
                  Browse Bracelets
                </Link>
              </PrimaryButton>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}