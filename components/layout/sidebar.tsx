'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'
import {
  LayoutDashboard,
  Users,
  Car,
  FileText,
  Receipt,
  Package,
  Settings,
  Mail,
  User,
  ChevronLeft,
  Wrench,
  PaintBucket
} from 'lucide-react'

const menuItems = [
  {
    title: 'Tableau de Bord',
    href: '/',
    icon: LayoutDashboard
  },
  {
    title: 'Clients',
    href: '/clients',
    icon: Users
  },
  {
    title: 'Véhicules',
    href: '/vehicules',
    icon: Car
  },
  {
    title: 'Devis',
    href: '/devis',
    icon: FileText
  },
  {
    title: 'Ordres de Réparation',
    href: '/odr',
    icon: Wrench
  },
  {
    title: 'Factures',
    href: '/factures',
    icon: Receipt
  },
  {
    title: 'Prestations',
    href: '/prestations',
    icon: Package
  },
  {
    title: 'Carrosserie',
    href: '/prestations?tab=carrosserie',
    icon: PaintBucket,
    parent: '/prestations'
  },
  {
    title: 'Mécanique',
    href: '/prestations?tab=mecanique',
    icon: Wrench,
    parent: '/prestations'
  },
  {
    title: 'Paramètres',
    href: '/parametres',
    icon: Settings
  },
  {
    title: 'Boîte Mail',
    href: '/mail',
    icon: Mail
  },
  {
    title: 'Profil',
    href: '/profil',
    icon: User
  }
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    if (href.includes('?tab=')) {
      const basePath = href.split('?')[0]
      return pathname === basePath
    }
    return pathname === href
  }

  return (
    <div className={cn(
      "relative flex h-screen flex-col bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="relative h-10 w-12">
              <Image
                src="/logo-mpa-garage.png"
                alt="MPA Garage"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-semibold text-lg">MPA Garage</span>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center w-full">
            <div className="relative h-8 w-10">
              <Image
                src="/logo-mpa-garage.png"
                alt="MPA Garage"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )} />
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.filter(item => !item.parent).map((item) => (
            <div key={item.href}>
              <Button
                asChild
                variant={isActiveLink(item.href) ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-10",
                  collapsed && "h-10 w-10 p-0 justify-center"
                )}
              >
                <Link href={item.href}>
                  <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </Button>
              
              {/* Sub-menu items */}
              {!collapsed && item.href === '/prestations' && (
                <div className="ml-6 mt-2 space-y-1">
                  {menuItems.filter(subItem => subItem.parent === item.href).map((subItem) => (
                    <Button
                      key={subItem.href}
                      asChild
                      variant={isActiveLink(subItem.href) ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start h-8"
                    >
                      <Link href={subItem.href}>
                        <subItem.icon className="h-3 w-3 mr-2" />
                        <span className="text-sm">{subItem.title}</span>
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium">MPA Garage</p>
            <p>Version 1.0.0</p>
          </div>
        </div>
      )}
    </div>
  )
}