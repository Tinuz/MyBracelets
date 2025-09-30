import { NextRequest, NextResponse } from 'next/server';
import { isValidAdminRequest } from '@/lib/admin-auth';
import { uploadToStorage, StorageType } from '@/lib/supabase/storage';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Security: Check file header/magic bytes to prevent MIME type spoofing
async function validateImageFile(file: File): Promise<boolean> {
  try {
    const buffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(buffer);
    
    // Check magic bytes for common image formats
    const jpg = uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF;
    const png = uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47;
    const webp = uint8Array[8] === 0x57 && uint8Array[9] === 0x45 && uint8Array[10] === 0x42 && uint8Array[11] === 0x50;
    
    return jpg || png || webp;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authHeader = request.headers.get('authorization');
    if (!isValidAdminRequest(authHeader)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const category = formData.get('category') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!category || !['beads', 'charms', 'bracelets', 'chains'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be beads, charms, bracelets, or chains' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      );
    }

    // Validate file type (MIME type)
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    // Validate file extension
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
      return NextResponse.json(
        { error: 'Invalid file extension. Only .jpg, .jpeg, .png, and .webp are allowed' },
        { status: 400 }
      );
    }

    // Security: Validate actual file content (magic bytes)
    const isValidImage = await validateImageFile(file);
    if (!isValidImage) {
      return NextResponse.json(
        { error: 'File content does not match image format' },
        { status: 400 }
      );
    }

    // Security: Sanitize filename to prevent path traversal
    const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    // Upload to Supabase Storage
    const imageUrl = await uploadToStorage(file, category as StorageType, sanitizedFilename);

    return NextResponse.json({
      success: true,
      imageUrl,
      filename: file.name,
      size: file.size,
      type: file.type
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}