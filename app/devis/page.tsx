'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Search, FileText, Calendar, Euro, Eye, PaintBucket, Wrench } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DevisForm } from '@/components/forms/devis-form'

// Mock data
const mockDevis = [
  {
    id: '1',
    numeroDevis: 'DEV-2024-001',
    date: new Date('2024-01-20T09:00:00Z'),
    dateValidite: new Date('2024-02-19T09:00:00Z'),
    clientNom: 'Martin Dubois',
    vehicule: 'Peugeot 308 - AB-123-CD',
    statut: 'EN_ATTENTE',
    typeService: 'CARROSSERIE',
    totalHT: 850.00,
    montantTVA: 170.00,
    totalTTC: 1020.00,
    createdAt: new Date('2024-01-20T09:00:00Z')
  },
  {
    id: '2',
    numeroDevis: 'DEV-2024-002',
    date: new Date('2024-01-15T14:30:00Z'),
    dateValidite: new Date('2024-02-14T14:30:00Z'),
    clientNom: 'Sophie Lambert',
    vehicule: 'Renault Clio - EF-456-GH',
    statut: 'ACCEPTE',
    typeService: 'MECANIQUE',
    totalHT: 450.00,
    montantTVA: 90.00,
    totalTTC: 540.00,
    createdAt: new Date('2024-01-15T14:30:00Z')
  }
]

const mockClients = [
  { id: '1', nom: 'Dubois', prenom: 'Martin', numeroClient: 'CLI-001' },
  { id: '2', nom: 'Lambert', prenom: 'Sophie', numeroClient: 'CLI-002' }
]

const mockVehicules = [
  { id: '1', immatriculation: 'AB-123-CD', marque: 'Peugeot', modele: '308', clientId: '1' },
  { id: '2', immatriculation: 'EF-456-GH', marque: 'Renault', modele: 'Clio', clientId: '2' }
]

const mockPrestations = [
  { id: '1', nom: 'Réparation pare-chocs', prixDeBase: 450, typeService: 'CARROSSERIE' as const },
  { id: '2', nom: 'Vidange moteur', prixDeBase: 85, typeService: 'MECANIQUE' as const }
]

export default function DevisPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredDevis = mockDevis.filter(devis =>
    devis.numeroDevis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    devis.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    devis.vehicule.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateDevis = async (data: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Creating devis:', data)
      setIsAddDialogOpen(false)
      // In real app, refresh the devis list
    } catch (error) {
      console.error('Error creating devis:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'bg-yellow-100 text-yellow-800'
      case 'ACCEPTE':
        return 'bg-green-100 text-green-800'
      case 'REFUSE':
        return 'bg-red-100 text-red-800'
      case 'EXPIRE':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case 'EN_ATTENTE':
        return 'En Attente'
      case 'ACCEPTE':
        return 'Accepté'
      case 'REFUSE':
        return 'Refusé'
      case 'EXPIRE':
        return 'Expiré'
      default:
        return statut
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Devis</h2>
          <p className="text-muted-foreground">
            Créez et gérez vos devis pour carrosserie et mécanique
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Devis
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouveau devis</DialogTitle>
              <DialogDescription>
                Remplissez les informations du devis
              </DialogDescription>
            </DialogHeader>
            <DevisForm
              onSubmit={handleCreateDevis}
              onCancel={() => setIsAddDialogOpen(false)}
              clients={mockClients}
              vehicules={mockVehicules}
              prestations={mockPrestations}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Devis</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDevis.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDevis.filter(d => d.statut === 'EN_ATTENTE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acceptés</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockDevis.filter(d => d.statut === 'ACCEPTE').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Total</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(mockDevis.reduce((sum, devis) => sum + devis.totalTTC, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un devis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Devis Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Devis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Devis</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Type Service</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Validité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Montant TTC</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDevis.map((devis) => (
                <TableRow key={devis.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {devis.numeroDevis}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{devis.clientNom}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{devis.vehicule}</div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline"
                      className={devis.typeService === 'CARROSSERIE' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                    >
                      {devis.typeService === 'CARROSSERIE' ? (
                        <>
                          <PaintBucket className="mr-1 h-3 w-3" />
                          Carrosserie
                        </>
                      ) : (
                        <>
                          <Wrench className="mr-1 h-3 w-3" />
                          Mécanique
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(devis.date, 'dd/MM/yyyy', { locale: fr })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(devis.dateValidite, 'dd/MM/yyyy', { locale: fr })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatutColor(devis.statut)}>
                      {getStatutLabel(devis.statut)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(devis.totalTTC)}
                    
                    </div>
                    <div className="text-xs text-muted-foreground">
                      HT: {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(devis.totalHT)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}