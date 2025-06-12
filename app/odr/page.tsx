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
import { Plus, Search, Wrench, Calendar, Euro, FileText, PaintBucket } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { ODRForm } from '@/components/forms/odr-form'

// Mock data
const mockODR = [
  {
    id: '1',
    numeroODR: 'ODR-2024-001',
    date: new Date('2024-01-15T00:00:00Z'),
    dateValidite: new Date('2024-02-15T00:00:00Z'),
    clientNom: 'Martin Dubois',
    numeroClient: 'CLI-001',
    immatriculationVehicule: 'AB-123-CD',
    statut: 'EN_COURS',
    typeService: 'CARROSSERIE',
    montantTotal: 1250.80,
    observations: 'Réparation suite à accident - Pare-choc avant et phare gauche'
  },
  {
    id: '2',
    numeroODR: 'ODR-2024-002',
    date: new Date('2024-01-16T00:00:00Z'),
    dateValidite: new Date('2024-02-16T00:00:00Z'),
    clientNom: 'Sophie Lambert',
    numeroClient: 'CLI-002',
    immatriculationVehicule: 'EF-456-GH',
    statut: 'TERMINE',
    typeService: 'MECANIQUE',
    montantTotal: 450.00,
    observations: 'Révision complète + changement plaquettes de frein'
  },
  {
    id: '3',
    numeroODR: 'ODR-2024-003',
    date: new Date('2024-01-17T00:00:00Z'),
    dateValidite: new Date('2024-02-17T00:00:00Z'),
    clientNom: 'Pierre Martin',
    numeroClient: 'CLI-003',
    immatriculationVehicule: 'IJ-789-KL',
    statut: 'EN_COURS',
    typeService: 'MECANIQUE',
    montantTotal: 850.50,
    observations: 'Diagnostic moteur - Problème de démarrage'
  }
]

const mockClients = [
  { id: '1', nom: 'Dubois', prenom: 'Martin', numeroClient: 'CLI-001' },
  { id: '2', nom: 'Lambert', prenom: 'Sophie', numeroClient: 'CLI-002' },
  { id: '3', nom: 'Martin', prenom: 'Pierre', numeroClient: 'CLI-003' }
]

const mockVehicules = [
  { id: '1', immatriculation: 'AB-123-CD', marque: 'Peugeot', modele: '308', clientId: '1' },
  { id: '2', immatriculation: 'EF-456-GH', marque: 'Renault', modele: 'Clio', clientId: '2' },
  { id: '3', immatriculation: 'IJ-789-KL', marque: 'Citroën', modele: 'C3', clientId: '3' }
]

const mockPrestations = [
  { id: '1', nom: 'Réparation pare-chocs', prixDeBase: 450, typeService: 'CARROSSERIE' as const },
  { id: '2', nom: 'Vidange moteur', prixDeBase: 85, typeService: 'MECANIQUE' as const },
  { id: '3', nom: 'Diagnostic moteur', prixDeBase: 120, typeService: 'MECANIQUE' as const }
]

export default function ODRPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredODR = mockODR.filter(odr =>
    odr.numeroODR.toLowerCase().includes(searchTerm.toLowerCase()) ||
    odr.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    odr.immatriculationVehicule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    odr.numeroClient.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateODR = async (data: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Creating ODR:', data)
      setIsAddDialogOpen(false)
      // In real app, refresh the ODR list
    } catch (error) {
      console.error('Error creating ODR:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'EN_COURS':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">En Cours</Badge>
      case 'TERMINE':
        return <Badge variant="default" className="bg-green-100 text-green-800">Terminé</Badge>
      case 'ANNULE':
        return <Badge variant="destructive">Annulé</Badge>
      default:
        return <Badge variant="secondary">{statut}</Badge>
    }
  }

  const getServiceIcon = (typeService: string) => {
    return typeService === 'CARROSSERIE' ? 
      <PaintBucket className="h-4 w-4" /> : 
      <Wrench className="h-4 w-4" />
  }

  const getServiceBadge = (typeService: string) => {
    return typeService === 'CARROSSERIE' ? 
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
        <PaintBucket className="mr-1 h-3 w-3" />
        Carrosserie
      </Badge> : 
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        <Wrench className="mr-1 h-3 w-3" />
        Mécanique
      </Badge>
  }

  const totalODR = mockODR.length
  const odrEnCours = mockODR.filter(o => o.statut === 'EN_COURS').length
  const odrTermines = mockODR.filter(o => o.statut === 'TERMINE').length
  const montantTotal = mockODR.reduce((sum, odr) => sum + odr.montantTotal, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Ordres de Réparation</h2>
          <p className="text-muted-foreground">
            Gérez les ordres de réparation de votre garage
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouvel ODR
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un nouvel ordre de réparation</DialogTitle>
              <DialogDescription>
                Remplissez les informations de l'ODR
              </DialogDescription>
            </DialogHeader>
            <ODRForm
              onSubmit={handleCreateODR}
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
            <CardTitle className="text-sm font-medium">Total ODR</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalODR}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{odrEnCours}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminés</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{odrTermines}</div>
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
              }).format(montantTotal)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un ODR..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* ODR Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Ordres de Réparation</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° ODR</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Observations</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredODR.map((odr) => (
                <TableRow key={odr.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {odr.numeroODR}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {format(odr.date, 'dd/MM/yyyy', { locale: fr })}
                    </div>
                    {odr.dateValidite && (
                      <div className="text-xs text-muted-foreground">
                        Validité: {format(odr.dateValidite, 'dd/MM/yyyy', { locale: fr })}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{odr.clientNom}</div>
                      <div className="text-sm text-muted-foreground">{odr.numeroClient}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {odr.immatriculationVehicule}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {getServiceBadge(odr.typeService)}
                  </TableCell>
                  <TableCell>
                    {getStatutBadge(odr.statut)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(odr.montantTotal)}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="text-sm text-muted-foreground truncate" title={odr.observations}>
                      {odr.observations}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        Voir
                      </Button>
                      {odr.statut === 'EN_COURS' && (
                        <Button variant="outline" size="sm">
                          Terminer
                        </Button>
                      )}
                    </div>
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