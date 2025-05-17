'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

type FileItem = {
  name: string
  path: string
  publicUrl: string | null
}

const fileList: { name: string; path: string }[] = [
  { name: 'MateriRouting OSPF', path: 'materidownload.pdf' },
  { name: 'Logo SMK', path: 'picture1.jpg' },
  { name: 'Materi DJK', path: 'materidownload1.pdf' },
]

export default function DownloadPage() {
  const [files, setFiles] = useState<FileItem[]>([])

  useEffect(() => {
    const fetchUrls = async () => {
      const fetchedFiles: FileItem[] = fileList.map((file) => {
        const { data } = supabase
          .storage
          .from('uploads')
          .getPublicUrl(file.path)

        return {
          name: file.name,
          path: file.path,
          publicUrl: data?.publicUrl || null,
        }
      })
      setFiles(fetchedFiles)
    }

    fetchUrls()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 to-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-pink-600 mb-6">Unduh Materi</h1>
      <p className="text-gray-600 mb-8 text-center">Silakan pilih file yang ingin diunduh:</p>

      <div className="grid gap-4 w-full max-w-md">
        {files.map((file) => (
          <div
            key={file.path}
            className="bg-white shadow-md rounded-xl p-4 flex justify-between items-center border border-pink-200"
          >
            <span className="text-gray-800">{file.name}</span>
            {file.publicUrl ? (
              <a
                href={file.publicUrl}
                download
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Download
              </a>
            ) : (
              <span className="text-gray-400 text-sm">Memuat...</span>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
