export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <p className="animate-pulse">Verifying…</p>
      {children}
    </main>
  )
}
