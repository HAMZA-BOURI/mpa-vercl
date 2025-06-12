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
import { User, Building, Mail, Phone, MapPin } from 'lucide-react'

interface ClientFormData {
  prenom: string
  nom: string
  entreprise: string
  telephone: string
  email: string
  adresse: string
  ville: string
  codePostal: string
  typeClient: 'NORMAL' | 'GRAND_COMPTE'
}

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function ClientForm({ onSubmit, onCancel, isLoading = false }: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    prenom: '',
    nom: '',
    entreprise: '',
    telephone: '',
    email: '',
    adresse: '',
    ville: '',
    codePostal: '',
    typeClient: 'NORMAL'
  })

  const [errors, setErrors] = useState<Partial<ClientFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<ClientFormData> = {}

    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis'
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis'
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide'
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est requise'
    if (!formData.ville.trim()) newErrors.ville = 'La ville est requise'
    if (!formData.codePostal.trim()) newErrors.codePostal = 'Le code postal est requis'
    else if (!/^\d{5}$/.test(formData.codePostal)) newErrors.codePostal = 'Code postal invalide (5 chiffres)'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informations Personnelles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>Informations Personnelles</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom *</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                placeholder="Jean"
                className={errors.prenom ? 'border-red-500' : ''}
              />
              {errors.prenom && <p className="text-sm text-red-500">{errors.prenom}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nom">Nom *</Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="Dupont"
                className={errors.nom ? 'border-red-500' : ''}
              />
              {errors.nom && <p className="text-sm text-red-500">{errors.nom}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="typeClient">Type de Client</Label>
            <Select value={formData.typeClient} onValueChange={(value: 'NORMAL' | 'GRAND_COMPTE') => handleInputChange('typeClient', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NORMAL">Client Normal</SelectItem>
                <SelectItem value="GRAND_COMPTE">Grand Compte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Entreprise */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Building className="h-5 w-5" />
            <span>Entreprise (Optionnel)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="entreprise">Nom de l'Entreprise</Label>
            <Input
              id="entreprise"
              value={formData.entreprise}
              onChange={(e) => handleInputChange('entreprise', e.target.value)}
              placeholder="Mon Entreprise SARL"
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5" />
            <span>Informations de Contact</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="jean.dupont@email.com"
                className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone *</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="telephone"
                value={formData.telephone}
                onChange={(e) => handleInputChange('telephone', e.target.value)}
                placeholder="06.12.34.56.78"
                className={`pl-10 ${errors.telephone ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.telephone && <p className="text-sm text-red-500">{errors.telephone}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Adresse */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <span>Adresse</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adresse">Adresse *</Label>
            <Input
              id="adresse"
              value={formData.adresse}
              onChange={(e) => handleInputChange('adresse', e.target.value)}
              placeholder="123 Rue de la Paix"
              className={errors.adresse ? 'border-red-500' : ''}
            />
            {errors.adresse && <p className="text-sm text-red-500">{errors.adresse}</p>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="ville">Ville *</Label>
              <Input
                id="ville"
                value={formData.ville}
                onChange={(e) => handleInputChange('ville', e.target.value)}
                placeholder="Paris"
                className={errors.ville ? 'border-red-500' : ''}
              />
              {errors.ville && <p className="text-sm text-red-500">{errors.ville}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="codePostal">Code Postal *</Label>
              <Input
                id="codePostal"
                value={formData.codePostal}
                onChange={(e) => handleInputChange('codePostal', e.target.value)}
                placeholder="75001"
                className={errors.codePostal ? 'border-red-500' : ''}
              />
              {errors.codePostal && <p className="text-sm text-red-500">{errors.codePostal}</p>}
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
          {isLoading ? 'Création...' : 'Créer le Client'}
        </Button>
      </div>
    </form>
  )
}