import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Initialize Supabase client directly in script
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
})

const prisma = new PrismaClient()

interface MigrationItem {
  id: string
  imageUrl: string | null
  table: 'charms' | 'beads' | 'chains' | 'baseBracelets'
}

async function uploadLocalFileToStorage(localPath: string, storagePath: string): Promise<string | null> {
  try {
    const fullPath = join(process.cwd(), 'public', localPath)
    
    if (!existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`)
      return null
    }

    const fileBuffer = readFileSync(fullPath)
    const file = new File([fileBuffer], storagePath.split('/').pop() || 'unknown.png')
    
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) {
      console.error(`Upload error for ${localPath}:`, error)
      return null
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(storagePath)

    console.log(`✓ Uploaded: ${localPath} → ${publicUrl}`)
    return publicUrl
  } catch (error) {
    console.error(`Error processing ${localPath}:`, error)
    return null
  }
}

async function migrateImages() {
  console.log('🚀 Starting image migration to Supabase Storage...\n')

  // Get all records with local image URLs
  const charms = await prisma.charm.findMany({
    where: {
      imageUrl: {
        startsWith: '/uploads/'
      }
    },
    select: { id: true, imageUrl: true }
  })

  const beads = await prisma.bead.findMany({
    where: {
      imageUrl: {
        startsWith: '/uploads/'
      }
    },
    select: { id: true, imageUrl: true }
  })

  const chains = await prisma.chain.findMany({
    where: {
      imageUrl: {
        startsWith: '/uploads/'
      }
    },
    select: { id: true, imageUrl: true }
  })

  const bracelets = await prisma.baseBracelet.findMany({
    where: {
      OR: [
        { imageUrl: { startsWith: '/uploads/' } },
        { imageUrl2: { startsWith: '/uploads/' } },
        { imageUrl3: { startsWith: '/uploads/' } }
      ]
    },
    select: { id: true, imageUrl: true, imageUrl2: true, imageUrl3: true }
  })

  console.log(`Found items to migrate:`)
  console.log(`- Charms: ${charms.length}`)
  console.log(`- Beads: ${beads.length}`)
  console.log(`- Chains: ${chains.length}`)
  console.log(`- Bracelets: ${bracelets.length}`)
  console.log('')

  // Migrate charms
  for (const charm of charms) {
    if (!charm.imageUrl) continue
    
    const storagePath = charm.imageUrl.replace('/uploads/', '')
    const newUrl = await uploadLocalFileToStorage(charm.imageUrl, storagePath)
    
    if (newUrl) {
      await prisma.charm.update({
        where: { id: charm.id },
        data: { imageUrl: newUrl }
      })
      console.log(`✓ Updated charm ${charm.id}`)
    }
  }

  // Migrate beads
  for (const bead of beads) {
    if (!bead.imageUrl) continue
    
    const storagePath = bead.imageUrl.replace('/uploads/', '')
    const newUrl = await uploadLocalFileToStorage(bead.imageUrl, storagePath)
    
    if (newUrl) {
      await prisma.bead.update({
        where: { id: bead.id },
        data: { imageUrl: newUrl }
      })
      console.log(`✓ Updated bead ${bead.id}`)
    }
  }

  // Migrate chains
  for (const chain of chains) {
    if (!chain.imageUrl) continue
    
    const storagePath = chain.imageUrl.replace('/uploads/', '')
    const newUrl = await uploadLocalFileToStorage(chain.imageUrl, storagePath)
    
    if (newUrl) {
      await prisma.chain.update({
        where: { id: chain.id },
        data: { imageUrl: newUrl }
      })
      console.log(`✓ Updated chain ${chain.id}`)
    }
  }

  // Migrate bracelets (multiple image fields)
  for (const bracelet of bracelets) {
    const updates: any = {}

    if (bracelet.imageUrl?.startsWith('/uploads/')) {
      const storagePath = bracelet.imageUrl.replace('/uploads/', '')
      const newUrl = await uploadLocalFileToStorage(bracelet.imageUrl, storagePath)
      if (newUrl) updates.imageUrl = newUrl
    }

    if (bracelet.imageUrl2?.startsWith('/uploads/')) {
      const storagePath = bracelet.imageUrl2.replace('/uploads/', '')
      const newUrl = await uploadLocalFileToStorage(bracelet.imageUrl2, storagePath)
      if (newUrl) updates.imageUrl2 = newUrl
    }

    if (bracelet.imageUrl3?.startsWith('/uploads/')) {
      const storagePath = bracelet.imageUrl3.replace('/uploads/', '')
      const newUrl = await uploadLocalFileToStorage(bracelet.imageUrl3, storagePath)
      if (newUrl) updates.imageUrl3 = newUrl
    }

    if (Object.keys(updates).length > 0) {
      await prisma.baseBracelet.update({
        where: { id: bracelet.id },
        data: updates
      })
      console.log(`✓ Updated bracelet ${bracelet.id}`)
    }
  }

  console.log('\n✅ Migration completed!')
}

// Run migration
// Check if this file is being run directly (ES module way)
const isMainModule = import.meta.url === `file://${process.argv[1]}`

if (isMainModule) {
  migrateImages()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
}

export { migrateImages }