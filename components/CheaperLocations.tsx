'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

interface CheaperLocationsData {
  predicted_price: string
  cheaper_locations: string[]
}

export default function CheaperLocations() {
  const [data, setData] = useState<CheaperLocationsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCheaperLocations = async () => {
      try {
        const response = await fetch('/api/suggest-cheaper-locations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            // You would typically get these values from the search form or app state
            Bedrooms: 3,
            Bathrooms: 2,
            Location: 'Toronto',
            Province_City: 'Ontario_Toronto',
            Type: 'House'
          })
        })
        const data = await response.json()
        if (response.ok) {
          setData(data)
        } else {
          throw new Error(data.message || 'Failed to fetch cheaper locations')
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCheaperLocations()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return null

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Cheaper Location Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Predicted price: {data.predicted_price}</p>
        <h3 className="font-semibold mb-2">Cheaper Locations:</h3>
        <ul className="list-disc list-inside">
          {data.cheaper_locations.map((location, index) => (
            <li key={index}>{location}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

