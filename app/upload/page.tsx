'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { motion } from 'framer-motion'
import { UploadCloud, FileText } from 'lucide-react'

export default function UploadPage() {
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

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
    setLoading(true)
    const file = files[0]
    const { error } = await supabase.storage.from('uploads').upload(file.name, file, {
      cacheControl: '3600',
      upsert: false,
    })
    setLoading(false)
    if (!error) {
      alert('✅ Upload berhasil!')
      fetchFiles()
    } else {
      alert('❌ Upload gagal: ' + error.message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex flex-col items-center p-6">
      <motion.div
        className="max-w-xl w-full text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-4xl font-bold mb-2">📂 Upload File</h1>
        <p className="text-gray-400 mb-6">Unggah file kamu dan dapatkan link download-nya!</p>
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            className="mb-4 w-full text-sm text-gray-300 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded file:border-none"
          />
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UploadCloud size={20} />
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </motion.div>

      <motion.div
        className="w-full max-w-2xl mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold mb-4 border-b border-gray-700 pb-2">📁 File Terupload</h2>
        {uploadedFiles.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada file diunggah.</p>
        ) : (
          <ul className="space-y-3">
            {uploadedFiles.map((file) => (
              <li key={file.name} className="bg-gray-800 p-3 rounded-lg flex items-center gap-3">
                <FileText size={20} className="text-blue-400" />
                <a
                  href={`https://eizticltmueldtlzrjsk.supabase.co/storage/v1/object/public/uploads/${file.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline break-all"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </motion.div>
    </main>
  )
}
