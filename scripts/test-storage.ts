// Test script to verify Supabase Storage is working
import { config } from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

console.log('🔍 Environment check:')
console.log('   Supabase URL:', supabaseUrl ? '✅ Found' : '❌ Missing')
console.log('   Service Key:', supabaseServiceKey ? '✅ Found' : '❌ Missing')

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
})

async function testStorageConnection() {
  try {
    console.log('🔗 Testing Supabase Storage connection...')
    
    // Test if we can access the storage
    const { data: buckets, error } = await supabaseAdmin.storage.listBuckets()
    
    if (error) {
      console.error('❌ Storage connection failed:', error)
      return false
    }
    
    console.log('✅ Connected to Supabase Storage')
    console.log('📦 Available buckets:', buckets.map(b => b.name))
    
    // Check if 'images' bucket exists
    const imagesBucket = buckets.find(b => b.name === 'images')
    if (imagesBucket) {
      console.log('✅ Images bucket found and accessible')
      
      // List files in images bucket
      const { data: files, error: listError } = await supabaseAdmin.storage
        .from('images')
        .list('', { limit: 5 })
        
      if (listError) {
        console.error('❌ Error listing files:', listError)
      } else {
        console.log(`📁 Found ${files.length} items in images bucket`)
      }
    } else {
      console.log('⚠️  Images bucket not found - you need to create it in Supabase dashboard')
    }
    
    return true
  } catch (error) {
    console.error('❌ Storage test failed:', error)
    return false
  }
}

// Run test
testStorageConnection()
  .then(success => {
    if (success) {
      console.log('\n🎉 Supabase Storage is ready to use!')
      console.log('💡 Next steps:')
      console.log('   1. Create "images" bucket if not exists')
      console.log('   2. Make bucket public')
      console.log('   3. Create folders: charms/, beads/, bracelets/, chains/')
    }
    process.exit(success ? 0 : 1)
  })