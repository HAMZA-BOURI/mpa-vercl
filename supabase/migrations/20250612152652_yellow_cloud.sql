-- Create indexes for better performance

-- Clients indexes
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_type ON clients(type_client);
CREATE INDEX idx_clients_created_at ON clients(created_at);

-- Vehicules indexes
CREATE INDEX idx_vehicules_immatriculation ON vehicules(immatriculation);
CREATE INDEX idx_vehicules_client_id ON vehicules(client_id);
CREATE INDEX idx_vehicules_marque_modele ON vehicules(marque, modele);

-- Prestations indexes
CREATE INDEX idx_prestations_type_service ON prestations(type_service);
CREATE INDEX idx_prestations_nom ON prestations(nom);

-- Devis indexes
CREATE INDEX idx_devis_client_id ON devis(client_id);
CREATE INDEX idx_devis_vehicule_id ON devis(vehicule_id);
CREATE INDEX idx_devis_statut ON devis(statut);
CREATE INDEX idx_devis_date_creation ON devis(date_creation);
CREATE INDEX idx_devis_date_validite ON devis(date_validite);
CREATE INDEX idx_devis_type_service ON devis(type_service);

-- ODR indexes
CREATE INDEX idx_odr_client_id ON ordres_reparation(client_id);
CREATE INDEX idx_odr_vehicule_id ON ordres_reparation(vehicule_id);
CREATE INDEX idx_odr_statut ON ordres_reparation(statut);
CREATE INDEX idx_odr_date_creation ON ordres_reparation(date_creation);
CREATE INDEX idx_odr_type_service ON ordres_reparation(type_service);

-- Articles indexes
CREATE INDEX idx_articles_devis_devis_id ON articles_devis(devis_id);
CREATE INDEX idx_articles_devis_prestation_id ON articles_devis(prestation_id);
CREATE INDEX idx_articles_odr_ordre_id ON articles_odr(ordre_id);
CREATE INDEX idx_articles_odr_prestation_id ON articles_odr(prestation_id);

-- Factures indexes
CREATE INDEX idx_factures_client_id ON factures(client_id);
CREATE INDEX idx_factures_statut ON factures(statut);
CREATE INDEX idx_factures_date_creation ON factures(date_creation);
CREATE INDEX idx_factures_date_echeance ON factures(date_echeance);
CREATE INDEX idx_factures_numero_odr ON factures(numero_odr);

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);