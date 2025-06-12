'use client'

import { useState, useEffect } from 'react'
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
import { Plus, Search, Car, Calendar, Gauge } from 'lucide-react'
import { VehiculeForm } from '@/components/forms/vehicule-form'
import { getVehicules, getClients, addVehicule, getVehiculeStats, type Vehicule, type Client } from '@/lib/mock-data'

export default function VehiculesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [vehicules, setVehicules] = useState<Vehicule[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [stats, setStats] = useState({ totalVehicules: 0, anneesMoyenne: 0, kilometrageMoyen: 0 })

  // Load initial data
  useEffect(() => {
    setVehicules(getVehicules())
    setClients(getClients())
    setStats(getVehiculeStats())
  }, [])

  const filteredVehicules = vehicules.filter(vehicule =>
    vehicule.immatriculation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicule.marque.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicule.modele.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getClientName(vehicule.clientId).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId)
    return client ? `${client.prenom} ${client.nom}` : 'Client inconnu'
  }

  const handleCreateVehicule = async (data: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add vehicule to mock data
      const newVehicule = addVehicule(data)
      
      // Update local state
      setVehicules(getVehicules())
      setStats(getVehiculeStats())
      
      setIsAddDialogOpen(false)
      console.log('Vehicule created:', newVehicule)
    } catch (error) {
      console.error('Error creating vehicule:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Véhicules</h2>
          <p className="text-muted-foreground">
            Gérez le parc de véhicules de vos clients
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Véhicule
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
              <DialogDescription>
                Remplissez les informations du véhicule
              </DialogDescription>
            </DialogHeader>
            <VehiculeForm
              onSubmit={handleCreateVehicule}
              onCancel={() => setIsAddDialogOpen(false)}
              clients={clients}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Véhicules</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVehicules}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Année Moyenne</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.anneesMoyenne}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Km Moyen</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.kilometrageMoyen.toLocaleString('fr-FR')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un véhicule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Vehicules Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Véhicules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Immatriculation</TableHead>
                <TableHead>Véhicule</TableHead>
                <TableHead>Année</TableHead>
                <TableHead>Kilométrage</TableHead>
                <TableHead>Propriétaire</TableHead>
                <TableHead>N° Série</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicules.map((vehicule) => (
                <TableRow key={vehicule.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {vehicule.immatriculation}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{vehicule.marque} {vehicule.modele}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{vehicule.annee}</Badge>
                  </TableCell>
                  <TableCell>
                    {vehicule.kilometrage ? (
                      <div className="flex items-center">
                        <Gauge className="mr-1 h-3 w-3" />
                        {vehicule.kilometrage.toLocaleString('fr-FR')} km
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{getClientName(vehicule.clientId)}</div>
                  </TableCell>
                  <TableCell>
                    {vehicule.numeroSerie ? (
                      <span className="font-mono text-sm">{vehicule.numeroSerie}</span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
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