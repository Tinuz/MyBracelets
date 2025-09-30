import { supabase, supabaseAdmin } from './client'

export type StorageType = 'charms' | 'bracelets' | 'beads' | 'chains'

/**
 * Upload a file to Supabase Storage
 * @param file - The file to upload
 * @param type - The storage bucket type
 * @param fileName - Optional custom filename
 * @returns The public URL of the uploaded file
 */
export async function uploadToStorage(
  file: File,
  type: StorageType,
  fileName?: string
): Promise<string> {
  try {
    // Generate unique filename if not provided
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const finalFileName = fileName || `${timestamp}-${randomString}.${fileExtension}`
    
    // Upload file to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('images')
      .upload(`${type}/${finalFileName}`, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      throw new Error(`Failed to upload file: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('images')
      .getPublicUrl(`${type}/${finalFileName}`)

    return publicUrl
  } catch (error) {
    console.error('Storage upload error:', error)
    throw error
  }
}

/**
 * Delete a file from Supabase Storage
 * @param path - The path to the file in storage
 * @returns Success boolean
 */
export async function deleteFromStorage(path: string): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.storage
      .from('images')
      .remove([path])

    if (error) {
      console.error('Delete error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Storage delete error:', error)
    return false
  }
}

/**
 * Get public URL for a file in storage
 * @param path - The path to the file
 * @returns The public URL
 */
export function getStorageUrl(path: string): string {
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(path)
  
  return data.publicUrl
}

/**
 * Extract storage path from URL
 * @param url - The full storage URL
 * @returns The path within the storage bucket
 */
export function extractStoragePath(url: string): string | null {
  try {
    const urlObj = new URL(url)
    // Extract path after /storage/v1/object/public/images/
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/images\/(.+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}