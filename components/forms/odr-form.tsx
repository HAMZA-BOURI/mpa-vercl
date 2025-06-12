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
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Wrench, User, Car, Calendar as CalendarIcon, Plus, Trash2, FileText, PaintBucket } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ArticleODRFormData {
  designation: string
  prixUnitaireTTC: number
  quantite: number
  prestationId?: string
}

interface ODRFormData {
  clientId: string
  vehiculeId: string
  typeService: 'CARROSSERIE' | 'MECANIQUE'
  dateValidite: Date | null
  observations: string
  articles: ArticleODRFormData[]
}

interface Client {
  id: string
  nom: string
  prenom: string
  numeroClient: string
}

interface Vehicule {
  id: string
  immatriculation: string
  marque: string
  modele: string
  clientId: string
}

interface Prestation {
  id: string
  nom: string
  prixDeBase: number
  typeService: 'CARROSSERIE' | 'MECANIQUE'
}

interface ODRFormProps {
  onSubmit: (data: ODRFormData) => void
  onCancel: () => void
  clients: Client[]
  vehicules: Vehicule[]
  prestations: Prestation[]
  isLoading?: boolean
}

export function ODRForm({ onSubmit, onCancel, clients, vehicules, prestations, isLoading = false }: ODRFormProps) {
  const [formData, setFormData] = useState<ODRFormData>({
    clientId: '',
    vehiculeId: '',
    typeService: 'CARROSSERIE',
    dateValidite: null,
    observations: '',
    articles: [{ designation: '', prixUnitaireTTC: 0, quantite: 1 }]
  })

  const [errors, setErrors] = useState<any>({})

  const validateForm = (): boolean => {
    const newErrors: any = {}

    if (!formData.clientId) newErrors.clientId = 'Le client est requis'
    if (!formData.vehiculeId) newErrors.vehiculeId = 'Le véhicule est requis'
    
    formData.articles.forEach((article, index) => {
      if (!article.designation.trim()) {
        newErrors[`article_${index}_designation`] = 'La désignation est requise'
      }
      if (article.prixUnitaireTTC <= 0) {
        newErrors[`article_${index}_prix`] = 'Le prix doit être supérieur à 0'
      }
      if (article.quantite <= 0) {
        newErrors[`article_${index}_quantite`] = 'La quantité doit être supérieure à 0'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof ODRFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleArticleChange = (index: number, field: keyof ArticleODRFormData, value: any) => {
    const newArticles = [...formData.articles]
    newArticles[index] = { ...newArticles[index], [field]: value }
    setFormData(prev => ({ ...prev, articles: newArticles }))
  }

  const addArticle = () => {
    setFormData(prev => ({
      ...prev,
      articles: [...prev.articles, { designation: '', prixUnitaireTTC: 0, quantite: 1 }]
    }))
  }

  const removeArticle = (index: number) => {
    if (formData.articles.length > 1) {
      setFormData(prev => ({
        ...prev,
        articles: prev.articles.filter((_, i) => i !== index)
      }))
    }
  }

  const addPrestationToArticle = (index: number, prestationId: string) => {
    const prestation = prestations.find(p => p.id === prestationId)
    if (prestation) {
      handleArticleChange(index, 'designation', prestation.nom)
      handleArticleChange(index, 'prixUnitaireTTC', prestation.prixDeBase)
      handleArticleChange(index, 'prestationId', prestationId)
    }
  }

  const filteredVehicules = vehicules.filter(v => v.clientId === formData.clientId)
  const filteredPrestations = prestations.filter(p => p.typeService === formData.typeService)

  const calculateTotal = () => {
    return formData.articles.reduce((sum, article) => 
      sum + (article.prixUnitaireTTC * article.quantite), 0)
  }

  const montantTotal = calculateTotal()

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Client et Véhicule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Client et Véhicule</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client *</Label>
              <Select value={formData.clientId} onValueChange={(value) => {
                handleInputChange('clientId', value)
                handleInputChange('vehiculeId', '') // Reset vehicle when client changes
              }}>
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

            <div className="space-y-2">
              <Label htmlFor="vehiculeId">Véhicule *</Label>
              <Select 
                value={formData.vehiculeId} 
                onValueChange={(value) => handleInputChange('vehiculeId', value)}
                disabled={!formData.clientId}
              >
                <SelectTrigger className={errors.vehiculeId ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Sélectionner un véhicule" />
                </SelectTrigger>
                <SelectContent>
                  {filteredVehicules.map((vehicule) => (
                    <SelectItem key={vehicule.id} value={vehicule.id}>
                      {vehicule.marque} {vehicule.modele} ({vehicule.immatriculation})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.vehiculeId && <p className="text-sm text-red-500">{errors.vehiculeId}</p>}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
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

            <div className="space-y-2">
              <Label htmlFor="dateValidite">Date de Validité (Optionnel)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateValidite ? format(formData.dateValidite, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner une date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateValidite || undefined}
                    onSelect={(date) => handleInputChange('dateValidite', date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Articles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Prestations à Effectuer</span>
            </div>
            <Button type="button" onClick={addArticle} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.articles.map((article, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Prestation {index + 1}</h4>
                {formData.articles.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArticle(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>Prestation Prédéfinie (Optionnel)</Label>
                <Select onValueChange={(value) => addPrestationToArticle(index, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choisir une prestation" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPrestations.map((prestation) => (
                      <SelectItem key={prestation.id} value={prestation.id}>
                        {prestation.nom} - {prestation.prixDeBase}€
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Description de la Prestation *</Label>
                <Textarea
                  value={article.designation}
                  onChange={(e) => handleArticleChange(index, 'designation', e.target.value)}
                  placeholder="Description détaillée de la prestation à effectuer..."
                  rows={3}
                  className={errors[`article_${index}_designation`] ? 'border-red-500' : ''}
                />
                {errors[`article_${index}_designation`] && (
                  <p className="text-sm text-red-500">{errors[`article_${index}_designation`]}</p>
                )}
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Prix Unitaire TTC (€) *</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={article.prixUnitaireTTC}
                    onChange={(e) => handleArticleChange(index, 'prixUnitaireTTC', parseFloat(e.target.value) || 0)}
                    className={errors[`article_${index}_prix`] ? 'border-red-500' : ''}
                  />
                  {errors[`article_${index}_prix`] && (
                    <p className="text-sm text-red-500">{errors[`article_${index}_prix`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Quantité *</Label>
                  <Input
                    type="number"
                    min="1"
                    value={article.quantite}
                    onChange={(e) => handleArticleChange(index, 'quantite', parseInt(e.target.value) || 1)}
                    className={errors[`article_${index}_quantite`] ? 'border-red-500' : ''}
                  />
                  {errors[`article_${index}_quantite`] && (
                    <p className="text-sm text-red-500">{errors[`article_${index}_quantite`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Total TTC</Label>
                  <div className="p-2 bg-muted rounded-md font-medium">
                    {(article.prixUnitaireTTC * article.quantite).toFixed(2)} €
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Separator />

          {/* Total */}
          <div className="flex justify-between items-center bg-muted/50 p-4 rounded-lg">
            <span className="text-lg font-medium">Montant Total TTC:</span>
            <span className="text-xl font-bold">{montantTotal.toFixed(2)} €</span>
          </div>
        </CardContent>
      </Card>

      {/* Observations */}
      <Card>
        <CardHeader>
          <CardTitle>Observations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="observations">Observations et Notes</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => handleInputChange('observations', e.target.value)}
              placeholder="Notes particulières, état du véhicule, demandes spécifiques du client..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Annuler
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Création...' : 'Créer l\'ODR'}
        </Button>
      </div>
    </form>
  )
}