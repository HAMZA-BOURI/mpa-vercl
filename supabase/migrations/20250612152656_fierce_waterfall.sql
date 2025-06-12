-- Create triggers for automatic updates

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at column
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicules_updated_at BEFORE UPDATE ON vehicules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prestations_updated_at BEFORE UPDATE ON prestations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forfaits_updated_at BEFORE UPDATE ON forfaits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devis_updated_at BEFORE UPDATE ON devis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_odr_updated_at BEFORE UPDATE ON ordres_reparation
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_factures_updated_at BEFORE UPDATE ON factures
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parametres_updated_at BEFORE UPDATE ON parametres
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically calculate totals for devis
CREATE OR REPLACE FUNCTION calculate_devis_totals()
RETURNS TRIGGER AS $$
DECLARE
    total_ht_calc DECIMAL(10,2);
    tva_calc DECIMAL(10,2);
    total_ttc_calc DECIMAL(10,2);
BEGIN
    -- Calculate totals from articles
    SELECT COALESCE(SUM(total_ttc), 0) INTO total_ttc_calc
    FROM articles_devis 
    WHERE devis_id = NEW.id;
    
    -- Calculate HT and TVA (assuming 20% TVA)
    total_ht_calc := total_ttc_calc / 1.20;
    tva_calc := total_ttc_calc - total_ht_calc;
    
    -- Update the devis
    UPDATE devis 
    SET total_ht = total_ht_calc,
        montant_tva = tva_calc,
        total_ttc = total_ttc_calc
    WHERE id = NEW.id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to automatically calculate totals for ODR
CREATE OR REPLACE FUNCTION calculate_odr_totals()
RETURNS TRIGGER AS $$
DECLARE
    total_calc DECIMAL(10,2);
BEGIN
    -- Calculate total from articles
    SELECT COALESCE(SUM(total_ttc), 0) INTO total_calc
    FROM articles_odr 
    WHERE ordre_id = NEW.ordre_id;
    
    -- Update the ODR
    UPDATE ordres_reparation 
    SET montant_total = total_calc
    WHERE id = NEW.ordre_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply calculation triggers
CREATE TRIGGER trigger_calculate_devis_totals 
    AFTER INSERT OR UPDATE OR DELETE ON articles_devis
    FOR EACH ROW EXECUTE FUNCTION calculate_devis_totals();

CREATE TRIGGER trigger_calculate_odr_totals 
    AFTER INSERT OR UPDATE OR DELETE ON articles_odr
    FOR EACH ROW EXECUTE FUNCTION calculate_odr_totals();