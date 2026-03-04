import AdminLayoutContent from '@/components/admin/AdminLayoutContent'

export default function DashboardLayout({
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
