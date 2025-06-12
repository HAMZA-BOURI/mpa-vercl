'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, Euro, Wrench, PaintBucket } from 'lucide-react'

interface PrestationFormData {
  nom: string
  description: string
  typeService: 'CARROSSERIE' | 'MECANIQUE'
  prixDeBase: number
}

interface PrestationFormProps {
  onSubmit: (data: PrestationFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function PrestationForm({ onSubmit, onCancel, isLoading = false }: PrestationFormProps) {
  const [formData, setFormData] = useState<PrestationFormData>({
    nom: '',
    description: '',
    typeService: 'CARROSSERIE',
    prixDeBase: 0
  })

  const [errors, setErrors] = useState<Partial<Record<keyof PrestationFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PrestationFormData, string>> = {}

    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.description.trim()) newErrors.description = 'La description est requise'
    if (formData.prixDeBase <= 0) newErrors.prixDeBase = 'Le prix doit être supérieur à 0'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof PrestationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations Générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Informations de la Prestation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nom">Nom de la Prestation *</Label>
            <Input
              id="nom"
              value={formData.nom}
              onChange={(e) => handleInputChange('nom', e.target.value)}
              placeholder="Réparation pare-chocs avant"
              className={errors.nom ? 'border-red-500' : ''}
            />
            {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description détaillée de la prestation..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="typeService">Type de Service *</Label>
            <Select 
              value={formData.typeService} 
              onValueChange={(value: 'CARROSSERIE' | 'MECANIQUE') => handleInputChange('typeService', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CARROSSERIE">
                  <div className="flex items-center space-x-2">
                    <PaintBucket className="h-4 w-4" />
                    <span>Carrosserie</span>
                  </div>
                </SelectItem>
                <SelectItem value="MECANIQUE">
                  <div className="flex items-center space-x-2">
                    <Wrench className="h-4 w-4" />
                    <span>Mécanique</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tarification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Euro className="h-5 w-5" />
            <span>Tarification</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="prixDeBase">Prix de Base (€ TTC) *</Label>
            <div className="relative">
              <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="prixDeBase"
                type="number"
                step="0.01"
                min="0"
                value={formData.prixDeBase}
                onChange={(e) => handleInputChange('prixDeBase', parseFloat(e.target.value) || 0)}
                placeholder="150.00"
                className={`pl-10 ${errors.prixDeBase ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.prixDeBase && <p className="text-sm text-red-500">{errors.prixDeBase}</p>}
            <p className="text-sm text-muted-foreground">
              Ce prix servira de base pour les devis et peut être ajusté selon le véhicule
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Création...' : 'Créer la Prestation'}
        </Button>
      </div>
    </form>
  )
}