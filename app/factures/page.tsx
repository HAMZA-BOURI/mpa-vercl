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
import { Search, Receipt, Euro, AlertTriangle, CheckCircle, Clock, Download, Eye, Plus } from 'lucide-react'
import { FactureForm } from '@/components/forms/facture-form'

// Mock data
const mockFactures = [
  {
    id: '1',
    numeroFacture: 'FAC-2024-001',
    date: new Date('2024-01-15T00:00:00Z'),
    dateEcheance: new Date('2024-02-15T00:00:00Z'),
    clientNom: 'Martin Dubois',
    clientId: '1',
    montantTTC: 850.50,
    statut: 'EN_ATTENTE',
    modePaiement: null,
    dateReglement: null,
    numeroODR: 'ODR-2024-012',
    createdAt: new Date('2024-01-15T00:00:00Z')
  },
  {
    id: '2',
    numeroFacture: 'FAC-2024-002',
    date: new Date('2024-01-10T00:00:00Z'),
    dateEcheance: new Date('2024-01-25T00:00:00Z'),
    clientNom: 'Sophie Lambert',
    clientId: '2',
    montantTTC: 1250.00,
    statut: 'IMPAYEE',
    modePaiement: null,
    dateReglement: null,
    numeroODR: 'ODR-2024-008',
    createdAt: new Date('2024-01-10T00:00:00Z')
  },
  {
    id: '3',
    numeroFacture: 'FAC-2024-003',
    date: new Date('2024-01-12T00:00:00Z'),
    dateEcheance: new Date('2024-02-12T00:00:00Z'),
    clientNom: 'Garage Centrale',
    clientId: '3',
    montantTTC: 450.75,
    statut: 'PAYEE',
    modePaiement: 'VIREMENT',
    dateReglement: new Date('2024-01-20T00:00:00Z'),
    numeroODR: 'ODR-2024-010',
    createdAt: new Date('2024-01-12T00:00:00Z')
  },
  {
    id: '4',
    numeroFacture: 'FAC-2024-004',
    date: new Date('2024-01-18T00:00:00Z'),
    dateEcheance: new Date('2024-02-18T00:00:00Z'),
    clientNom: 'Transport Martin',
    clientId: '4',
    montantTTC: 2150.00,
    statut: 'PARTIELLEMENT_PAYEE',
    modePaiement: 'MIXTE',
    dateReglement: new Date('2024-01-25T00:00:00Z'),
    numeroODR: 'ODR-2024-015',
    createdAt: new Date('2024-01-18T00:00:00Z')
  }
]

const mockClients = [
  { id: '1', nom: 'Dubois', prenom: 'Martin', numeroClient: 'CLI-001' },
  { id: '2', nom: 'Lambert', prenom: 'Sophie', numeroClient: 'CLI-002' },
  { id: '3', nom: 'Centrale', prenom: 'Garage', numeroClient: 'CLI-003' },
  { id: '4', nom: 'Martin', prenom: 'Transport', numeroClient: 'CLI-004' }
]

const mockODRs = [
  { id: '1', numeroODR: 'ODR-2024-012', clientNom: 'Martin Dubois', montantTotal: 850.50 },
  { id: '2', numeroODR: 'ODR-2024-008', clientNom: 'Sophie Lambert', montantTotal: 1250.00 },
  { id: '3', numeroODR: 'ODR-2024-010', clientNom: 'Garage Centrale', montantTotal: 450.75 }
]

export default function FacturesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const filteredFactures = mockFactures.filter(facture =>
    facture.numeroFacture.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.clientNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    facture.numeroODR.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateFacture = async (data: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Creating facture:', data)
      setIsAddDialogOpen(false)
      // In real app, refresh the factures list
    } catch (error) {
      console.error('Error creating facture:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'PAYEE':
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="mr-1 h-3 w-3" />
            Payée
          </Badge>
        )
      case 'EN_ATTENTE':
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="mr-1 h-3 w-3" />
            En Attente
          </Badge>
        )
      case 'IMPAYEE':
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <AlertTriangle className="mr-1 h-3 w-3" />
            Impayée
          </Badge>
        )
      case 'PARTIELLEMENT_PAYEE':
        return (
          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Clock className="mr-1 h-3 w-3" />
            Partiellement Payée
          </Badge>
        )
      case 'ANNULEE':
        return (
          <Badge variant="secondary">
            Annulée
          </Badge>
        )
      default:
        return <Badge variant="outline">{statut}</Badge>
    }
  }

  const getModePaiementText = (mode: string | null) => {
    if (!mode) return '-'
    switch (mode) {
      case 'ESPECES':
        return 'Espèces'
      case 'CHEQUE':
        return 'Chèque'
      case 'VIREMENT':
        return 'Virement'
      case 'TPE_VIVAWALLET':
        return 'TPE Vivawallet'
      case 'CREDIT_INTERNE':
        return 'Crédit Interne'
      case 'MIXTE':
        return 'Mixte'
      default:
        return mode
    }
  }

  // Calculate stats
  const totalFactures = mockFactures.length
  const facturesPayees = mockFactures.filter(f => f.statut === 'PAYEE').length
  const facturesImpayees = mockFactures.filter(f => f.statut === 'IMPAYEE').length
  const montantTotal = mockFactures.reduce((sum, f) => sum + f.montantTTC, 0)
  const montantImpaye = mockFactures
    .filter(f => f.statut === 'IMPAYEE')
    .reduce((sum, f) => sum + f.montantTTC, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestion des Factures</h2>
          <p className="text-muted-foreground">
            Suivi des factures générées depuis Pennylane
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Synchroniser Pennylane
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nouvelle Facture
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle facture</DialogTitle>
                <DialogDescription>
                  Remplissez les informations de la facture
                </DialogDescription>
              </DialogHeader>
              <FactureForm
                onSubmit={handleCreateFacture}
                onCancel={() => setIsAddDialogOpen(false)}
                clients={mockClients}
                odrs={mockODRs}
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
            <CardTitle className="text-sm font-medium">Total Factures</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFactures}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures Payées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{facturesPayees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factures Impayées</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{facturesImpayees}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant Impayé</CardTitle>
            <Euro className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('fr-FR', {
                style: 'currency',
                currency: 'EUR'
              }).format(montantImpaye)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher une facture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Factures Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Factures</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>N° Facture</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>ODR Origine</TableHead>
                <TableHead>Montant TTC</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Mode Paiement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFactures.map((facture) => (
                <TableRow key={facture.id}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {facture.numeroFacture}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {facture.date.toLocaleDateString('fr-FR')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{facture.clientNom}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono">
                      {facture.numeroODR}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {new Intl.NumberFormat('fr-FR', {
                        style: 'currency',
                        currency: 'EUR'
                      }).format(facture.montantTTC)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {facture.dateEcheance.toLocaleDateString('fr-FR')}
                    </div>
                    {facture.dateEcheance < new Date() && facture.statut !== 'PAYEE' && (
                      <div className="text-xs text-red-500">
                        Échéance dépassée
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {getStatutBadge(facture.statut)}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {getModePaiementText(facture.modePaiement)}
                    </div>
                    {facture.dateReglement && (
                      <div className="text-xs text-muted-foreground">
                        Réglé le {facture.dateReglement.toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-3 w-3" />
                      </Button>
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