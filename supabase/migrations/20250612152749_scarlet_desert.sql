-- Create useful functions

-- Function to get client statistics
CREATE OR REPLACE FUNCTION get_client_stats()
RETURNS TABLE (
    total_clients INTEGER,
    grands_comptes INTEGER,
    nouveaux_clients_mois INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM clients),
        (SELECT COUNT(*)::INTEGER FROM clients WHERE type_client = 'GRAND_COMPTE'),
        (SELECT COUNT(*)::INTEGER FROM clients WHERE date_trunc('month', created_at) = date_trunc('month', NOW()));
END;
$$ LANGUAGE plpgsql;

-- Function to get vehicle statistics
CREATE OR REPLACE FUNCTION get_vehicle_stats()
RETURNS TABLE (
    total_vehicules INTEGER,
    annee_moyenne INTEGER,
    kilometrage_moyen INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM vehicules),
        (SELECT ROUND(AVG(annee))::INTEGER FROM vehicules),
        (SELECT ROUND(AVG(COALESCE(kilometrage, 0)))::INTEGER FROM vehicules);
END;
$$ LANGUAGE plpgsql;

-- Function to generate next client number
CREATE OR REPLACE FUNCTION generate_client_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    next_num INTEGER;
BEGIN
    SELECT nextval('client_number_seq') INTO next_num;
    RETURN 'CLI-' || LPAD(next_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate next devis number
CREATE OR REPLACE FUNCTION generate_devis_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    next_num INTEGER;
    current_year INTEGER;
BEGIN
    SELECT EXTRACT(YEAR FROM NOW()) INTO current_year;
    SELECT nextval('devis_number_seq') INTO next_num;
    RETURN 'DEV-' || current_year || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate next ODR number
CREATE OR REPLACE FUNCTION generate_odr_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    next_num INTEGER;
    current_year INTEGER;
BEGIN
    SELECT EXTRACT(YEAR FROM NOW()) INTO current_year;
    SELECT nextval('odr_number_seq') INTO next_num;
    RETURN 'ODR-' || current_year || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate next facture number
CREATE OR REPLACE FUNCTION generate_facture_number()
RETURNS VARCHAR(20) AS $$
DECLARE
    next_num INTEGER;
    current_year INTEGER;
BEGIN
    SELECT EXTRACT(YEAR FROM NOW()) INTO current_year;
    SELECT nextval('facture_number_seq') INTO next_num;
    RETURN 'FAC-' || current_year || '-' || LPAD(next_num::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to search clients
CREATE OR REPLACE FUNCTION search_clients(search_term TEXT)
RETURNS TABLE (
    id UUID,
    numero_client VARCHAR(20),
    prenom VARCHAR(50),
    nom VARCHAR(50),
    entreprise VARCHAR(100),
    email VARCHAR(100),
    telephone VARCHAR(20),
    type_client type_client,
    nombre_vehicules BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.numero_client,
        c.prenom,
        c.nom,
        c.entreprise,
        c.email,
        c.telephone,
        c.type_client,
        COUNT(v.id) as nombre_vehicules
    FROM clients c
    LEFT JOIN vehicules v ON c.id = v.client_id
    WHERE 
        LOWER(c.nom) LIKE LOWER('%' || search_term || '%') OR
        LOWER(c.prenom) LIKE LOWER('%' || search_term || '%') OR
        LOWER(c.email) LIKE LOWER('%' || search_term || '%') OR
        LOWER(c.numero_client) LIKE LOWER('%' || search_term || '%') OR
        LOWER(COALESCE(c.entreprise, '')) LIKE LOWER('%' || search_term || '%')
    GROUP BY c.id, c.numero_client, c.prenom, c.nom, c.entreprise, c.email, c.telephone, c.type_client
    ORDER BY c.nom, c.prenom;
END;
$$ LANGUAGE plpgsql;