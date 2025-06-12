-- Insert sample data

-- Insert default parameters
INSERT INTO parametres (
    activation_agent_suivi,
    activation_agent_odr,
    activation_agent_emails,
    affichage_prix_carrosserie,
    affichage_prix_mecanique,
    modes_paiement_autorises,
    delai_alerte_echeance
) VALUES (
    TRUE,
    TRUE,
    FALSE,
    TRUE,
    TRUE,
    ARRAY['ESPECES', 'CHEQUE', 'VIREMENT']::mode_paiement[],
    3
);

-- Insert default admin user (password: admin123)
INSERT INTO users (email, password_hash, nom, prenom, role) VALUES 
('admin@mongarage.fr', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'Garage', 'ADMIN');

-- Insert sample clients
INSERT INTO clients (prenom, nom, entreprise, telephone, email, adresse, ville, code_postal, type_client) VALUES 
('Martin', 'Dubois', NULL, '06.12.34.56.78', 'martin.dubois@email.com', '123 Rue de la Paix', 'Paris', '75001', 'NORMAL'),
('Sophie', 'Lambert', 'Transport Lambert SARL', '01.23.45.67.89', 'contact@transport-lambert.fr', '45 Avenue des Champs', 'Lyon', '69000', 'GRAND_COMPTE'),
('Pierre', 'Martin', NULL, '04.56.78.90.12', 'pierre.martin@email.com', '78 Boulevard de la République', 'Marseille', '13000', 'NORMAL'),
('Marie', 'Durand', 'Garage Centrale', '02.34.56.78.90', 'marie.durand@garage-centrale.fr', '12 Rue de l\'Industrie', 'Toulouse', '31000', 'GRAND_COMPTE');

-- Insert sample vehicules
INSERT INTO vehicules (immatriculation, marque, modele, annee, numero_serie, kilometrage, client_id) VALUES 
('AB-123-CD', 'Peugeot', '308', 2020, 'VF3XXXXXXXXXXXXX1', 45000, (SELECT id FROM clients WHERE email = 'martin.dubois@email.com')),
('EF-456-GH', 'Renault', 'Clio', 2019, 'VF1XXXXXXXXXXXXX2', 62000, (SELECT id FROM clients WHERE email = 'contact@transport-lambert.fr')),
('IJ-789-KL', 'Citroën', 'C3', 2021, 'VF7XXXXXXXXXXXXX3', 25000, (SELECT id FROM clients WHERE email = 'pierre.martin@email.com')),
('MN-012-OP', 'Ford', 'Transit', 2018, 'WF0XXXXXXXXXXXXX4', 85000, (SELECT id FROM clients WHERE email = 'marie.durand@garage-centrale.fr'));

-- Insert sample prestations
INSERT INTO prestations (nom, description, type_service, prix_de_base) VALUES 
('Réparation pare-chocs avant', 'Réparation complète du pare-chocs avant avec peinture', 'CARROSSERIE', 450.00),
('Peinture portière', 'Peinture complète d''une portière avec apprêt', 'CARROSSERIE', 320.00),
('Réparation rayure profonde', 'Réparation et peinture d''une rayure profonde', 'CARROSSERIE', 180.00),
('Vidange moteur', 'Vidange complète avec changement du filtre à huile', 'MECANIQUE', 85.00),
('Changement plaquettes de frein', 'Remplacement des plaquettes de frein avant', 'MECANIQUE', 120.00),
('Diagnostic moteur', 'Diagnostic complet du moteur avec valise', 'MECANIQUE', 95.00),
('Révision complète', 'Révision complète du véhicule selon préconisations constructeur', 'MECANIQUE', 250.00);

-- Insert sample forfaits
INSERT INTO forfaits (nom, marque_vehicule, modele_vehicule, prix, description, prestation_id) VALUES 
('Forfait carrosserie Peugeot 308', 'Peugeot', '308', 850.00, 'Forfait complet carrosserie pour Peugeot 308', (SELECT id FROM prestations WHERE nom = 'Réparation pare-chocs avant')),
('Forfait révision Renault Clio', 'Renault', 'Clio', 180.00, 'Forfait révision complète pour Renault Clio', (SELECT id FROM prestations WHERE nom = 'Révision complète'));

-- Insert sample devis
INSERT INTO devis (client_id, vehicule_id, type_service, date_validite, conditions_paiement, pourcentage_acompte) VALUES 
(
    (SELECT id FROM clients WHERE email = 'martin.dubois@email.com'),
    (SELECT id FROM vehicules WHERE immatriculation = 'AB-123-CD'),
    'CARROSSERIE',
    NOW() + INTERVAL '30 days',
    'Paiement à 30 jours',
    30
),
(
    (SELECT id FROM clients WHERE email = 'contact@transport-lambert.fr'),
    (SELECT id FROM vehicules WHERE immatriculation = 'EF-456-GH'),
    'MECANIQUE',
    NOW() + INTERVAL '30 days',
    'Paiement à 15 jours',
    0
);

-- Insert sample articles for devis
INSERT INTO articles_devis (numero_article, designation, prix_unitaire_ttc, quantite, total_ttc, devis_id, prestation_id) VALUES 
('ART-001', 'Réparation pare-chocs avant', 450.00, 1, 450.00, (SELECT id FROM devis LIMIT 1), (SELECT id FROM prestations WHERE nom = 'Réparation pare-chocs avant')),
('ART-002', 'Peinture portière droite', 320.00, 1, 320.00, (SELECT id FROM devis LIMIT 1), (SELECT id FROM prestations WHERE nom = 'Peinture portière'));

INSERT INTO articles_devis (numero_article, designation, prix_unitaire_ttc, quantite, total_ttc, devis_id, prestation_id) VALUES 
('ART-001', 'Révision complète', 250.00, 1, 250.00, (SELECT id FROM devis OFFSET 1 LIMIT 1), (SELECT id FROM prestations WHERE nom = 'Révision complète')),
('ART-002', 'Changement plaquettes de frein', 120.00, 1, 120.00, (SELECT id FROM devis OFFSET 1 LIMIT 1), (SELECT id FROM prestations WHERE nom = 'Changement plaquettes de frein'));

-- Insert sample ODR
INSERT INTO ordres_reparation (client_id, vehicule_id, type_service, observations) VALUES 
(
    (SELECT id FROM clients WHERE email = 'pierre.martin@email.com'),
    (SELECT id FROM vehicules WHERE immatriculation = 'IJ-789-KL'),
    'MECANIQUE',
    'Problème de démarrage à froid'
),
(
    (SELECT id FROM clients WHERE email = 'marie.durand@garage-centrale.fr'),
    (SELECT id FROM vehicules WHERE immatriculation = 'MN-012-OP'),
    'CARROSSERIE',
    'Rayures sur le côté droit du véhicule'
);

-- Insert sample articles for ODR
INSERT INTO articles_odr (numero_article, designation, prix_unitaire_ttc, quantite, total_ttc, ordre_id, prestation_id) VALUES 
('ART-001', 'Diagnostic moteur', 95.00, 1, 95.00, (SELECT id FROM ordres_reparation LIMIT 1), (SELECT id FROM prestations WHERE nom = 'Diagnostic moteur')),
('ART-002', 'Vidange moteur', 85.00, 1, 85.00, (SELECT id FROM ordres_reparation LIMIT 1), (SELECT id FROM prestations WHERE nom = 'Vidange moteur'));

INSERT INTO articles_odr (numero_article, designation, prix_unitaire_ttc, quantite, total_ttc, ordre_id, prestation_id) VALUES 
('ART-001', 'Réparation rayure profonde', 180.00, 3, 540.00, (SELECT id FROM ordres_reparation OFFSET 1 LIMIT 1), (SELECT id FROM prestations WHERE nom = 'Réparation rayure profonde'));

-- Insert sample factures
INSERT INTO factures (client_id, montant_ttc, date_echeance, statut, numero_odr) VALUES 
(
    (SELECT id FROM clients WHERE email = 'martin.dubois@email.com'),
    850.50,
    NOW() + INTERVAL '30 days',
    'EN_ATTENTE',
    'ODR-2024-001'
),
(
    (SELECT id FROM clients WHERE email = 'contact@transport-lambert.fr'),
    1250.00,
    NOW() - INTERVAL '5 days',
    'IMPAYEE',
    'ODR-2024-002'
),
(
    (SELECT id FROM clients WHERE email = 'pierre.martin@email.com'),
    450.75,
    NOW() + INTERVAL '15 days',
    'PAYEE',
    'ODR-2024-003'
);