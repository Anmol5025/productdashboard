'use client';

import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { LogOut, Package2 } from 'lucide-react';
import Link from 'next/link';

import { ProductsProvider } from '@/lib/ProductsContext';

import { logoutAction } from '@/app/actions';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    // Let the Server Action handle deleting the cookie.
    // If we delete it here, the POST request to trigger the Server Action
    // will lack the token, causing Middleware to intercept it with a 307 redirect
    // which breaks the Next.js Server Action JSON protocol.
    await logoutAction();
  };

  return (
    <ProductsProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm sticky top-0 z-10 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link href="/products" className="flex items-center gap-2 text-blue-600 font-extrabold text-xl tracking-tight">
                    <Package2 className="h-7 w-7" />
                    <span>InventoryPro</span>
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2">
                  <img src="https://dummyjson.com/icon/emilys/128" alt="Profile" className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200" />
                  <span className="text-sm font-medium text-gray-700">Emily J.</span>
                </div>
                <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 border border-gray-200 text-sm font-medium rounded-lg text-gray-600 bg-white hover:bg-gray-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all shadow-sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ProductsProvider>
  );
}
