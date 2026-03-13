import AdminLayoutContent from '@/components/admin/AdminLayoutContent'

export default function AdminLayout({
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
