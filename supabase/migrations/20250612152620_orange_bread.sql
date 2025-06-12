-- Create the main database
CREATE DATABASE garage_billing;

-- Connect to the database
\c garage_billing;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types (enums)
CREATE TYPE type_client AS ENUM ('NORMAL', 'GRAND_COMPTE');
CREATE TYPE type_service AS ENUM ('CARROSSERIE', 'MECANIQUE');
CREATE TYPE statut_devis AS ENUM ('EN_ATTENTE', 'ACCEPTE', 'REFUSE', 'EXPIRE');
CREATE TYPE statut_odr AS ENUM ('EN_COURS', 'TERMINE', 'ANNULE');
CREATE TYPE statut_facture AS ENUM ('EN_ATTENTE', 'PAYEE', 'PARTIELLEMENT_PAYEE', 'IMPAYEE', 'ANNULEE');
CREATE TYPE mode_paiement AS ENUM ('ESPECES', 'CHEQUE', 'VIREMENT', 'TPE_VIVAWALLET', 'CREDIT_INTERNE', 'MIXTE');

-- Create sequence for client numbers
CREATE SEQUENCE client_number_seq START 1;

-- Create sequence for devis numbers
CREATE SEQUENCE devis_number_seq START 1;

-- Create sequence for ODR numbers
CREATE SEQUENCE odr_number_seq START 1;

-- Create sequence for facture numbers
CREATE SEQUENCE facture_number_seq START 1;