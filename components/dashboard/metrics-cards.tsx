'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Crown, 
  ClipboardList, 
  Euro, 
  FileText, 
  AlertTriangle,
  TrendingUp,
  Calendar
} from 'lucide-react'

interface MetricsCardsProps {
  metrics: {
    totalClients: number
    grandsComptes: number
    odrJour: number
    odrMois: number
    odrAnnee: number
    montantJour: number
    montantMois: number
    montantAnnee: number
    facturesEnCours: number
    facturesImpayees: number
  }
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Clients */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Clients Total</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.totalClients}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Crown className="h-3 w-3" />
            <span>{metrics.grandsComptes} grands comptes</span>
          </div>
        </CardContent>
      </Card>

      {/* ODR Aujourd'hui */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">ODR Aujourd'hui</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.odrJour}</div>
          <div className="flex items-center space-x-2 text-xs">
            <TrendingUp className="h-3 w-3 text-green-500" />
            <span className="text-muted-foreground">
              {metrics.odrMois} ce mois • {metrics.odrAnnee} cette année
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Montant Facturé Jour */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">CA Aujourd'hui</CardTitle>
          <Euro className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(metrics.montantJour)}
          </div>
          <div className="text-xs text-muted-foreground">
            Mois: {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(metrics.montantMois)} • 
            Année: {new Intl.NumberFormat('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            }).format(metrics.montantAnnee)}
          </div>
        </CardContent>
      </Card>

      {/* Factures */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">État Factures</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div>
              <div className="text-xl font-bold">{metrics.facturesEnCours}</div>
              <div className="text-xs text-muted-foreground">En cours</div>
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-xl font-bold text-orange-600">
                  {metrics.facturesImpayees}
                </span>
              </div>
              <div className="text-xs text-muted-foreground">Impayées</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}