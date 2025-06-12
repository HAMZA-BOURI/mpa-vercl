'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Save,
  AlertTriangle,
  CheckCircle,
  Camera,
  Shield,
  Key
} from 'lucide-react'

// Mock data for current user profile
const mockProfile = {
  nom: 'MPA Garage',
  prenom: 'Admin',
  email: 'admin@mpagarage.fr',
  telephone: '01.23.45.67.89',
  adresse: '123 Rue de l\'Automobile',
  ville: 'Paris',
  codePostal: '75001',
  entreprise: 'MPA Garage SARL',
  siret: '12345678901234',
  role: 'ADMIN',
  avatar: null,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  lastLogin: new Date('2024-01-20T08:30:00Z')
}

export default function ProfilPage() {
  const [profile, setProfile] = useState(mockProfile)
  const [hasChanges, setHasChanges] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  const handleProfileChange = (key: string, value: any) => {
    setProfile(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // In production, this would save to the database
    console.log('Saving profile:', profile)
    setHasChanges(false)
    // Show success message
  }

  const handlePasswordChange = () => {
    // In production, this would handle password change
    console.log('Changing password')
    setIsChangingPassword(false)
    // Show success message
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Mon Profil</h2>
          <p className="text-muted-foreground">
            Gérez vos informations personnelles et paramètres de compte
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Enregistrer</span>
        </Button>
      </div>

      {/* Changes Alert */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                Vous avez des modifications non sauvegardées
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Picture & Basic Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Photo de Profil</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar || undefined} alt="Profile" />
                <AvatarFallback className="text-lg">
                  {profile.prenom.charAt(0)}{profile.nom.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <Button variant="outline" size="sm">
                <Camera className="h-4 w-4 mr-2" />
                Changer la photo
              </Button>
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Rôle</Label>
                <Badge variant="default" className="mt-1">
                  <Shield className="h-3 w-3 mr-1" />
                  Administrateur
                </Badge>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Membre depuis</Label>
                <p className="text-sm">{profile.createdAt.toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Dernière connexion</Label>
                <p className="text-sm">{profile.lastLogin.toLocaleDateString('fr-FR')} à {profile.lastLogin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Informations Personnelles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="prenom">Prénom</Label>
                <Input
                  id="prenom"
                  value={profile.prenom}
                  onChange={(e) => handleProfileChange('prenom', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nom">Nom</Label>
                <Input
                  id="nom"
                  value={profile.nom}
                  onChange={(e) => handleProfileChange('nom', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="telephone"
                  value={profile.telephone}
                  onChange={(e) => handleProfileChange('telephone', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresse">Adresse</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="adresse"
                  value={profile.adresse}
                  onChange={(e) => handleProfileChange('adresse', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="ville">Ville</Label>
                <Input
                  id="ville"
                  value={profile.ville}
                  onChange={(e) => handleProfileChange('ville', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codePostal">Code Postal</Label>
                <Input
                  id="codePostal"
                  value={profile.codePostal}
                  onChange={(e) => handleProfileChange('codePostal', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Informations Entreprise</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="entreprise">Nom de l'Entreprise</Label>
              <Input
                id="entreprise"
                value={profile.entreprise}
                onChange={(e) => handleProfileChange('entreprise', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                value={profile.siret}
                onChange={(e) => handleProfileChange('siret', e.target.value)}
                placeholder="12345678901234"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Key className="h-5 w-5" />
              <span>Sécurité</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Mot de passe</Label>
              <p className="text-sm text-muted-foreground">
                Dernière modification il y a 30 jours
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsChangingPassword(true)}
                className="w-full"
              >
                <Key className="h-4 w-4 mr-2" />
                Changer le mot de passe
              </Button>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Authentification à deux facteurs</Label>
              <p className="text-sm text-muted-foreground">
                Non configurée
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Configurer 2FA
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success Message */}
      {!hasChanges && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-800">
                Votre profil est à jour
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}