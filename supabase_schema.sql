-- ============================================================================
-- BASE DE DATOS COMPLETA PARA "LA FACINEROSA - PICANTERÍA PIURANA"
-- SISTEMA POS, CENTRAL DE PEDIDOS WEB, CAJA, REPORTES Y CATÁLOGO
-- PLATAFORMA: PostgreSQL / Supabase (VPS Self-Hosted o Cloud)
-- ============================================================================
-- NOTA DE USO EN TU PROPIO VPS SUPABASE:
-- Puedes cambiar el nombre del SCHEMA 'la_facinerosa' por el que prefieras
-- para multi-inquilino / multi-solución (ej. 'tenant_picanteria', 'pos_surquillo').
-- ============================================================================

-- 1. Habilitar extensiones necesarias (en public o extensions)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Crear el SCHEMA dedicado para esta solución
CREATE SCHEMA IF NOT EXISTS la_facinerosa;

-- 3. Fijar el search_path para las operaciones siguientes (incluyendo public y extensions)
SET search_path TO la_facinerosa, public, extensions;

-- ============================================================================
-- 4. TIPOS ENUM PERSONALIZADOS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE la_facinerosa.category_id_enum AS ENUM (
        'todos', 'insignias', 'entradas', 'marinos', 'rondas', 'bebidas', 'guarniciones'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE la_facinerosa.spice_level_enum AS ENUM (
        'sin_aji', 'medio', 'picante_bravo'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE la_facinerosa.order_type_enum AS ENUM (
        'delivery', 'pickup', 'mesa'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE la_facinerosa.payment_method_enum AS ENUM (
        'yape', 'plin', 'efectivo', 'pos'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE la_facinerosa.order_status_enum AS ENUM (
        'recibido', 'en_cocina', 'en_camino', 'entregado', 'cancelado'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE la_facinerosa.payment_status_enum AS ENUM (
        'pendiente', 'pagado'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE la_facinerosa.pos_sale_type_enum AS ENUM (
        'mostrador', 'llevar', 'mesa'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE la_facinerosa.pos_sale_status_enum AS ENUM (
        'completada', 'anulada'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- 5. FUNCIÓN TRIGGER PARA ACTUALIZACIÓN AUTOMÁTICA DE 'updated_at'
-- ============================================================================
CREATE OR REPLACE FUNCTION la_facinerosa.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 6. TABLA: app_settings (Configuración del Front-end y Negocio)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.app_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    business_name VARCHAR(150) NOT NULL DEFAULT 'La Facinerosa',
    business_tagline VARCHAR(255) DEFAULT 'Picantería Piurana Contemporánea',
    address VARCHAR(255) NOT NULL DEFAULT 'Mercado 2 de Surquillo, Puesto 651, Surquillo, Lima',
    location_reference VARCHAR(255) DEFAULT 'Puesto 651 - Entre pasaje central y frutas',
    phone VARCHAR(50) NOT NULL DEFAULT '+51 969 823 145',
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '51969823145',
    opening_hours VARCHAR(100) DEFAULT 'Mar a Dom: 11:30 AM - 6:00 PM',
    banner_notice VARCHAR(255) DEFAULT '🔥 ¡Auténtica sazón piurana en Mercado 2 de Surquillo Puesto 651! Pedidos delivery y recojo al 969 823 145',
    hero_badge VARCHAR(100) DEFAULT 'Puesto 651 • Mercado 2 Surquillo',
    hero_title VARCHAR(255) DEFAULT 'Sabor que Despierta Tus Sentidos',
    hero_subtitle TEXT DEFAULT 'Auténtica sazón de picantería piurana en el corazón de Surquillo. Seco de chabelo al batán, majado de yuca con chancho crocante, ceviche de mero con zarandaja y chicha de jora helada.',
    hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    social_instagram VARCHAR(255) DEFAULT 'https://instagram.com/lafacinerosapiurana',
    social_tiktok VARCHAR(255) DEFAULT 'https://tiktok.com/@lafacinerosa',
    social_facebook VARCHAR(255) DEFAULT 'https://facebook.com/lafacinerosa',
    social_google_maps VARCHAR(255) DEFAULT 'https://maps.google.com',
    free_delivery_threshold NUMERIC(10, 2) NOT NULL DEFAULT 80.00,
    base_delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 6.00,
    admin_pin VARCHAR(20) NOT NULL DEFAULT '1234',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_app_settings_updated_at
BEFORE UPDATE ON la_facinerosa.app_settings
FOR EACH ROW EXECUTE FUNCTION la_facinerosa.set_current_timestamp_updated_at();

-- ============================================================================
-- 7. TABLA: categories (Categorías de la Carta)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.categories (
    code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    icon VARCHAR(50) DEFAULT 'Utensils',
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_categories_updated_at
BEFORE UPDATE ON la_facinerosa.categories
FOR EACH ROW EXECUTE FUNCTION la_facinerosa.set_current_timestamp_updated_at();

-- ============================================================================
-- 8. TABLA: products (Platos y Bebidas del Catálogo)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.products (
    id VARCHAR(100) PRIMARY KEY,
    category_code VARCHAR(50) NOT NULL REFERENCES la_facinerosa.categories(code) ON UPDATE CASCADE ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    image_url TEXT NOT NULL,
    badge VARCHAR(100),
    is_popular BOOLEAN DEFAULT FALSE,
    is_spicy BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    prep_time VARCHAR(50) DEFAULT '15-20 min',
    portions VARCHAR(50) DEFAULT '1-2 personas',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_products_updated_at
BEFORE UPDATE ON la_facinerosa.products
FOR EACH ROW EXECUTE FUNCTION la_facinerosa.set_current_timestamp_updated_at();

-- ============================================================================
-- 9. TABLA: product_extras (Guarniciones y Adicionales por Plato)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.product_extras (
    id VARCHAR(100) PRIMARY KEY,
    product_id VARCHAR(100) REFERENCES la_facinerosa.products(id) ON UPDATE CASCADE ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (price >= 0),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 10. TABLA: cash_shifts (Apertura y Cierre de Caja / Arqueos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.cash_shifts (
    id VARCHAR(100) PRIMARY KEY,
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    closed_at TIMESTAMPTZ,
    initial_cash NUMERIC(10, 2) NOT NULL DEFAULT 100.00 CHECK (initial_cash >= 0),
    cashier_name VARCHAR(100) NOT NULL DEFAULT 'Cajero Principal',
    cash_sales NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    yape_sales NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    plin_sales NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    card_sales NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_sales NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sales_count INT NOT NULL DEFAULT 0,
    final_counted_cash NUMERIC(10, 2),
    cash_difference NUMERIC(10, 2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_cash_shifts_updated_at
BEFORE UPDATE ON la_facinerosa.cash_shifts
FOR EACH ROW EXECUTE FUNCTION la_facinerosa.set_current_timestamp_updated_at();

-- ============================================================================
-- 11. TABLA: pos_sales (Ventas Directas del Punto de Venta en Local)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.pos_sales (
    id VARCHAR(100) PRIMARY KEY,
    sale_number VARCHAR(50) NOT NULL UNIQUE,
    shift_id VARCHAR(100) REFERENCES la_facinerosa.cash_shifts(id) ON UPDATE CASCADE ON DELETE SET NULL,
    sale_type la_facinerosa.pos_sale_type_enum NOT NULL DEFAULT 'mostrador',
    table_number VARCHAR(20),
    customer_name VARCHAR(150) DEFAULT 'Cliente Local',
    customer_doc VARCHAR(50), -- DNI / RUC
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    payment_method la_facinerosa.payment_method_enum NOT NULL DEFAULT 'efectivo',
    cash_given NUMERIC(10, 2),
    change_amount NUMERIC(10, 2),
    cashier_name VARCHAR(100) NOT NULL DEFAULT 'Cajero',
    status la_facinerosa.pos_sale_status_enum NOT NULL DEFAULT 'completada',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_pos_sales_updated_at
BEFORE UPDATE ON la_facinerosa.pos_sales
FOR EACH ROW EXECUTE FUNCTION la_facinerosa.set_current_timestamp_updated_at();

-- ============================================================================
-- 12. TABLA: pos_sale_items (Detalle de Items por Venta POS)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.pos_sale_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sale_id VARCHAR(100) NOT NULL REFERENCES la_facinerosa.pos_sales(id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES la_facinerosa.products(id) ON UPDATE CASCADE ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    spice_level la_facinerosa.spice_level_enum DEFAULT 'medio',
    selected_extras JSONB DEFAULT '[]'::JSONB,
    special_instructions TEXT,
    item_total NUMERIC(10, 2) NOT NULL CHECK (item_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 13. TABLA: web_orders (Pedidos Recibidos desde la Tienda Virtual)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.web_orders (
    id VARCHAR(100) PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    order_type la_facinerosa.order_type_enum NOT NULL DEFAULT 'delivery',
    table_number VARCHAR(20),
    address TEXT,
    reference TEXT,
    district VARCHAR(100),
    payment_method la_facinerosa.payment_method_enum NOT NULL DEFAULT 'yape',
    cash_amount NUMERIC(10, 2),
    coupon_code VARCHAR(50),
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    total NUMERIC(10, 2) NOT NULL CHECK (total >= 0),
    status la_facinerosa.order_status_enum NOT NULL DEFAULT 'recibido',
    payment_status la_facinerosa.payment_status_enum NOT NULL DEFAULT 'pendiente',
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE TRIGGER trg_web_orders_updated_at
BEFORE UPDATE ON la_facinerosa.web_orders
FOR EACH ROW EXECUTE FUNCTION la_facinerosa.set_current_timestamp_updated_at();

-- ============================================================================
-- 14. TABLA: web_order_items (Detalle de Items por Pedido Web)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.web_order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(100) NOT NULL REFERENCES la_facinerosa.web_orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    product_id VARCHAR(100) REFERENCES la_facinerosa.products(id) ON UPDATE CASCADE ON DELETE SET NULL,
    product_name VARCHAR(200) NOT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    spice_level la_facinerosa.spice_level_enum DEFAULT 'medio',
    selected_extras JSONB DEFAULT '[]'::JSONB,
    special_instructions TEXT,
    item_total NUMERIC(10, 2) NOT NULL CHECK (item_total >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 15. TABLA: coupons (Cupones y Descuentos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.coupons (
    code VARCHAR(50) PRIMARY KEY,
    discount_type VARCHAR(20) NOT NULL DEFAULT 'percentage', -- 'percentage' o 'fixed'
    discount_value NUMERIC(10, 2) NOT NULL CHECK (discount_value > 0),
    min_order_amount NUMERIC(10, 2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 16. TABLA: delivery_zones (Zonas y Tarifas de Envíos en Lima)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.delivery_zones (
    id SERIAL PRIMARY KEY,
    district_name VARCHAR(100) NOT NULL UNIQUE,
    fee NUMERIC(10, 2) NOT NULL CHECK (fee >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    estimated_time VARCHAR(50) DEFAULT '35-50 min',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 17. TABLA: audit_logs (Historial de Auditoría de Acciones)
-- ============================================================================
CREATE TABLE IF NOT EXISTS la_facinerosa.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL, -- 'shift_opened', 'sale_created', 'order_status_updated', 'settings_saved'
    entity_name VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100),
    user_identifier VARCHAR(100) DEFAULT 'admin',
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 18. ÍNDICES DE ALTO RENDIMIENTO
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON la_facinerosa.products(category_code);
CREATE INDEX IF NOT EXISTS idx_products_available ON la_facinerosa.products(is_available);
CREATE INDEX IF NOT EXISTS idx_pos_sales_created ON la_facinerosa.pos_sales(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pos_sales_shift ON la_facinerosa.pos_sales(shift_id);
CREATE INDEX IF NOT EXISTS idx_pos_sales_status ON la_facinerosa.pos_sales(status);
CREATE INDEX IF NOT EXISTS idx_web_orders_status ON la_facinerosa.web_orders(status);
CREATE INDEX IF NOT EXISTS idx_web_orders_created ON la_facinerosa.web_orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pos_items_sale ON la_facinerosa.pos_sale_items(sale_id);
CREATE INDEX IF NOT EXISTS idx_web_items_order ON la_facinerosa.web_order_items(order_id);

-- ============================================================================
-- 19. VISTAS SQL PARA REPORTES EN TIEMPO REAL
-- ============================================================================

-- Vista: Resumen Diario Consolidado (POS + Web)
CREATE OR REPLACE VIEW la_facinerosa.v_daily_sales_summary AS
SELECT 
    DATE(created_at) AS sale_date,
    COUNT(id) AS total_transactions,
    SUM(subtotal) AS total_subtotal,
    SUM(discount) AS total_discount,
    SUM(total) AS total_revenue,
    SUM(CASE WHEN payment_method = 'efectivo' THEN total ELSE 0 END) AS cash_revenue,
    SUM(CASE WHEN payment_method = 'yape' THEN total ELSE 0 END) AS yape_revenue,
    SUM(CASE WHEN payment_method = 'plin' THEN total ELSE 0 END) AS plin_revenue,
    SUM(CASE WHEN payment_method = 'pos' THEN total ELSE 0 END) AS card_revenue
FROM la_facinerosa.pos_sales
WHERE status = 'completada'
GROUP BY DATE(created_at)
ORDER BY sale_date DESC;

-- Vista: Platos Más Vendidos (Ranking de Popularidad)
CREATE OR REPLACE VIEW la_facinerosa.v_top_selling_dishes AS
SELECT 
    product_name,
    COUNT(*) AS orders_count,
    SUM(quantity) AS total_quantity_sold,
    SUM(item_total) AS total_sales_amount
FROM (
    SELECT product_name, quantity, item_total FROM la_facinerosa.pos_sale_items
    UNION ALL
    SELECT product_name, quantity, item_total FROM la_facinerosa.web_order_items
) combined_sales
GROUP BY product_name
ORDER BY total_quantity_sold DESC;

-- ============================================================================
-- 20. PERMISOS Y ROW LEVEL SECURITY (RLS) PARA SUPABASE
-- ============================================================================

-- Otorgar permisos sobre el schema a los roles de Supabase
GRANT USAGE ON SCHEMA la_facinerosa TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA la_facinerosa TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA la_facinerosa TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA la_facinerosa TO anon, authenticated, service_role;

-- Configurar permisos predeterminados para tablas futuras
ALTER DEFAULT PRIVILEGES IN SCHEMA la_facinerosa GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA la_facinerosa GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- Habilitar RLS en tablas principales
ALTER TABLE la_facinerosa.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.product_extras ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.cash_shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.pos_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.pos_sale_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.web_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.web_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE la_facinerosa.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de Acceso Lectura/Escritura
CREATE POLICY "Permitir lectura publica de configuracion" ON la_facinerosa.app_settings FOR SELECT USING (true);
CREATE POLICY "Permitir modificacion de configuracion" ON la_facinerosa.app_settings FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de categorias" ON la_facinerosa.categories FOR SELECT USING (true);
CREATE POLICY "Permitir gestion de categorias" ON la_facinerosa.categories FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de productos" ON la_facinerosa.products FOR SELECT USING (true);
CREATE POLICY "Permitir gestion de productos" ON la_facinerosa.products FOR ALL USING (true);

CREATE POLICY "Permitir lectura publica de extras" ON la_facinerosa.product_extras FOR SELECT USING (true);
CREATE POLICY "Permitir gestion de extras" ON la_facinerosa.product_extras FOR ALL USING (true);

CREATE POLICY "Permitir gestion de turnos de caja" ON la_facinerosa.cash_shifts FOR ALL USING (true);

CREATE POLICY "Permitir gestion de ventas POS" ON la_facinerosa.pos_sales FOR ALL USING (true);
CREATE POLICY "Permitir gestion de items POS" ON la_facinerosa.pos_sale_items FOR ALL USING (true);

CREATE POLICY "Permitir crear y ver pedidos web" ON la_facinerosa.web_orders FOR ALL USING (true);
CREATE POLICY "Permitir crear y ver items de pedidos web" ON la_facinerosa.web_order_items FOR ALL USING (true);

CREATE POLICY "Permitir lectura de cupones" ON la_facinerosa.coupons FOR SELECT USING (true);
CREATE POLICY "Permitir gestion de cupones" ON la_facinerosa.coupons FOR ALL USING (true);

CREATE POLICY "Permitir lectura de zonas de delivery" ON la_facinerosa.delivery_zones FOR SELECT USING (true);
CREATE POLICY "Permitir gestion de zonas de delivery" ON la_facinerosa.delivery_zones FOR ALL USING (true);

CREATE POLICY "Permitir insercion de logs de auditoria" ON la_facinerosa.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir lectura de logs de auditoria" ON la_facinerosa.audit_logs FOR SELECT USING (true);

-- ============================================================================
-- 21. SEED DATA INICIAL (DATOS REALES DE LA FACINEROSA)
-- ============================================================================

-- Inserción de Configuración Inicial
INSERT INTO la_facinerosa.app_settings (
    id, business_name, business_tagline, address, location_reference,
    phone, whatsapp_number, opening_hours, banner_notice,
    hero_badge, hero_title, hero_subtitle, hero_image,
    social_instagram, social_tiktok, social_facebook, social_google_maps,
    free_delivery_threshold, base_delivery_fee, admin_pin
) VALUES (
    'default',
    'La Facinerosa',
    'Picantería Piurana Contemporánea',
    'Mercado 2 de Surquillo, Puesto 651, Surquillo, Lima',
    'Puesto 651 - Entre pasaje central y frutas',
    '+51 969 823 145',
    '51969823145',
    'Martes a Domingo: 11:30 AM - 6:00 PM',
    '🔥 ¡Auténtica sazón piurana en Mercado 2 de Surquillo Puesto 651! Pedidos delivery y recojo al 969 823 145',
    'Puesto 651 • Mercado 2 Surquillo',
    'Sabor que Despierta Tus Sentidos',
    'Auténtica sazón de picantería piurana en el corazón de Surquillo. Seco de chabelo al batán, majado de yuca con chancho crocante, ceviche de mero con zarandaja y chicha de jora helada.',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    'https://instagram.com/lafacinerosapiurana',
    'https://tiktok.com/@lafacinerosa',
    'https://facebook.com/lafacinerosa',
    'https://maps.google.com',
    80.00,
    6.00,
    '1234'
) ON CONFLICT (id) DO NOTHING;

-- Inserción de Categorías
INSERT INTO la_facinerosa.categories (code, name, icon, image_url, display_order) VALUES
('insignias', 'Platos Insignia', 'Flame', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80', 1),
('entradas', 'Entradas & Piqueos', 'Sparkles', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80', 2),
('marinos', 'Ceviches & Marinos', 'Fish', 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80', 3),
('rondas', 'Rondas Familiares', 'Users', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80', 4),
('bebidas', 'Chichas & Bebidas', 'Wine', 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80', 5),
('guarniciones', 'Guarniciones & Postres', 'Cookie', 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80', 6)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, image_url = EXCLUDED.image_url;

-- Inserción de Platos y Productos de La Facinerosa
INSERT INTO la_facinerosa.products (
    id, category_code, name, description, price, image_url, badge, is_popular, is_spicy, is_available, prep_time, portions, display_order
) VALUES
(
    'seco-chabelo', 'insignias', 'Seco de Chabelo',
    'El plato insignia de las picanterías piuranas. A base de plátano verde "majado" al batán, aderezado con sofrito criollo, chicha de jora y culantro fresco, entreverado con abundante carne de res aliñada jugosa y cancha chulpi.',
    49.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    'Plato Insignia', TRUE, FALSE, TRUE, '20-25 min', '1-2 personas', 1
),
(
    'majado-yuca-chancho', 'insignias', 'Majado de Yuca con Chancho',
    'Yuca norteña "majada" a mano, aderezada con ajos dorados y cebolla china fresca, coronada con generosos trozos de chancho frito crocante al estilo piurano, cancha chulpi tostada y sarza criolla.',
    49.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    'Favorito del Fogón', TRUE, FALSE, TRUE, '20-25 min', '1-2 personas', 2
),
(
    'majariscos', 'insignias', 'Majariscos Piurano',
    'La versión marina del seco de chabelo. A base de plátano verde majado, combinado con mariscos frescos del día (langostinos, calamar y conchas) salteados con aderezo criollo tradicional, muy típico de las playas piuranas.',
    59.00, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80',
    'Especialidad Marina', TRUE, TRUE, TRUE, '25 min', '1-2 personas', 3
),
(
    'arroz-pato-norteno', 'insignias', 'Arroz con Pato a la Piurana',
    'Pierna de pato tierno macerada en chicha de jora norteña ancestral y cerveza negra, cocinado lentamente con arroz al culantro silvestre, ají amarillo y pimientos morrones asados.',
    52.00, 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80',
    'Plato Festivo', TRUE, FALSE, TRUE, '20-25 min', '1 persona contundente', 4
),
(
    'tamalitos-verdes', 'entradas', 'Tamalitos Verdes Piuranos (2 Unidades)',
    'Hechos con choclo tierno desgranado a mano, culantro fresco y un sutil toque de ají amarillo. Servidos calientes con suculento jugo de seco criollo y sarza criolla norteña.',
    20.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    'Tradición Picantera', TRUE, FALSE, TRUE, '10-15 min', '2 unidades (Entrada)', 5
),
(
    'copa-leche-tigre', 'entradas', 'Copa de Leche de Tigre Piurana',
    'A pesar del intenso calor piurano, nos encanta tomar la leche de tigre bien servida y caliente en picantería. Caldo potente marino con tropezones de pescado fresco, langostinos, cebolla roja, ají limo, choclo tierno, zarandaja piurana y su toque de limón de Chulucanas.',
    29.00, 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
    'Potencia Marina', TRUE, TRUE, TRUE, '15 min', '1 copa generosa', 6
),
(
    'tortilla-langostinos', 'entradas', 'Tortilla de Langostinos Criolla',
    'Jugosa tortilla a base de huevos de chacra batidos al momento, colas de langostinos norteños salteados al fuego, picadito de ajíes aromáticos con ajo dorado y sarza criolla fresca.',
    49.00, 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    'Receta de Antaño', FALSE, FALSE, TRUE, '15-20 min', '1-2 personas', 7
),
(
    'ceviche-mero-piurano', 'marinos', 'Ceviche Piurano de Mero con Zarandaja',
    'Fresco mero del litoral piurano cortado en dados, curado al momento con limón criollo de Chulucanas y ají limo, acompañado de auténtica zarandaja piurana, camote glaseado y chifles artesanales.',
    54.00, 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
    'Fresco del Día', TRUE, TRUE, TRUE, '15 min', '1 persona abundante', 8
),
(
    'chicharron-pescado-chifles', 'marinos', 'Chicharrón de Pescado con Chifles',
    'Crujientes y dorados trozos de pescado fresco marinados en ajo y mostaza criolla, acompañados de salsa tártara casera de la casa, chifles piuranos salados y yuquitas doradas.',
    42.00, 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=800&q=80',
    'Súper Crocante', FALSE, FALSE, TRUE, '15-20 min', '1-2 personas', 9
),
(
    'ronda-facinerosa-familiar', 'rondas', 'Gran Ronda Picantera La Facinerosa',
    'Para vivir la experiencia completa en familia: Seco de Chabelo tradicional + Majado de Yuca con Chancho crocante + Ceviche clásico al limón de Chulucanas + 2 Tamalitos Verdes + Montaña de Chifles piuranos y sarza criolla.',
    119.00, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    'Para 3 a 4 personas', TRUE, FALSE, TRUE, '30 min', '3-4 personas', 10
),
(
    'chicha-jora-jarra', 'bebidas', 'Chicha de Jora Artesanal (Jarra 1 Litro)',
    'Elaborada siguiendo la receta tradicional picantera piurana, fermentada con maíz de jora seleccionado y especias naturales. Servida bien fría en jarra.',
    16.00, 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    'Bebida Ancestral', TRUE, FALSE, TRUE, '5 min', 'Jarra 1 Litro (4 vasos)', 11
),
(
    'clarito-piurano', 'bebidas', 'Clarito Piurano Bien Helado (Jarra 1 Litro)',
    'El destilado superior y cristalino de la chicha de jora, suave, refrescante y perfecto para acompañar el seco de chabelo y el calor piurano.',
    14.00, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    'Favorito Norteño', TRUE, FALSE, TRUE, '5 min', 'Jarra 1 Litro', 12
),
(
    'chicha-morada-jarra', 'bebidas', 'Chicha Morada Especial con Piña y Membrillo (1L)',
    'Hervida con maíz morado cusqueño, cáscaras de piña golden, membrillo fresco, clavo de olor y canela de rama, con toque cítrico de limón recién exprimido.',
    15.00, 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
    '100% Natural', FALSE, FALSE, TRUE, '5 min', 'Jarra 1 Litro', 13
),
(
    'porcion-chifles-artesanales', 'guarniciones', 'Porción Generosa de Chifles Piuranos',
    'Chifles delgados, crocantes y salados en su punto, preparados con plátano bellaco verde de la campiña de Morropón.',
    9.00, 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=800&q=80',
    '100% Piurano', FALSE, FALSE, TRUE, '5 min', 'Bolsa / Porción 200g', 14
),
(
    'natilla-piurana-artesanal', 'guarniciones', 'Natilla Piurana Tradicional de Leche de Cabra',
    'Postre emblemático del norte, cocinado a fuego lento en perol de cobre con leche de cabra fresca y chancaca pura, con trocitos de pecanas tostadas.',
    12.00, 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    'Postre Típico', FALSE, FALSE, TRUE, '5 min', 'Pote artesanal 180g', 15
),
(
    'dupla-picantera-clarito', 'insignias', 'Dupla Picantera + Clarito Helado',
    'Seco de Chabelo tradicional con abundante carne aliñada + 1 Jarra de Clarito Piurano bien helado (1L) + porción de chifles piuranos artesanales y sarza criolla.',
    58.00, 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    'PROMO DÚO', TRUE, FALSE, TRUE, '20 min', '2 personas', 16
),
(
    'trio-marino-facineroso', 'marinos', 'Trío Marino Norteño',
    'Ceviche Piurano de Mero al limón de Chulucanas + Chicharrón de pescado súper crocante + Copa de Leche de Tigre potente y chifles crujientes.',
    68.00, 'https://images.unsplash.com/photo-1535400255456-984241443b29?auto=format&fit=crop&w=800&q=80',
    'PROMO MARINA', TRUE, TRUE, TRUE, '20 min', '2 personas', 17
),
(
    'combo-tamalitos-chicha', 'entradas', 'Dúo Tamalitos Verdes + Chicha de Jora',
    '4 Tamalitos verdes piuranos recién hechos con jugo de seco y sarza criolla + 1 Jarra de Chicha de Jora artesanal de 1L.',
    32.00, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    'PROMO PIQUEO', TRUE, FALSE, TRUE, '15 min', '2-3 personas', 18
),
(
    'combo-majado-jora', 'insignias', 'Combo Majado de Chancho + Chicha',
    'Majado de Yuca generoso con chancho crocante y cancha chulpi + 1 Jarra de Chicha de Jora norteña de 1L + chifles y zarza criolla.',
    59.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
    'PROMO CRIOLLA', TRUE, FALSE, TRUE, '20 min', '2 personas', 19
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    image_url = EXCLUDED.image_url,
    badge = EXCLUDED.badge,
    is_popular = EXCLUDED.is_popular,
    is_spicy = EXCLUDED.is_spicy;

-- Inserción de Extras por Plato
INSERT INTO la_facinerosa.product_extras (id, product_id, name, price) VALUES
('extra-chifles-chabelo', 'seco-chabelo', 'Porción de Chifles Piuranos Artesanales', 6.00),
('extra-zarza-chabelo', 'seco-chabelo', 'Zarza Criolla Extra', 4.00),
('extra-carne-chabelo', 'seco-chabelo', 'Porción Extra de Carne Aliñada', 14.00),
('extra-chifles-majado', 'majado-yuca-chancho', 'Porción de Chifles Piuranos', 6.00),
('extra-zarza-majado', 'majado-yuca-chancho', 'Zarza Criolla Extra', 4.00),
('extra-cancha-majado', 'majado-yuca-chancho', 'Cancha Chulpi Tostada', 4.00),
('extra-mariscos-majariscos', 'majariscos', 'Porción Extra de Mariscos Salteados', 16.00),
('extra-chifles-ceviche', 'ceviche-mero-piurano', 'Chifles Piuranos Extra', 6.00),
('extra-cancha-ceviche', 'ceviche-mero-piurano', 'Cancha Chulpi Extra', 4.00),
('extra-yuca-chicharron', 'chicharron-pescado-chifles', 'Porción Extra de Yuquitas Doradas', 7.00)
ON CONFLICT (id) DO NOTHING;

-- Inserción de Zonas de Delivery de Lima
INSERT INTO la_facinerosa.delivery_zones (district_name, fee, estimated_time) VALUES
('Surquillo (Local Mercado 2)', 4.00, '20-35 min'),
('Miraflores', 6.00, '30-45 min'),
('San Isidro', 7.00, '35-50 min'),
('San Borja', 7.00, '35-50 min'),
('Barranco', 7.00, '35-50 min'),
('Santiago de Surco', 8.00, '40-55 min'),
('Lince / Jesús María', 8.00, '40-55 min'),
('Magdalena / San Miguel', 9.00, '45-60 min'),
('La Victoria / San Luis', 8.00, '35-50 min'),
('Cercado de Lima / Breña', 9.00, '45-60 min'),
('Chorrillos', 9.00, '45-60 min')
ON CONFLICT (district_name) DO UPDATE SET fee = EXCLUDED.fee;

-- Inserción de Cupones Iniciales
INSERT INTO la_facinerosa.coupons (code, discount_type, discount_value, min_order_amount, is_active) VALUES
('FACINEROSA10', 'percentage', 10.00, 30.00, TRUE),
('ENVIOGRATIS80', 'fixed', 6.00, 80.00, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Inserción de Turno de Caja Demo Inicial
INSERT INTO la_facinerosa.cash_shifts (
    id, is_open, opened_at, initial_cash, cashier_name,
    cash_sales, yape_sales, plin_sales, card_sales, total_sales, sales_count, notes
) VALUES (
    'shift_demo_01', TRUE, NOW(), 150.00, 'Cajero Puesto 651',
    185.00, 148.00, 49.00, 119.00, 501.00, 4, 'Turno de apertura en Mercado 2 de Surquillo'
) ON CONFLICT (id) DO NOTHING;

-- Mensaje de confirmación final
DO $$
BEGIN
    RAISE NOTICE '¡Base de datos y Schema la_facinerosa creados e inicializados con éxito en Supabase!';
END $$;
