import dynamic from 'next/dynamic'

// Dynamically import the Designer component to avoid SSR issues with SVG manipulation
const Designer = dynamic(() => import('@/components/designer/Designer'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  )
})

interface PageProps {
  params: {
    slug: string
  }
}

export default function DesignerPage({ params }: PageProps) {
  return <Designer braceletSlug={params.slug} />
}

// Generate static paths for known bracelet slugs
export async function generateStaticParams() {
  // In production, this would fetch from your database
  // For MVP, we'll use hardcoded slugs
  return [
    { slug: 'classic' },
    { slug: 'elegant' },
  ]
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const braceletNames: Record<string, string> = {
    classic: 'Classic Silver',
    elegant: 'Elegant Gold',
  }
  
  const name = braceletNames[params.slug] || 'Custom'
  
  return {
    title: `Design Your ${name} Bracelet - La Nina Bracelets`,
    description: `Create a unique ${name} bracelet with our interactive charm placement designer. Drag and drop charms to create something truly special.`,
  }
}