import { Logo } from './Logo';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo />
      </div>
      <div className="w-full max-w-[min(calc(100vw-2rem),24rem)]">
        {children}
      </div>
    </div>
  );
}