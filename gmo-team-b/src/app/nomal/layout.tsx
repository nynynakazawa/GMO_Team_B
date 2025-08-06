

export default function NormalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex' }}>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}