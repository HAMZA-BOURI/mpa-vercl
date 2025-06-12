-- Table: clients
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_client VARCHAR(20) UNIQUE NOT NULL DEFAULT ('CLI-' || LPAD(nextval('client_number_seq')::TEXT, 3, '0')),
    prenom VARCHAR(50) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    entreprise VARCHAR(100),
    telephone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    adresse VARCHAR(200) NOT NULL,
    ville VARCHAR(50) NOT NULL,
    code_postal VARCHAR(10) NOT NULL,
    type_client type_client DEFAULT 'NORMAL',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: vehicules
CREATE TABLE vehicules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    immatriculation VARCHAR(20) UNIQUE NOT NULL,
    marque VARCHAR(50) NOT NULL,
    modele VARCHAR(50) NOT NULL,
    annee INTEGER NOT NULL CHECK (annee >= 1900 AND annee <= EXTRACT(YEAR FROM NOW()) + 1),
    numero_serie VARCHAR(50),
    kilometrage INTEGER CHECK (kilometrage >= 0),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: prestations
CREATE TABLE prestations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    type_service type_service NOT NULL,
    prix_de_base DECIMAL(10,2) NOT NULL CHECK (prix_de_base > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: forfaits
CREATE TABLE forfaits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom VARCHAR(100) NOT NULL,
    marque_vehicule VARCHAR(50) NOT NULL,
    modele_vehicule VARCHAR(50) NOT NULL,
    prix DECIMAL(10,2) NOT NULL CHECK (prix > 0),
    description TEXT,
    prestation_id UUID REFERENCES prestations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: devis
CREATE TABLE devis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_devis VARCHAR(20) UNIQUE NOT NULL DEFAULT ('DEV-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('devis_number_seq')::TEXT, 3, '0')),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_validite TIMESTAMP WITH TIME ZONE NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    vehicule_id UUID NOT NULL REFERENCES vehicules(id) ON DELETE CASCADE,
    statut statut_devis DEFAULT 'EN_ATTENTE',
    type_service type_service NOT NULL,
    total_ht DECIMAL(10,2) NOT NULL DEFAULT 0,
    montant_tva DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_ttc DECIMAL(10,2) NOT NULL DEFAULT 0,
    conditions_paiement TEXT,
    pourcentage_acompte DECIMAL(5,2) DEFAULT 0 CHECK (pourcentage_acompte >= 0 AND pourcentage_acompte <= 100),
    moyens_paiement_acceptes mode_paiement[],
    compte_bancaire VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: ordres_reparation
CREATE TABLE ordres_reparation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_odr VARCHAR(20) UNIQUE NOT NULL DEFAULT ('ODR-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('odr_number_seq')::TEXT, 3, '0')),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_validite TIMESTAMP WITH TIME ZONE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    vehicule_id UUID NOT NULL REFERENCES vehicules(id) ON DELETE CASCADE,
    statut statut_odr DEFAULT 'EN_COURS',
    type_service type_service NOT NULL,
    montant_total DECIMAL(10,2) NOT NULL DEFAULT 0,
    observations TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: articles_devis
CREATE TABLE articles_devis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_article VARCHAR(20) NOT NULL,
    designation TEXT NOT NULL,
    prix_unitaire_ttc DECIMAL(10,2) NOT NULL CHECK (prix_unitaire_ttc > 0),
    quantite INTEGER NOT NULL CHECK (quantite > 0),
    total_ttc DECIMAL(10,2) NOT NULL CHECK (total_ttc > 0),
    devis_id UUID NOT NULL REFERENCES devis(id) ON DELETE CASCADE,
    prestation_id UUID REFERENCES prestations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: articles_odr
CREATE TABLE articles_odr (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_article VARCHAR(20) NOT NULL,
    designation TEXT NOT NULL,
    prix_unitaire_ttc DECIMAL(10,2) NOT NULL CHECK (prix_unitaire_ttc > 0),
    quantite INTEGER NOT NULL CHECK (quantite > 0),
    total_ttc DECIMAL(10,2) NOT NULL CHECK (total_ttc > 0),
    ordre_id UUID NOT NULL REFERENCES ordres_reparation(id) ON DELETE CASCADE,
    prestation_id UUID REFERENCES prestations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: factures
CREATE TABLE factures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    numero_facture VARCHAR(20) UNIQUE NOT NULL DEFAULT ('FAC-' || EXTRACT(YEAR FROM NOW()) || '-' || LPAD(nextval('facture_number_seq')::TEXT, 3, '0')),
    date_creation TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    date_echeance TIMESTAMP WITH TIME ZONE NOT NULL,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    montant_ttc DECIMAL(10,2) NOT NULL CHECK (montant_ttc > 0),
    statut statut_facture DEFAULT 'EN_ATTENTE',
    mode_paiement mode_paiement,
    date_reglement TIMESTAMP WITH TIME ZONE,
    numero_odr VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: parametres
CREATE TABLE parametres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activation_agent_suivi BOOLEAN DEFAULT TRUE,
    activation_agent_odr BOOLEAN DEFAULT TRUE,
    activation_agent_emails BOOLEAN DEFAULT TRUE,
    api_pennylane_key VARCHAR(255),
    api_vivawallet_key VARCHAR(255),
    affichage_prix_carrosserie BOOLEAN DEFAULT TRUE,
    affichage_prix_mecanique BOOLEAN DEFAULT TRUE,
    modes_paiement_autorises mode_paiement[] DEFAULT ARRAY['ESPECES', 'CHEQUE', 'VIREMENT']::mode_paiement[],
    delai_alerte_echeance INTEGER DEFAULT 3 CHECK (delai_alerte_echeance > 0),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: users (for authentication)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(50) NOT NULL,
    prenom VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    avatar_url VARCHAR(255),
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);