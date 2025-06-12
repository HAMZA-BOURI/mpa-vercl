'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Settings, 
  Bot, 
  Mail, 
  CreditCard, 
  Eye, 
  EyeOff, 
  Save,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

// Mock data for current settings
const mockParametres = {
  activationAgentSuivi: true,
  activationAgentODR: true,
  activationAgentEmails: false,
  apiPennylaneKey: 'pk_live_xxxxxxxxxxxxxxxx',
  apiVivawalletKey: '',
  affichagePrixCarrosserie: true,
  affichagePrixMecanique: true,
  modesPaiementAutorises: ['ESPECES', 'CHEQUE', 'VIREMENT', 'TPE_VIVAWALLET'],
  delaiAlerteEcheance: 3
}

export default function ParametresPage() {
  const [settings, setSettings] = useState(mockParametres)
  const [showPennylaneKey, setShowPennylaneKey] = useState(false)
  const [showVivawalletKey, setShowVivawalletKey] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // In production, this would save to the database
    console.log('Saving settings:', settings)
    setHasChanges(false)
    // Show success message
  }

  const modesPaiementOptions = [
    { value: 'ESPECES', label: 'Espèces' },
    { value: 'CHEQUE', label: 'Chèque' },
    { value: 'VIREMENT', label: 'Virement' },
    { value: 'TPE_VIVAWALLET', label: 'TPE Vivawallet' },
    { value: 'CREDIT_INTERNE', label: 'Crédit Interne' },
    { value: 'MIXTE', label: 'Mixte' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Paramètres Système</h2>
          <p className="text-muted-foreground">
            Configuration générale de l'application
          </p>
        </div>
        <Button 
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center space-x-2"
        >
          <Save className="h-4 w-4" />
          <span>Enregistrer</span>
        </Button>
      </div>

      {/* Changes Alert */}
      {hasChanges && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-orange-800">
                Vous avez des modifications non sauvegardées
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Agents Automatiques */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <span>Agents Automatiques</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="agent-suivi">Agent de Suivi</Label>
                <p className="text-sm text-muted-foreground">
                  Surveillance automatique des échéances
                </p>
              </div>
              <Switch
                id="agent-suivi"
                checked={settings.activationAgentSuivi}
                onCheckedChange={(checked) => 
                  handleSettingChange('activationAgentSuivi', checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="agent-odr">Agent ODR</Label>
                <p className="text-sm text-muted-foreground">
                  Gestion automatique des ordres de réparation
                </p>
              </div>
              <Switch
                id="agent-odr"
                checked={settings.activationAgentODR}
                onCheckedChange={(checked) => 
                  handleSettingChange('activationAgentODR', checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="agent-emails">Agent Emails</Label>
                <p className="text-sm text-muted-foreground">
                  Envoi automatique d'emails de rappel
                </p>
              </div>
              <Switch
                id="agent-emails"
                checked={settings.activationAgentEmails}
                onCheckedChange={(checked) => 
                  handleSettingChange('activationAgentEmails', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* APIs Externes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>APIs Externes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pennylane-key">Clé API Pennylane</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="pennylane-key"
                    type={showPennylaneKey ? 'text' : 'password'}
                    value={settings.apiPennylaneKey}
                    onChange={(e) => 
                      handleSettingChange('apiPennylaneKey', e.target.value)
                    }
                    placeholder="Entrez votre clé API Pennylane"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPennylaneKey(!showPennylaneKey)}
                >
                  {showPennylaneKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {settings.apiPennylaneKey && (
                <div className="flex items-center space-x-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-green-600">API configurée</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="vivawallet-key">Clé API Vivawallet</Label>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Input
                    id="vivawallet-key"
                    type={showVivawalletKey ? 'text' : 'password'}
                    value={settings.apiVivawalletKey}
                    onChange={(e) => 
                      handleSettingChange('apiVivawalletKey', e.target.value)
                    }
                    placeholder="Entrez votre clé API Vivawallet"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowVivawalletKey(!showVivawalletKey)}
                >
                  {showVivawalletKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {!settings.apiVivawalletKey && (
                <div className="flex items-center space-x-2 text-sm">
                  <AlertTriangle className="h-3 w-3 text-orange-500" />
                  <span className="text-orange-600">API non configurée</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Affichage des Prix */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Affichage des Prix</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prix-carrosserie">Prix Carrosserie</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher les prix dans les devis carrosserie
                </p>
              </div>
              <Switch
                id="prix-carrosserie"
                checked={settings.affichagePrixCarrosserie}
                onCheckedChange={(checked) => 
                  handleSettingChange('affichagePrixCarrosserie', checked)
                }
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="prix-mecanique">Prix Mécanique</Label>
                <p className="text-sm text-muted-foreground">
                  Afficher les prix dans les devis mécanique
                </p>
              </div>
              <Switch
                id="prix-mecanique"
                checked={settings.affichagePrixMecanique}
                onCheckedChange={(checked) => 
                  handleSettingChange('affichagePrixMecanique', checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Modes de Paiement et Alertes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Paiements et Alertes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Modes de Paiement Autorisés</Label>
              <div className="flex flex-wrap gap-2">
                {modesPaiementOptions.map((mode) => (
                  <Badge
                    key={mode.value}
                    variant={settings.modesPaiementAutorises.includes(mode.value) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newModes = settings.modesPaiementAutorises.includes(mode.value)
                        ? settings.modesPaiementAutorises.filter(m => m !== mode.value)
                        : [...settings.modesPaiementAutorises, mode.value]
                      handleSettingChange('modesPaiementAutorises', newModes)
                    }}
                  >
                    {mode.label}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="delai-alerte">Délai d'Alerte Échéance (jours)</Label>
              <Select
                value={settings.delaiAlerteEcheance.toString()}
                onValueChange={(value) => 
                  handleSettingChange('delaiAlerteEcheance', parseInt(value))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 jour</SelectItem>
                  <SelectItem value="3">3 jours</SelectItem>
                  <SelectItem value="5">5 jours</SelectItem>
                  <SelectItem value="7">7 jours</SelectItem>
                  <SelectItem value="15">15 jours</SelectItem>
                  <SelectItem value="30">30 jours</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Nombre de jours avant échéance pour déclencher une alerte
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Configuration Email</h4>
              <p className="text-sm text-blue-700 mt-1">
                Pour configurer l'envoi d'emails automatiques, assurez-vous que l'agent Email est activé 
                et que vos paramètres SMTP sont correctement configurés dans les variables d'environnement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}