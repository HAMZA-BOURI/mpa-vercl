'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  Mail, 
  Send, 
  Inbox, 
  Archive, 
  Trash2, 
  Star, 
  Reply, 
  Forward, 
  Search,
  Plus,
  Paperclip,
  Clock,
  AlertCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

// Mock data for emails
const mockEmails = [
  {
    id: '1',
    from: 'martin.dubois@email.com',
    fromName: 'Martin Dubois',
    to: 'contact@mongarage.fr',
    subject: 'Demande de devis pour réparation carrosserie',
    body: 'Bonjour,\n\nJe souhaiterais obtenir un devis pour la réparation de mon pare-chocs avant suite à un petit accrochage. Mon véhicule est une Peugeot 308 de 2020, immatriculation AB-123-CD.\n\nPouvez-vous me dire quand je peux passer pour une estimation ?\n\nCordialement,\nMartin Dubois',
    date: new Date('2024-01-20T14:30:00Z'),
    isRead: false,
    isStarred: true,
    hasAttachment: false,
    category: 'DEVIS'
  },
  {
    id: '2',
    from: 'sophie.lambert@transport-lambert.fr',
    fromName: 'Sophie Lambert',
    to: 'contact@mongarage.fr',
    subject: 'Facture FAC-2024-002 - Demande de délai de paiement',
    body: 'Bonjour,\n\nSuite à quelques difficultés de trésorerie temporaires, je vous demande s\'il serait possible d\'obtenir un délai de paiement pour la facture FAC-2024-002 d\'un montant de 1250€.\n\nJe peux vous proposer un règlement en 2 fois : 50% sous 15 jours et le solde sous 30 jours.\n\nMerci de votre compréhension.\n\nCordialement,\nSophie Lambert',
    date: new Date('2024-01-19T16:45:00Z'),
    isRead: true,
    isStarred: false,
    hasAttachment: true,
    category: 'FACTURE'
  },
  {
    id: '3',
    from: 'pierre.martin@email.com',
    fromName: 'Pierre Martin',
    to: 'contact@mongarage.fr',
    subject: 'Remerciements pour la réparation',
    body: 'Bonjour,\n\nJe tenais à vous remercier pour l\'excellent travail effectué sur ma Renault Clio. La réparation a été parfaite et dans les délais annoncés.\n\nJe n\'hésiterai pas à revenir et à vous recommander.\n\nCordialement,\nPierre Martin',
    date: new Date('2024-01-18T10:15:00Z'),
    isRead: true,
    isStarred: false,
    hasAttachment: false,
    category: 'GENERAL'
  }
]

export default function MailPage() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  })

  const filteredEmails = mockEmails.filter(email => {
    const matchesSearch = email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.body.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === 'ALL' || email.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const selectedEmailData = selectedEmail ? mockEmails.find(e => e.id === selectedEmail) : null

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'DEVIS':
        return 'bg-blue-100 text-blue-800'
      case 'FACTURE':
        return 'bg-orange-100 text-orange-800'
      case 'ODR':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'DEVIS':
        return 'Devis'
      case 'FACTURE':
        return 'Facture'
      case 'ODR':
        return 'ODR'
      default:
        return 'Général'
    }
  }

  const unreadCount = mockEmails.filter(e => !e.isRead).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Boîte Mail</h2>
          <p className="text-muted-foreground">
            Gérez vos emails clients et communications
          </p>
        </div>
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Composer un message</DialogTitle>
              <DialogDescription>
                Envoyer un email à un client
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Destinataire</label>
                <Input
                  placeholder="email@exemple.com"
                  value={composeData.to}
                  onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Objet</label>
                <Input
                  placeholder="Objet du message"
                  value={composeData.subject}
                  onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Votre message..."
                  rows={8}
                  value={composeData.body}
                  onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Button variant="outline" size="sm">
                  <Paperclip className="mr-2 h-4 w-4" />
                  Joindre un fichier
                </Button>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
                    Annuler
                  </Button>
                  <Button>
                    <Send className="mr-2 h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Emails</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEmails.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non Lus</CardTitle>
            <Inbox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favoris</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockEmails.filter(e => e.isStarred).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aujourd'hui</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockEmails.filter(e => 
                format(e.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
              ).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher dans les emails..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Toutes les catégories</SelectItem>
            <SelectItem value="DEVIS">Devis</SelectItem>
            <SelectItem value="FACTURE">Factures</SelectItem>
            <SelectItem value="ODR">ODR</SelectItem>
            <SelectItem value="GENERAL">Général</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Email Interface */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Email List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Inbox className="h-5 w-5" />
              <span>Boîte de Réception</span>
              {unreadCount > 0 && (
                <Badge variant="destructive">{unreadCount}</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              <div className="space-y-1 p-4">
                {filteredEmails.map((email) => (
                  <div
                    key={email.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedEmail === email.id 
                        ? 'bg-primary/10 border border-primary/20' 
                        : 'hover:bg-muted/50'
                    } ${!email.isRead ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
                    onClick={() => setSelectedEmail(email.id)}
                  >
                    <div className="flex items-start justify-between space-x-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className={`text-sm truncate ${!email.isRead ? 'font-semibold' : 'font-medium'}`}>
                            {email.fromName}
                          </p>
                          {email.isStarred && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          )}
                          {email.hasAttachment && (
                            <Paperclip className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                        <p className={`text-sm truncate ${!email.isRead ? 'font-medium' : 'text-muted-foreground'}`}>
                          {email.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {email.body.substring(0, 50)}...
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className={getCategoryColor(email.category)}>
                            {getCategoryLabel(email.category)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {format(email.date, 'dd/MM HH:mm', { locale: fr })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Email Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedEmailData ? 'Lecture du Message' : 'Sélectionnez un Email'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEmailData ? (
              <div className="space-y-6">
                {/* Email Header */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">{selectedEmailData.subject}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>De: {selectedEmailData.fromName} &lt;{selectedEmailData.from}&gt;</span>
                        <span>À: {selectedEmailData.to}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {format(selectedEmailData.date, 'dd MMMM yyyy à HH:mm', { locale: fr })}
                        </span>
                        <Badge variant="outline" className={getCategoryColor(selectedEmailData.category)}>
                          {getCategoryLabel(selectedEmailData.category)}
                        </Badge>
                        {selectedEmailData.hasAttachment && (
                          <Badge variant="outline">
                            <Paperclip className="mr-1 h-3 w-3" />
                            Pièce jointe
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="h-3 w-3" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <Separator />
                </div>

                {/* Email Body */}
                <div className="space-y-4">
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm font-sans">
                      {selectedEmailData.body}
                    </pre>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 pt-4 border-t">
                  <Button>
                    <Reply className="mr-2 h-4 w-4" />
                    Répondre
                  </Button>
                  <Button variant="outline">
                    <Forward className="mr-2 h-4 w-4" />
                    Transférer
                  </Button>
                  <Button variant="outline">
                    <Archive className="mr-2 h-4 w-4" />
                    Archiver
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                <div className="text-center space-y-2">
                  <Mail className="h-12 w-12 mx-auto opacity-50" />
                  <p>Sélectionnez un email pour le lire</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}