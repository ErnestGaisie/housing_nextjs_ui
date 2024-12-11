'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import PropertyList from './PropertyList'
import { Loader2 } from 'lucide-react'

interface UserDetails {
  Bedrooms: string
  Bathrooms: string
  Location: string
  Type: string
}

export default function ListingsPage() {
  const router = useRouter()
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)

  useEffect(() => {
    const storedDetails = localStorage.getItem('user_details')
    if (storedDetails) {
      setUserDetails(JSON.parse(storedDetails))
    } else {
      router.push('/')
    }
  }, [router])

  if (!userDetails) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Property Listings</h1>
        <p className="text-gray-600">
          Showing results for: {userDetails.Bedrooms} bd, {userDetails.Bathrooms} ba, {userDetails.Type} in {userDetails.Location}
        </p>
      </div>
      <PropertyList userDetails={userDetails} />
    </div>
  )
}

