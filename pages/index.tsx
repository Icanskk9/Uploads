import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const uploadFile = async () => {
    if (!file) return alert('Pilih file dulu!');
    const { data, error } = await supabase.storage
      .from('uploads') // Bucket name
      .upload(`user_uploads/${file.name}`, file);

    if (error) alert(`Upload gagal: ${error.message}`);
    else alert('✅ Upload berhasil!');
  };

  return (
    <div className="p-4">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={uploadFile} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
        Upload
      </button>
    </div>
  );
}
