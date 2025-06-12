-- Create useful views for reporting

-- View: Client summary with vehicle count
CREATE VIEW v_clients_summary AS
SELECT 
    c.id,
    c.numero_client,
    c.prenom,
    c.nom,
    c.entreprise,
    c.email,
    c.telephone,
    c.type_client,
    COUNT(v.id) as nombre_vehicules,
    c.created_at
FROM clients c
LEFT JOIN vehicules v ON c.id = v.client_id
GROUP BY c.id, c.numero_client, c.prenom, c.nom, c.entreprise, c.email, c.telephone, c.type_client, c.created_at;

-- View: Devis with client and vehicle info
CREATE VIEW v_devis_details AS
SELECT 
    d.id,
    d.numero_devis,
    d.date_creation,
    d.date_validite,
    d.statut,
    d.type_service,
    d.total_ttc,
    c.prenom || ' ' || c.nom as client_nom,
    c.numero_client,
    v.marque || ' ' || v.modele as vehicule,
    v.immatriculation
FROM devis d
JOIN clients c ON d.client_id = c.id
JOIN vehicules v ON d.vehicule_id = v.id;

-- View: ODR with client and vehicle info
CREATE VIEW v_odr_details AS
SELECT 
    o.id,
    o.numero_odr,
    o.date_creation,
    o.statut,
    o.type_service,
    o.montant_total,
    o.observations,
    c.prenom || ' ' || c.nom as client_nom,
    c.numero_client,
    v.marque || ' ' || v.modele as vehicule,
    v.immatriculation
FROM ordres_reparation o
JOIN clients c ON o.client_id = c.id
JOIN vehicules v ON o.vehicule_id = v.id;

-- View: Factures with client info
CREATE VIEW v_factures_details AS
SELECT 
    f.id,
    f.numero_facture,
    f.date_creation,
    f.date_echeance,
    f.montant_ttc,
    f.statut,
    f.mode_paiement,
    f.date_reglement,
    f.numero_odr,
    c.prenom || ' ' || c.nom as client_nom,
    c.numero_client,
    c.email as client_email,
    CASE 
        WHEN f.date_echeance < NOW() AND f.statut != 'PAYEE' THEN TRUE
        ELSE FALSE
    END as est_en_retard
FROM factures f
JOIN clients c ON f.client_id = c.id;

-- View: Dashboard metrics
CREATE VIEW v_dashboard_metrics AS
SELECT 
    (SELECT COUNT(*) FROM clients) as total_clients,
    (SELECT COUNT(*) FROM clients WHERE type_client = 'GRAND_COMPTE') as grands_comptes,
    (SELECT COUNT(*) FROM ordres_reparation WHERE DATE(date_creation) = CURRENT_DATE) as odr_jour,
    (SELECT COUNT(*) FROM ordres_reparation WHERE EXTRACT(MONTH FROM date_creation) = EXTRACT(MONTH FROM NOW()) AND EXTRACT(YEAR FROM date_creation) = EXTRACT(YEAR FROM NOW())) as odr_mois,
    (SELECT COUNT(*) FROM ordres_reparation WHERE EXTRACT(YEAR FROM date_creation) = EXTRACT(YEAR FROM NOW())) as odr_annee,
    (SELECT COALESCE(SUM(montant_total), 0) FROM ordres_reparation WHERE DATE(date_creation) = CURRENT_DATE) as montant_jour,
    (SELECT COALESCE(SUM(montant_total), 0) FROM ordres_reparation WHERE EXTRACT(MONTH FROM date_creation) = EXTRACT(MONTH FROM NOW()) AND EXTRACT(YEAR FROM date_creation) = EXTRACT(YEAR FROM NOW())) as montant_mois,
    (SELECT COALESCE(SUM(montant_total), 0) FROM ordres_reparation WHERE EXTRACT(YEAR FROM date_creation) = EXTRACT(YEAR FROM NOW())) as montant_annee,
    (SELECT COUNT(*) FROM factures WHERE statut = 'EN_ATTENTE') as factures_en_cours,
    (SELECT COUNT(*) FROM factures WHERE statut = 'IMPAYEE') as factures_impayees;

-- View: Alerts for overdue invoices
CREATE VIEW v_alertes_factures AS
SELECT 
    f.id,
    f.numero_facture,
    c.prenom || ' ' || c.nom as client_nom,
    f.montant_ttc,
    f.date_echeance,
    EXTRACT(DAYS FROM (NOW() - f.date_echeance))::INTEGER as jours_retard,
    CASE 
        WHEN f.date_echeance < NOW() THEN 'OVERDUE'
        WHEN f.date_echeance <= NOW() + INTERVAL '3 days' THEN 'WARNING'
        ELSE 'OK'
    END as type_alerte
FROM factures f
JOIN clients c ON f.client_id = c.id
WHERE f.statut IN ('EN_ATTENTE', 'IMPAYEE')
AND (f.date_echeance < NOW() OR f.date_echeance <= NOW() + INTERVAL '3 days')
ORDER BY f.date_echeance ASC;