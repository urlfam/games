import CategorySidebarServer from '@/components/CategorySidebarServer';

export default function TagLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900">
      <CategorySidebarServer />
      <main className="pl-0 md:pl-16 transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
