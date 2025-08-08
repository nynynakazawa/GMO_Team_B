import SidebarNavigation from '../../components/nomal/SidebarNavigation';

export default function NormalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <SidebarNavigation />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}