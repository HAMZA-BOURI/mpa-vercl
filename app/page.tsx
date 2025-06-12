'use client'

import { useState, useEffect } from 'react'
import { MetricsCards } from '@/components/dashboard/metrics-cards'
import { ActivityFilter } from '@/components/dashboard/activity-filter'
import { AlertsPanel } from '@/components/dashboard/alerts-panel'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { getDashboardMetrics } from '@/lib/mock-data'

// Mock data for alerts and activities
const mockAlertes = [
  {
    id: '1',
    numeroFacture: 'FAC-2024-001',
    clientNom: 'Martin Dubois',
    montant: 850.50,
    dateEcheance: new Date('2024-01-22T00:00:00Z'),
    joursRestants: -2,
    type: 'WARNING' as const
  },
  {
    id: '2',
    numeroFacture: 'FAC-2024-002',
    clientNom: 'Garage Centrale',
    montant: 1250.00,
    dateEcheance: new Date('2024-01-15T00:00:00Z'),
    joursRestants: 5,
    type: 'OVERDUE' as const
  },
  {
    id: '3',
    numeroFacture: 'FAC-2024-003',
    clientNom: 'Sophie Lambert',
    montant: 450.75,
    dateEcheance: new Date('2024-01-21T00:00:00Z'),
    joursRestants: -1,
    type: 'WARNING' as const
  }
]

const mockActivities = [
  {
    id: '1',
    type: 'ODR' as const,
    title: 'Nouvel ODR créé',
    description: 'ODR-2024-012 - Réparation carrosserie pour Martin Dubois',
    amount: 850.50,
    timestamp: new Date('2024-01-20T16:00:00Z'),
    serviceType: 'CARROSSERIE' as const
  },
  {
    id: '2',
    type: 'FACTURE' as const,
    title: 'Facture payée',
    description: 'FAC-2024-008 - Paiement reçu par virement',
    amount: 1200.00,
    timestamp: new Date('2024-01-20T14:00:00Z')
  },
  {
    id: '3',
    type: 'DEVIS' as const,
    title: 'Devis accepté',
    description: 'DEV-2024-025 - Révision complète acceptée',
    amount: 450.00,
    timestamp: new Date('2024-01-20T12:00:00Z'),
    serviceType: 'MECANIQUE' as const
  },
  {
    id: '4',
    type: 'CLIENT' as const,
    title: 'Nouveau client',
    description: 'Inscription de Sophie Martin - Grand compte',
    timestamp: new Date('2024-01-20T10:00:00Z')
  }
]

export default function Dashboard() {
  const [selectedActivity, setSelectedActivity] = useState<'ALL' | 'CARROSSERIE' | 'MECANIQUE'>('ALL')
  const [metrics, setMetrics] = useState(getDashboardMetrics())

  // Refresh metrics when component mounts or when activity filter changes
  useEffect(() => {
    setMetrics(getDashboardMetrics())
  }, [selectedActivity])

  return (
    <div className="space-y-6">
      {/* Header avec filtre d'activité */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
          <p className="text-muted-foreground">
            Vue d'ensemble de l'activité de votre garage
          </p>
        </div>
        <ActivityFilter 
          selectedActivity={selectedActivity}
          onActivityChange={setSelectedActivity}
        />
      </div>

      {/* Métriques principales */}
      <MetricsCards metrics={metrics} />

      {/* Alertes */}
      <AlertsPanel alertes={mockAlertes} />

      {/* Activité récente */}
      <RecentActivity activities={mockActivities} />
    </div>
  )
}