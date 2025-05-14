'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
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
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">Upload File</h1>
      <input type="file" onChange={(e) => setFiles(e.target.files)} className="mb-2" />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
      >
        Upload
      </button>
      <h2 className="text-xl font-semibold mb-2">Files</h2>
      <ul className="w-full max-w-md space-y-2">
        {uploadedFiles.map((file) => (
          <li key={file.name}>
            <a
              href={`https://eizticltmueldtlzrjsk.supabase.co/storage/v1/object/public/uploads/${file.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              {file.name}
            </a>
          </li>
        ))}
      </ul>
    </main>
  )
}

