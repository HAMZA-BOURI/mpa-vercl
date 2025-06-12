'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import { Plus, Search, Wrench, PaintBucket, Package, Euro, Edit, Trash2 } from 'lucide-react'
import { PrestationForm } from '@/components/forms/prestation-form'

// Mock data for prestations
const mockPrestations = [
  {
    id: '1',
    nom: 'Réparation pare-chocs avant',
    description: 'Réparation complète du pare-chocs avant avec peinture',
    typeService: 'CARROSSERIE' as const,
    prixDeBase: 450.00,
    createdAt: new Date('2024-01-15T10:00:00Z')
  },
  {
    id: '2',
    nom: 'Vidange moteur',
    description: 'Vidange complète avec changement du filtre à huile',
    typeService: 'MECANIQUE' as const,
    prixDeBase: 85.00,
    createdAt: new Date('2024-01-16T14:30:00Z')
  },
  {
    id: '3',
    nom: 'Peinture portière',
    description: 'Peinture complète d\'une portière avec apprêt',
    typeService: 'CARROSSERIE' as const,
    prixDeBase: 320.00,
    createdAt: new Date('2024-01-17T09:15:00Z')
  },
  {
    id: '4',
    nom: 'Changement plaquettes de frein',
    description: 'Remplacement des plaquettes de frein avant',
    typeService: 'MECANIQUE' as const,
    prixDeBase: 120.00,
    createdAt: new Date('2024-01-18T11:45:00Z')
  }
]

// Mock data for forfaits
const mockForfaits = [
  {
    id: '1',
    nom: 'Forfait carrosserie Peugeot 308',
    marqueVehicule: 'Peugeot',
    modeleVehicule: '308',
    prix: 850.00,
    description: 'Forfait complet carrosserie pour Peugeot 308',
    prestationId: '1',
    createdAt: new Date('2024-01-19T13:20:00Z')
  },
  {
    id: '2',
    nom: 'Forfait révision Renault Clio',
    marqueVehicule: 'Renault',
    modeleVehicule: 'Clio',
    prix: 180.00,
    description: 'Forfait révision complète pour Renault Clio',
    prestationId: '2',
    createdAt: new Date('2024-01-20T08:30:00Z')
  }
]

export default function PrestationsPage() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddPrestationDialogOpen, setIsAddPrestationDialogOpen] = useState(false)
  const [isAddForfaitDialogOpen, setIsAddForfaitDialogOpen] = useState(false)
  const [selectedPrestation, setSelectedPrestation] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('carrosserie')
  const [isLoading, setIsLoading] = useState(false)

  // Handle tab parameter from URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && (tab === 'carrosserie' || tab === 'mecanique')) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const prestationsCarrosserie = mockPrestations.filter(p => p.typeService === 'CARROSSERIE')
  const prestationsMecanique = mockPrestations.filter(p => p.typeService === 'MECANIQUE')

  const filteredPrestationsCarrosserie = prestationsCarrosserie.filter(prestation =>
    prestation.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prestation.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredPrestationsMecanique = prestationsMecanique.filter(prestation =>
    prestation.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prestation.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getForfaitsForPrestation = (prestationId: string) => {
    return mockForfaits.filter(f => f.prestationId === prestationId)
  }

  const handleCreatePrestation = async (data: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Creating prestation:', data)
      setIsAddPrestationDialogOpen(false)
      // In real app, refresh the prestations list
    } catch (error) {
      console.error('Error creating prestation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const PrestationTable = ({ prestations, typeService }: { prestations: typeof mockPrestations, typeService: 'CARROSSERIE' | 'MECANIQUE' }) => (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Prix de Base</TableHead>
            <TableHead>Forfaits</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prestations.map((prestation) => {
            const forfaits = getForfaitsForPrestation(prestation.id)
            return (
              <TableRow key={prestation.id}>
                <TableCell>
                  <div className="font-medium">{prestation.nom}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground max-w-xs">
                    {prestation.description}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center font-medium text-green-600">
                    <Euro className="mr-1 h-3 w-3" />
                    {new Intl.NumberFormat('fr-FR', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(prestation.prixDeBase)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      {forfaits.length} forfait{forfaits.length > 1 ? 's' : ''}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedPrestation(prestation.id)
                        setIsAddForfaitDialogOpen(true)
                      }}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      {/* Forfaits Details */}
      {prestations.some(p => getForfaitsForPrestation(p.id).length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Forfaits Associés</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Forfait</TableHead>
                  <TableHead>Véhicule</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prestations.map(prestation => 
                  getForfaitsForPrestation(prestation.id).map(forfait => (
                    <TableRow key={forfait.id}>
                      <TableCell>
                        <div className="font-medium">{forfait.nom}</div>
                        <div className="text-xs text-muted-foreground">
                          Pour: {prestation.nom}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {forfait.marqueVehicule} {forfait.modeleVehicule}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center font-medium text-green-600">
                          <Euro className="mr-1 h-3 w-3" />
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(forfait.prix)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-xs">
                          {forfait.description}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Catalogue des Prestations</h2>
          <p className="text-muted-foreground">
            Gérez vos prestations et forfaits par activité
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Dialog open={isAddPrestationDialogOpen} onOpenChange={setIsAddPrestationDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Prestation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter une nouvelle prestation</DialogTitle>
                <DialogDescription>
                  Remplissez les informations de la prestation
                </DialogDescription>
              </DialogHeader>
              <PrestationForm
                onSubmit={handleCreatePrestation}
                onCancel={() => setIsAddPrestationDialogOpen(false)}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Prestations</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPrestations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carrosserie</CardTitle>
            <PaintBucket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prestationsCarrosserie.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mécanique</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{prestationsMecanique.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Forfaits</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockForfaits.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une prestation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs for Activities */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="carrosserie" className="flex items-center space-x-2">
            <PaintBucket className="h-4 w-4" />
            <span>Carrosserie</span>
          </TabsTrigger>
          <TabsTrigger value="mecanique" className="flex items-center space-x-2">
            <Wrench className="h-4 w-4" />
            <span>Mécanique</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="carrosserie">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PaintBucket className="h-5 w-5" />
                <span>Prestations Carrosserie</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PrestationTable prestations={filteredPrestationsCarrosserie} typeService="CARROSSERIE" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mecanique">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wrench className="h-5 w-5" />
                <span>Prestations Mécanique</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PrestationTable prestations={filteredPrestationsMecanique} typeService="MECANIQUE" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Forfait Dialog */}
      <Dialog open={isAddForfaitDialogOpen} onOpenChange={setIsAddForfaitDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau forfait</DialogTitle>
            <DialogDescription>
              Créez un forfait pour une prestation spécifique
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 text-center text-muted-foreground">
            Formulaire d'ajout de forfait à implémenter
            {selectedPrestation && (
              <p className="text-sm mt-2">
                Pour la prestation: {mockPrestations.find(p => p.id === selectedPrestation)?.nom}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}