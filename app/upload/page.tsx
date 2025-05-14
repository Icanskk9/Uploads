'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { UploadCloud } from 'lucide-react'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UploadPage() {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState<string | null>(null)

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)

    const fileName = `${Date.now()}-${file.name}`
    const { data, error } = await supabase.storage
      .from('uploads') // ganti sesuai nama bucket
      .upload(fileName, file)

    if (error) {
      alert('Upload gagal: ' + error.message)
      setUploading(false)
      return
    }

    const { data: publicUrl } = supabase.storage.from('files').getPublicUrl(fileName)
    setUrl(publicUrl.publicUrl)
    setUploading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload File</h2>

        <div className="border-2 border-dashed border-pink-300 p-6 rounded-lg mb-4">
          <UploadCloud className="mx-auto mb-2 text-pink-400" size={48} />
          <p className="text-sm text-gray-500 mb-1">Drag & drop untuk upload</p>
          <label className="text-pink-500 font-medium cursor-pointer">
            atau pilih file
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="mt-2 bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-full disabled:opacity-50"
        >
          {uploading ? 'Mengunggah...' : 'Upload'}
        </button>

        {url && (
          <div className="mt-4 text-sm text-gray-700">
            ✅ Berhasil diupload! <br />
            <a href={url} className="text-pink-600 underline break-all" target="_blank">
              {url}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
