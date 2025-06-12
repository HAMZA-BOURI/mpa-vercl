'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Car, Calendar, Gauge, Hash } from 'lucide-react'

interface VehiculeFormData {
  immatriculation: string
  marque: string
  modele: string
  annee: number
  numeroSerie: string
  kilometrage: number | null
  clientId: string
}

interface Client {
  id: string
  nom: string
  prenom: string
  numeroClient: string
}

interface VehiculeFormProps {
  onSubmit: (data: VehiculeFormData) => void
  onCancel: () => void
  clients: Client[]
  isLoading?: boolean
}

export function VehiculeForm({ onSubmit, onCancel, clients, isLoading = false }: VehiculeFormProps) {
  const [formData, setFormData] = useState<VehiculeFormData>({
    immatriculation: '',
    marque: '',
    modele: '',
    annee: new Date().getFullYear(),
    numeroSerie: '',
    kilometrage: null,
    clientId: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof VehiculeFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof VehiculeFormData, string>> = {}

    if (!formData.immatriculation.trim()) {
      newErrors.immatriculation = 'L\'immatriculation est requise'
    } else if (!/^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/.test(formData.immatriculation)) {
      newErrors.immatriculation = 'Format invalide (ex: AB-123-CD)'
    }

    if (!formData.marque.trim()) newErrors.marque = 'La marque est requise'
    if (!formData.modele.trim()) newErrors.modele = 'Le modèle est requis'
    if (!formData.annee || formData.annee < 1900 || formData.annee > new Date().getFullYear() + 1) {
      newErrors.annee = 'Année invalide'
    }
    if (!formData.clientId) newErrors.clientId = 'Le client est requis'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof VehiculeFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const formatImmatriculation = (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Z0-9]/g, '').toUpperCase()
    
    // Format as XX-XXX-XX
    if (cleaned.length <= 2) return cleaned
    if (cleaned.length <= 5) return `${cleaned.slice(0, 2)}-${cleaned.slice(2)}`
    return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(5, 7)}`
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations Véhicule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Car className="h-5 w-5" />
            <span>Informations du Véhicule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="immatriculation">Immatriculation *</Label>
            <Input
              id="immatriculation"
              value={formData.immatriculation}
              onChange={(e) => {
                const formatted = formatImmatriculation(e.target.value)
                handleInputChange('immatriculation', formatted)
              }}
              placeholder="AB-123-CD"
              maxLength={9}
              className={`font-mono ${errors.immatriculation ? 'border-red-500' : ''}`}
            />
            {errors.immatriculation && <p className="text-sm text-red-500">{errors.immatriculation}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="marque">Marque *</Label>
              <Input
                id="marque"
                value={formData.marque}
                onChange={(e) => handleInputChange('marque', e.target.value)}
                placeholder="Peugeot"
                className={errors.marque ? 'border-red-500' : ''}
              />
              {errors.marque && <p className="text-sm text-red-500">{errors.marque}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="modele">Modèle *</Label>
              <Input
                id="modele"
                value={formData.modele}
                onChange={(e) => handleInputChange('modele', e.target.value)}
                placeholder="308"
                className={errors.modele ? 'border-red-500' : ''}
              />
              {errors.modele && <p className="text-sm text-red-500">{errors.modele}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="annee">Année *</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="annee"
                type="number"
                value={formData.annee}
                onChange={(e) => handleInputChange('annee', parseInt(e.target.value))}
                min={1900}
                max={new Date().getFullYear() + 1}
                className={`pl-10 ${errors.annee ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.annee && <p className="text-sm text-red-500">{errors.annee}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Informations Techniques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Hash className="h-5 w-5" />
            <span>Informations Techniques (Optionnel)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="numeroSerie">Numéro de Série (VIN)</Label>
            <Input
              id="numeroSerie"
              value={formData.numeroSerie}
              onChange={(e) => handleInputChange('numeroSerie', e.target.value.toUpperCase())}
              placeholder="VF3XXXXXXXXXXXXX"
              maxLength={17}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kilometrage">Kilométrage</Label>
            <div className="relative">
              <Gauge className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="kilometrage"
                type="number"
                value={formData.kilometrage || ''}
                onChange={(e) => handleInputChange('kilometrage', e.target.value ? parseInt(e.target.value) : null)}
                placeholder="50000"
                min={0}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Propriétaire */}
      <Card>
        <CardHeader>
          <CardTitle>Propriétaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="clientId">Client *</Label>
            <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
              <SelectTrigger className={errors.clientId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.prenom} {client.nom} ({client.numeroClient})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && <p className="text-sm text-red-500">{errors.clientId}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Création...' : 'Créer le Véhicule'}
        </Button>
      </div>
    </form>
  )
}