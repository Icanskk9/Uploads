'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const files = ['materidownload.pdf', 'materidownload1.pdf', 'picture1.jpg']

export default function DownloadPage() {
  const [urls, setUrls] = useState<{ name: string, url: string }[]>([])

  useEffect(() => {
    const fetchUrls = async () => {
      const links = files.map(file => {
        const { data } = supabase.storage.from('uploads').getPublicUrl(file)
        return { name: file, url: data.publicUrl }
      })
      setUrls(links)
    }
    fetchUrls()
  }, [])

  return (
    <div className="min-h-screen bg-secondary p-10 text-center">
      <h1 className="text-3xl font-bold text-primary mb-6">Download Files</h1>
      <ul className="space-y-4">
        {urls.map(({ name, url }) => (
          <li key={name}>
            <a href={url} download className="text-white bg-primary hover:bg-pink-600 px-6 py-3 rounded-xl inline-block shadow">
              Download {name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
