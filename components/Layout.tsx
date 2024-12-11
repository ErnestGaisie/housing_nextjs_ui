import Link from 'next/link'
import { Home, List } from 'lucide-react'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary flex items-center">
            <Home className="mr-2" />
            House Prediction App
          </Link>
          <nav>
            <Link href="/" className="mr-4 hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/listings" className="hover:text-primary transition-colors flex items-center">
              <List className="mr-1" />
              Listings
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white border-t">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          © {new Date().getFullYear()} House Prediction App. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

