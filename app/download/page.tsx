'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function DownloadPage() {
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUrl = async () => {
      const { data, error } = await supabase
        .storage
        .from('files')
        .getPublicUrl('ROUTINGBGP.pdf') 

      if (error) {
        console.error('Error fetching download URL:', error)
      } else {
        setDownloadUrl(data.publicUrl)
      }
      setLoading(false)
    }

    fetchUrl()
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Download File</h1>
      {loading ? (
        <p>Loading...</p>
      ) : downloadUrl ? (
        <a
          href={downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition"
        >
          Download Now
        </a>
      ) : (
        <p>File not found.</p>
      )}
    </main>
  )
}
