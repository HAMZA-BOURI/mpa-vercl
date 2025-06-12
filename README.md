# Garage Management System - Database Setup

This project includes a complete PostgreSQL database setup for a garage management system with Docker support.

## Database Features

### Tables Created
- **clients** - Customer management with contact information
- **vehicules** - Vehicle registration and tracking
- **prestations** - Service catalog for carrosserie and mécanique
- **forfaits** - Package deals for specific vehicle models
- **devis** - Quote management with line items
- **ordres_reparation** - Work order tracking
- **articles_devis** - Quote line items
- **articles_odr** - Work order line items
- **factures** - Invoice management
- **parametres** - System configuration
- **users** - User authentication

### Key Features
- **Automatic numbering** for clients, devis, ODR, and factures
- **Automatic total calculations** for devis and ODR
- **Comprehensive indexing** for performance
- **Data validation** with constraints and checks
- **Audit trails** with created_at/updated_at timestamps
- **Sample data** for testing and development

## Quick Start

### Option 1: Docker Setup (Recommended)

1. **Start the database:**
```bash
docker-compose up -d
```

2. **Access the database:**
- **PostgreSQL**: localhost:5432
- **PgAdmin**: http://localhost:8080
  - Email: admin@garage.local
  - Password: admin123

3. **Connect to database in PgAdmin:**
- Host: postgres
- Port: 5432
- Database: garage_billing
- Username: garage_user
- Password: garage_password

### Option 2: Local PostgreSQL Setup

1. **Install PostgreSQL** (version 15 or higher)

2. **Create database and user:**
```sql
CREATE USER garage_user WITH PASSWORD 'garage_password';
CREATE DATABASE garage_billing OWNER garage_user;
GRANT ALL PRIVILEGES ON DATABASE garage_billing TO garage_user;
```

3. **Run initialization scripts:**
```bash
psql -U garage_user -d garage_billing -f database/init/01-create-database.sql
psql -U garage_user -d garage_billing -f database/init/02-create-tables.sql
psql -U garage_user -d garage_billing -f database/init/03-create-indexes.sql
psql -U garage_user -d garage_billing -f database/init/04-create-triggers.sql
psql -U garage_user -d garage_billing -f database/init/05-insert-sample-data.sql
psql -U garage_user -d garage_billing -f database/init/06-create-views.sql
psql -U garage_user -d garage_billing -f database/init/07-create-functions.sql
```

## Database Schema Overview

### Core Entities
- **Clients**: Customer information with support for individual and business clients
- **Vehicules**: Vehicle registration linked to clients
- **Prestations**: Service catalog with pricing
- **Devis**: Quotes with multiple line items
- **ODR**: Work orders for actual repairs
- **Factures**: Invoices with payment tracking

### Business Logic
- Automatic calculation of totals including VAT
- Sequential numbering for all documents
- Status tracking for quotes, work orders, and invoices
- Support for both carrosserie and mécanique services

### Sample Data Included
- 4 sample clients (including business clients)
- 4 sample vehicles
- 7 sample services (prestations)
- 2 sample package deals (forfaits)
- Sample quotes, work orders, and invoices
- Default system parameters
- Admin user account

## Default Login
- **Email**: admin@mongarage.fr
- **Password**: admin123

## Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret for JWT token generation
- `PENNYLANE_API_KEY`: Optional Pennylane integration
- `VIVAWALLET_API_KEY`: Optional Vivawallet integration

## Useful Database Queries

### Get dashboard metrics:
```sql
SELECT * FROM v_dashboard_metrics;
```

### Get client summary:
```sql
SELECT * FROM v_clients_summary;
```

### Get overdue invoices:
```sql
SELECT * FROM v_alertes_factures WHERE type_alerte = 'OVERDUE';
```

### Search clients:
```sql
SELECT * FROM search_clients('martin');
```

## Database Maintenance

### Backup database:
```bash
docker exec garage_postgres pg_dump -U garage_user garage_billing > backup.sql
```

### Restore database:
```bash
docker exec -i garage_postgres psql -U garage_user garage_billing < backup.sql
```

### Reset sequences (if needed):
```sql
SELECT setval('client_number_seq', (SELECT MAX(CAST(SUBSTRING(numero_client FROM 5) AS INTEGER)) FROM clients));
SELECT setval('devis_number_seq', (SELECT MAX(CAST(SUBSTRING(numero_devis FROM 10) AS INTEGER)) FROM devis));
```

## Performance Considerations

- All frequently queried columns are indexed
- Views are created for complex queries
- Triggers handle automatic calculations
- Foreign key constraints ensure data integrity

## Security Features

- Password hashing for user accounts
- Role-based access control
- Input validation through constraints
- Audit trails for all modifications

## Next Steps

1. Update Prisma schema to match the database structure
2. Configure the backend API to use the new database
3. Test all CRUD operations
4. Set up database migrations for future changes
5. Configure backup and monitoring

The database is now ready for production use with comprehensive data management capabilities for your garage management system.