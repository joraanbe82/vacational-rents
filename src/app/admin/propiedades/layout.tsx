import AdminLayoutContent from '@/components/admin/AdminLayoutContent'

export default function PropiedadesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayoutContent>
      {children}
    </AdminLayoutContent>
  )
}
