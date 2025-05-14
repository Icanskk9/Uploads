'use client'

import { useCallback, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { UploadCloud, ImageIcon, File } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [url, setUrl] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0]
    setFile(selectedFile)
    setPreview(URL.createObjectURL(selectedFile))
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  })

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage.from('files').upload(fileName, file)
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
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-xl text-center">
        <h1 className="text-2xl font-bold text-gray-700 mb-6">Upload File</h1>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 transition-all ${
            isDragActive ? 'border-pink-500 bg-pink-100' : 'border-pink-300 bg-white'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto text-pink-400 mb-2" size={44} />
          <p className="text-sm text-gray-600 mb-1">
            {isDragActive ? 'Lepaskan file untuk mengunggah' : 'Drag & drop file di sini'}
          </p>
          <p className="text-pink-500 font-semibold cursor-pointer">atau klik untuk pilih file</p>
        </div>

        {preview && (
          <div className="mt-4">
            <p className="text-gray-700 font-medium mb-1">Preview:</p>
            {file?.type.startsWith('image') ? (
              <img
                src={preview}
                alt="preview"
                className="mx-auto h-40 object-contain rounded-xl border"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <File size={48} />
                <p className="mt-2 text-sm">{file.name}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className="mt-6 bg-pink-400 hover:bg-pink-500 text-white px-6 py-2 rounded-full transition disabled:opacity-50"
        >
          {uploading ? 'Mengunggah...' : 'Upload'}
        </button>

        {url && (
          <div className="mt-4 text-sm text-gray-700">
            ✅ Berhasil diupload! <br />
            <a
              href={url}
              className="text-pink-600 underline break-all"
              target="_blank"
              rel="noopener noreferrer"
            >
              {url}
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
