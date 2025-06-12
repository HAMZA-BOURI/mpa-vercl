'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertTriangle, Clock, Euro, Eye } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { fr } from 'date-fns/locale'

interface AlerteFacture {
  id: string
  numeroFacture: string
  clientNom: string
  montant: number
  dateEcheance: Date
  joursRestants: number
  type: 'WARNING' | 'OVERDUE'
}

interface AlertsPanelProps {
  alertes: AlerteFacture[]
}

export function AlertsPanel({ alertes }: AlertsPanelProps) {
  const alertesWarning = alertes.filter(a => a.type === 'WARNING')
  const alertesOverdue = alertes.filter(a => a.type === 'OVERDUE')

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Alertes Échéances Proches */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <span>Factures à Échéance (J-3)</span>
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              {alertesWarning.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {alertesWarning.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Aucune facture à échéance proche</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alertesWarning.map((alerte) => (
                  <div
                    key={alerte.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{alerte.numeroFacture}</span>
                        <Badge variant="outline" className="text-xs">
                          J-{Math.abs(alerte.joursRestants)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alerte.clientNom}
                      </p>
                      <p className="text-sm font-medium">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(alerte.montant)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Échéance: {format(alerte.dateEcheance, 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Factures Impayées */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Factures Impayées</span>
            <Badge variant="destructive">
              {alertesOverdue.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            {alertesOverdue.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Aucune facture impayée</p>
              </div>
            ) : (
              <div className="space-y-3">
                {alertesOverdue.map((alerte) => (
                  <div
                    key={alerte.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{alerte.numeroFacture}</span>
                        <Badge variant="destructive" className="text-xs">
                          +{Math.abs(alerte.joursRestants)} jours
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alerte.clientNom}
                      </p>
                      <p className="text-sm font-medium text-red-600">
                        {new Intl.NumberFormat('fr-FR', {
                          style: 'currency',
                          currency: 'EUR'
                        }).format(alerte.montant)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Échéance dépassée: {format(alerte.dateEcheance, 'dd/MM/yyyy', { locale: fr })}
                      </p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}