'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { FileText, Wrench, PaintBucket, Euro, Car } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface ActivityItem {
  id: string
  type: 'DEVIS' | 'ODR' | 'FACTURE' | 'CLIENT'
  title: string
  description: string
  amount?: number
  timestamp: Date
  serviceType?: 'CARROSSERIE' | 'MECANIQUE'
}

interface RecentActivityProps {
  activities: ActivityItem[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: string, serviceType?: string) => {
    switch (type) {
      case 'DEVIS':
        return <FileText className="h-4 w-4" />
      case 'ODR':
        return serviceType === 'CARROSSERIE' ? 
          <PaintBucket className="h-4 w-4" /> : 
          <Wrench className="h-4 w-4" />
      case 'FACTURE':
        return <Euro className="h-4 w-4" />
      case 'CLIENT':
        return <Car className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'DEVIS':
        return 'bg-blue-100 text-blue-700'
      case 'ODR':
        return 'bg-green-100 text-green-700'
      case 'FACTURE':
        return 'bg-orange-100 text-orange-700'
      case 'CLIENT':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={getTypeColor(activity.type)}>
                    {getIcon(activity.type, activity.serviceType)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <div className="flex items-center space-x-2">
                      {activity.amount && (
                        <span className="text-sm font-medium text-green-600">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(activity.amount)}
                        </span>
                      )}
                      {activity.serviceType && (
                        <Badge variant="outline" className="text-xs">
                          {activity.serviceType === 'CARROSSERIE' ? 'Carrosserie' : 'Mécanique'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(activity.timestamp, 'dd/MM/yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}