import './globals.css'
import { Inter } from 'next/font/google'
import Layout from '../components/Layout'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'House Prediction App',
  description: 'Find your dream home with AI-powered predictions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full`}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
  )
}

