'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function DownloadPage() {
  const [publicUrl, setPublicUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchUrl = async () => {
      const { data } = supabase
        .storage
        .from('uploads') 
        .getPublicUrl('materidownload.pdf') 
      setPublicUrl(data?.publicUrl || null)
    }

    fetchUrl()
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-white text-center p-6">
      <h1 className="text-4xl font-bold text-pink-600 mb-4">Download File</h1>
      <p className="text-gray-700 mb-8">
        Klik tombol di bawah untuk mengunduh file .
      </p>

      {publicUrl ? (
        <a
          href={publicUrl}
          download
          className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-xl transition"
        >
          Download pdf
        </a>
      ) : (
        <p className="text-sm text-gray-500">Memuat URL file...</p>
      )}
    </main>
  )
}
