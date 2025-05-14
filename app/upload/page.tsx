'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { UploadCloud, FileText } from 'lucide-react'

export default function UploadPage() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])

  useEffect(() => {
    fetchFiles()
  }, [])

  async function fetchFiles() {
    const { data, error } = await supabase.storage.from('uploads').list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' },
    })
    if (!error) setUploadedFiles(data)
  }

  async function handleUpload() {
    if (!files) return
    const file = files[0]
    const { data, error } = await supabase.storage.from('uploads').upload(file.name, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (!error) {
      fetchFiles()
      setFiles(null)
    } else {
      alert('Upload gagal: ' + error.message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-tr from-sky-100 via-white to-indigo-100 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <UploadCloud className="w-8 h-8 text-blue-600" />
          Upload File
        </h1>
        <p className="text-gray-500 mb-6">Unggah file kamu dan langsung dapatkan link unduh-nya!</p>

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            className="file:px-4 file:py-2 file:rounded-lg file:border-0 file:text-white file:bg-blue-600 file:cursor-pointer hover:file:bg-blue-700 transition-all"
          />
          <button
            onClick={handleUpload}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all shadow"
          >
            Upload
          </button>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-green-600" />
          Daftar File Terupload
        </h2>

        {uploadedFiles.length === 0 ? (
          <p className="text-gray-400 italic">Belum ada file diunggah.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {uploadedFiles.map((file) => (
              <a
                key={file.name}
                href={`https://eizticltmueldtlzrjsk.supabase.co/storage/v1/object/public/uploads/${file.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition"
              >
                <div className="text-gray-800 font-medium">{file.name}</div>
                <div className="text-blue-600 text-sm">Klik untuk unduh</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
