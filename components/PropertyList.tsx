'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/Card"
import { Button } from "./ui/Button"
import { Badge } from "./ui/Badge"
import { useRouter } from 'next/navigation'
import { Loader2, Home, Bath, Expand } from 'lucide-react'

interface Property {
  _id: string
  Title: string
  Price: number
  Location: string
  Description: string
  Link: string
  Bedrooms: string
  Bathrooms: string
  'Size (sqft)': string
  SHAP_Contributions: {
    positive: Array<{ feature: string; influence: string; value: number; text: string }>
    negative: Array<{ feature: string; influence: string; value: number; text: string }>
  }
}

interface UserDetails {
  Bedrooms: string
  Bathrooms: string
  Location: string
  Type: string
}

interface PropertyListProps {
  userDetails: UserDetails
}

export default function PropertyList({ userDetails }: PropertyListProps) {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('https://ernestgaisie--house-prediction-fastapi-app-fastapi-app.modal.run/listings-below-prediction', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            Bedrooms: parseInt(userDetails.Bedrooms),
            Bathrooms: parseInt(userDetails.Bathrooms),
            Location: userDetails.Location,
            Province_City: `Ontario_Toronto`,
            Type: userDetails.Type
          })
        })
        const data = await response.json()
        if (response.ok) {
          setProperties(data.listings_below_prediction)
        } else {
          throw new Error(data.message || 'Failed to fetch properties')
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [userDetails])

  const handleViewDetails = (property: Property) => {
    localStorage.setItem('selectedProperty', JSON.stringify({
      ...property,
      SHAP_Contributions: property.SHAP_Contributions
    }))
    router.push(`/property/${property._id}`)
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
  if (error) return <div className="text-center text-red-500">{error}</div>

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card key={property._id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <CardTitle className="line-clamp-2">{property.Title}</CardTitle>
              <CardDescription>{property.Location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="font-bold text-2xl text-primary mb-4">${property.Price.toLocaleString()}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{property.Description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  <span>{property.Bedrooms} bd</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.Bathrooms} ba</span>
                </div>
                <div className="flex items-center">
                  <Expand className="h-4 w-4 mr-1" />
                  <span>{property['Size (sqft)']} sqft</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <Badge variant="secondary">{userDetails.Type}</Badge>
              <Button onClick={() => handleViewDetails(property)}>View Details</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {properties.length === 0 && !loading && !error && (
        <p className="text-center text-gray-500">No properties found matching your criteria.</p>
      )}
    </div>
  )
}

