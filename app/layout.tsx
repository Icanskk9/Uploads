export const metadata = {
  title: 'File Upload',
  description: 'Situs unggah file Tugas',
};

export default function RootLayout({ childsren }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
