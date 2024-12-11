'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Select } from './ui/Select'

const locations = [
  { value: "Vancouver", label: "Vancouver" },
  { value: "Toronto", label: "Toronto" },
  { value: "Montreal", label: "Montreal" },
  { value: "Calgary", label: "Calgary" },
  { value: "Ottawa", label: "Ottawa" },
  { value: "Edmonton", label: "Edmonton" },
  { value: "Winnipeg", label: "Winnipeg" },
  { value: "Quebec City", label: "Quebec City" },
  { value: "Hamilton", label: "Hamilton" },
  { value: "Halifax", label: "Halifax" }
]

const propertyTypes = [
  { value: "Condo", label: "Condo" },
  { value: "House", label: "House" },
  { value: "Townhouse", label: "Townhouse" }
]

export default function SignupForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    Name: '',
    Phone_Number: '',
    Type: '',
    Bedrooms: '',
    Bathrooms: '',
    Location: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('https://ernestgaisie--house-prediction-fastapi-app-fastapi-app.modal.run/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await response.json()
      if (response.ok) {
        localStorage.setItem('user_id', data.user_id)
        localStorage.setItem('user_details', JSON.stringify(formData))
        alert("User created successfully")
        router.push('/listings')
      } else {
        throw new Error(data.message || 'Something went wrong')
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <Input
        label="Name"
        id="Name"
        name="Name"
        type="text"
        value={formData.Name}
        onChange={handleChange}
        required
      />
      <Input
        label="Phone Number"
        id="Phone_Number"
        name="Phone_Number"
        type="tel"
        value={formData.Phone_Number}
        onChange={handleChange}
        required
      />
      <Select
        label="Property Type"
        id="Type"
        name="Type"
        value={formData.Type}
        onChange={handleChange}
        options={propertyTypes}
        required
      />
      <Input
        label="Bedrooms"
        id="Bedrooms"
        name="Bedrooms"
        type="number"
        value={formData.Bedrooms}
        onChange={handleChange}
        required
      />
      <Input
        label="Bathrooms"
        id="Bathrooms"
        name="Bathrooms"
        type="number"
        value={formData.Bathrooms}
        onChange={handleChange}
        required
      />
      <Select
        label="Location"
        id="Location"
        name="Location"
        value={formData.Location}
        onChange={handleChange}
        options={locations}
        required
      />
      <Button type="submit" isLoading={isLoading}>
        Sign Up
      </Button>
    </form>
  )
}

