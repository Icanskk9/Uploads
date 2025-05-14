'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { CloudUpload } from 'lucide-react'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)

    const { error } = await supabase.storage
      .from('uploads')
      .upload(file.name, file)

    setUploading(false)

    if (!error) {
      alert('Upload berhasil!')
      setFile(null)
    } else {
      alert('Upload gagal: ' + error.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-pink-50 px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
        <h1 className="text-xl font-semibold mb-4">Upload shot</h1>

        <div className="flex space-x-4 mb-6 text-pink-500">
          <div className="text-center text-sm">
            <p>🖼️<br />Images<br /><span className="text-xs">PNG, JPG, GIF</span></p>
          </div>
          <div className="text-center text-sm">
            <p>🎞️<br />GIFs<br /><span className="text-xs">800x600</span></p>
          </div>
          <div className="text-center text-sm">
            <p>🎥<br />Videos<br /><span className="text-xs">MP4, 4:3</span></p>
          </div>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 ${
            dragging ? 'border-pink-500' : 'border-pink-300'
          } border-dashed rounded-lg flex flex-col items-center justify-center p-10 text-center transition-all mb-4`}
        >
          <CloudUpload className="w-12 h-12 text-pink-400 mb-2" />
          <p className="font-medium">Drag & drop to upload</p>
          <p className="text-sm text-pink-500">or <label htmlFor="file" className="cursor-pointer underline">browse</label></p>
          <input
            id="file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
        </div>

        <button
          disabled={!file || uploading}
          onClick={handleUpload}
          className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </button>

        <p className="text-xs text-center text-gray-500 mt-4">
          48 uploads remaining this month. Please read our <a href="#" className="text-pink-500 underline">Community Guidelines</a> before uploading.
        </p>
      </div>
    </div>
  )
}
