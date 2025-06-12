'use client'

import { Button } from '@/components/ui/button'
import { Wrench, PaintBucket, LayoutGrid } from 'lucide-react'

interface ActivityFilterProps {
  selectedActivity: 'ALL' | 'CARROSSERIE' | 'MECANIQUE'
  onActivityChange: (activity: 'ALL' | 'CARROSSERIE' | 'MECANIQUE') => void
}

export function ActivityFilter({ selectedActivity, onActivityChange }: ActivityFilterProps) {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-muted-foreground">Filtrer par activité:</span>
      <div className="flex space-x-1">
        <Button
          variant={selectedActivity === 'ALL' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onActivityChange('ALL')}
          className="h-8"
        >
          <LayoutGrid className="h-3 w-3 mr-1" />
          Toutes
        </Button>
        <Button
          variant={selectedActivity === 'CARROSSERIE' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onActivityChange('CARROSSERIE')}
          className="h-8"
        >
          <PaintBucket className="h-3 w-3 mr-1" />
          Carrosserie
        </Button>
        <Button
          variant={selectedActivity === 'MECANIQUE' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onActivityChange('MECANIQUE')}
          className="h-8"
        >
          <Wrench className="h-3 w-3 mr-1" />
          Mécanique
        </Button>
      </div>
    </div>
  )
}