'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { UploadCloud, Folder } from 'lucide-react'

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
      alert('Upload berhasil!')
      fetchFiles()
    } else {
      alert('Upload gagal: ' + error.message)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center mb-2">
          <Folder className="mr-2 text-yellow-500" /> Upload File
        </h1>
        <p className="text-gray-600 mb-6">Unggah file kamu dan dapatkan link download-nya!</p>

        <div className="flex items-center space-x-4 mb-6">
          <input
            type="file"
            onChange={(e) => setFiles(e.target.files)}
            className="flex-grow border rounded px-4 py-2 text-sm"
          />
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center px-4 py-2 rounded shadow"
          >
            <UploadCloud className="w-5 h-5 mr-2" />
            Upload
          </button>
        </div>

        <h2 className="text-xl font-semibold flex items-center text-gray-700 mb-3">
          <Folder className="mr-2 text-green-500" />
          File Terupload
        </h2>

        {uploadedFiles.length === 0 ? (
          <p className="text-gray-500 italic">Belum ada file diunggah.</p>
        ) : (
          <ul className="space-y-2">
            {uploadedFiles.map((file) => (
              <li key={file.name} className="bg-gray-100 p-3 rounded shadow hover:bg-gray-200">
                <a
                  href={`https://eizticltmueldtlzrjsk.supabase.co/storage/v1/object/public/uploads/${file.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {file.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
