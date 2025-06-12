'use client'

import { useState } from 'react'
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
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Receipt, User, Calendar as CalendarIcon, Euro } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface FactureFormData {
  clientId: string
  montantTTC: number
  dateEcheance: Date
  numeroODR: string
}

interface Client {
  id: string
  nom: string
  prenom: string
  numeroClient: string
}

interface ODR {
  id: string
  numeroODR: string
  clientNom: string
  montantTotal: number
}

interface FactureFormProps {
  onSubmit: (data: FactureFormData) => void
  onCancel: () => void
  clients: Client[]
  odrs: ODR[]
  isLoading?: boolean
}

export function FactureForm({ onSubmit, onCancel, clients, odrs, isLoading = false }: FactureFormProps) {
  const [formData, setFormData] = useState<FactureFormData>({
    clientId: '',
    montantTTC: 0,
    dateEcheance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 jours
    numeroODR: ''
  })

  const [errors, setErrors] = useState<Partial<Record<keyof FactureFormData, string>>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FactureFormData, string>> = {}

    if (!formData.clientId) newErrors.clientId = 'Le client est requis'
    if (formData.montantTTC <= 0) newErrors.montantTTC = 'Le montant doit être supérieur à 0'
    if (!formData.dateEcheance) newErrors.dateEcheance = 'La date d\'échéance est requise'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof FactureFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleODRSelect = (odrId: string) => {
    const selectedODR = odrs.find(odr => odr.id === odrId)
    if (selectedODR) {
      handleInputChange('numeroODR', selectedODR.numeroODR)
      handleInputChange('montantTTC', selectedODR.montantTotal)
      // Find client by name (this is a simplified approach)
      const client = clients.find(c => `${c.prenom} ${c.nom}` === selectedODR.clientNom)
      if (client) {
        handleInputChange('clientId', client.id)
      }
    }
  }

  const filteredODRs = odrs.filter(odr => 
    !formData.clientId || odr.clientNom === clients.find(c => c.id === formData.clientId)?.prenom + ' ' + clients.find(c => c.id === formData.clientId)?.nom
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations Client */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Informations Client</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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

      {/* ODR Origine */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Receipt className="h-5 w-5" />
            <span>ODR d'Origine (Optionnel)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Sélectionner un ODR</Label>
            <Select onValueChange={handleODRSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un ODR terminé" />
              </SelectTrigger>
              <SelectContent>
                {filteredODRs.map((odr) => (
                  <SelectItem key={odr.id} value={odr.id}>
                    {odr.numeroODR} - {odr.clientNom} - {odr.montantTotal.toFixed(2)}€
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroODR">Numéro ODR</Label>
            <Input
              id="numeroODR"
              value={formData.numeroODR}
              onChange={(e) => handleInputChange('numeroODR', e.target.value)}
              placeholder="ODR-2024-001"
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>

      {/* Montant et Échéance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Euro className="h-5 w-5" />
            <span>Montant et Échéance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="montantTTC">Montant TTC (€) *</Label>
            <div className="relative">
              <Euro className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="montantTTC"
                type="number"
                step="0.01"
                min="0"
                value={formData.montantTTC}
                onChange={(e) => handleInputChange('montantTTC', parseFloat(e.target.value) || 0)}
                placeholder="1250.00"
                className={`pl-10 ${errors.montantTTC ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.montantTTC && <p className="text-sm text-red-500">{errors.montantTTC}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateEcheance">Date d'Échéance *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${errors.dateEcheance ? 'border-red-500' : ''}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dateEcheance ? format(formData.dateEcheance, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner une date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.dateEcheance}
                  onSelect={(date) => date && handleInputChange('dateEcheance', date)}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.dateEcheance && <p className="text-sm text-red-500">{errors.dateEcheance}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Récapitulatif */}
      <Card>
        <CardHeader>
          <CardTitle>Récapitulatif</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 bg-muted/50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>Client:</span>
              <span className="font-medium">
                {formData.clientId ? 
                  clients.find(c => c.id === formData.clientId)?.prenom + ' ' + 
                  clients.find(c => c.id === formData.clientId)?.nom 
                  : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>ODR d'origine:</span>
              <span className="font-medium">{formData.numeroODR || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span>Date d'échéance:</span>
              <span className="font-medium">
                {formData.dateEcheance ? format(formData.dateEcheance, 'dd/MM/yyyy', { locale: fr }) : '-'}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Montant TTC:</span>
              <span>{formData.montantTTC.toFixed(2)} €</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Création...' : 'Créer la Facture'}
        </Button>
      </div>
    </form>
  )
}