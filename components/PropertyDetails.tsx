'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card"
import { Button } from './ui/Button'
import { Loader2, ArrowLeft, ExternalLink, Home, Bath, Expand, TrendingUp, TrendingDown, MapPin } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Link from 'next/link'

interface ShapContribution {
  feature: string
  influence: string
  value: number
  text: string
}

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
  SHAP_Contributions?: {
    positive: ShapContribution[]
    negative: ShapContribution[]
  }
}

interface CheaperLocations {
  predicted_price: string
  cheaper_locations: string[]
}

export default function PropertyDetails() {
  const [property, setProperty] = useState<Property | null>(null)
  const [cheaperLocations, setCheaperLocations] = useState<CheaperLocations | null>(null)
  const [loading, setLoading] = useState(true)
  const [cheaperLocationsLoading, setCheaperLocationsLoading] = useState(false)
  const [cheaperLocationsError, setCheaperLocationsError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const storedProperty = localStorage.getItem('selectedProperty')
    if (storedProperty) {
      const parsedProperty = JSON.parse(storedProperty)
      setProperty(parsedProperty)
      fetchCheaperLocations(parsedProperty)
    }
    setLoading(false)
  }, [])

  const fetchCheaperLocations = async (property: Property) => {
    setCheaperLocationsLoading(true)
    setCheaperLocationsError(null)
    try {
      const response = await fetch('https://ernestgaisie--house-prediction-fastapi-app-fastapi-app.modal.run/suggest-cheaper-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Bedrooms: parseInt(property.Bedrooms),
          Bathrooms: parseInt(property.Bathrooms),
          Location: property.Location,
          Province_City: `Ontario_Toronto`,
          Type: property.Title.includes('House') ? 'House' : 'Condo',
        }),
      })
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
      }
      const data = await response.json()
      setCheaperLocations(data)
    } catch (error) {
      console.error('Error fetching cheaper locations:', error)
      setCheaperLocationsError(error instanceof Error ? error.message : 'An unknown error occurred')
    } finally {
      setCheaperLocationsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!property) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Property Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p>The requested property could not be found.</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </CardContent>
      </Card>
    )
  }

  const shapData = property.SHAP_Contributions
    ? [
        ...(property.SHAP_Contributions.positive || []).map(item => ({ ...item, value: Math.abs(item.value) })),
        ...(property.SHAP_Contributions.negative || []).map(item => ({ ...item, value: Math.abs(item.value) }))
      ].sort((a, b) => b.value - a.value)
    : [];

  const randomCheaperLocations = cheaperLocations?.cheaper_locations
    .sort(() => 0.5 - Math.random())
    .slice(0, 10);

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{property.Title}</CardTitle>
        <CardDescription>{property.Location}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-bold text-3xl text-primary mb-2">${property.Price.toLocaleString()}</p>
            <p className="text-gray-600 line-clamp-3">{property.Description}</p>
          </div>
          <div className="flex flex-col justify-between">
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
            <Button asChild className="mt-4">
              <Link href={property.Link} target="_blank" rel="noopener noreferrer">
                View External Listing <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        {shapData.length > 0 && (
          <div className="space-y-6">
            <h3 className="font-bold text-xl mb-4">Price Influencing Factors</h3>
            <div className="h-96 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={shapData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="feature" type="category" width={150} />
                  <Tooltip 
                    formatter={(value: number) => `$${Math.abs(value).toLocaleString()}`}
                    labelFormatter={(label: string) => `Feature: ${label}`}
                  />
                  <Bar
                    dataKey="value"
                    fill="#4ade80"
                  />
                  {shapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.influence === 'negative' ? '#4ade80' : '#f87171'} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Detailed Influence Breakdown:</h4>
              <div className="space-y-2">
                {property.SHAP_Contributions?.negative.map((item, index) => (
                  <div key={`positive-${index}`} className="flex items-center text-green-600">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <span>{item.text.replace("reduced", "increased")}</span>
                  </div>
                ))}
                {property.SHAP_Contributions?.positive.map((item, index) => (
                  <div key={`negative-${index}`} className="flex items-center text-red-600">
                    <TrendingDown className="h-4 w-4 mr-2" />
                    <span>{item.text.replace("increased", "reduced")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <h3 className="font-bold text-xl">Suggested Cheaper Locations</h3>
          {cheaperLocationsLoading ? (
            <div className="flex justify-center items-center h-24">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : cheaperLocationsError ? (
            <p className="text-red-500">{cheaperLocationsError}</p>
          ) : cheaperLocations ? (
            <>
              <p className="text-gray-600">
                Based on your search, here are some potentially more affordable areas to consider:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {cheaperLocations.cheaper_locations.map((location, index) => (
                  <div key={index} className="bg-secondary text-secondary-foreground rounded-md p-2 flex items-center justify-start text-start">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{location}</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                Predicted price for similar properties in these areas: {cheaperLocations.predicted_price}
              </p>
            </>
          ) : (
            <p className="text-gray-600">No cheaper locations found for this property.</p>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

