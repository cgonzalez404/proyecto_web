BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    saldo NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS empresas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    simbolo VARCHAR(16) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    sector VARCHAR(120),
    precio_actual NUMERIC(12,2) NOT NULL DEFAULT 0,
    descripcion TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compras (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    empresa_id UUID NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
    total NUMERIC(12,2) NOT NULL CHECK (total >= 0),
    fecha_compra TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_compras_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_compras_empresa
        FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS ventas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    empresa_id UUID NOT NULL,
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
    total NUMERIC(12,2) NOT NULL CHECK (total >= 0),
    fecha_venta TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_ventas_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_ventas_empresa
        FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS historial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    empresa_id UUID NOT NULL,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('compra', 'venta')),
    cantidad INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12,2) NOT NULL CHECK (precio_unitario >= 0),
    total NUMERIC(12,2) NOT NULL CHECK (total >= 0),
    fecha_operacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    descripcion TEXT,
    CONSTRAINT fk_historial_usuario
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT fk_historial_empresa
        FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE RESTRICT
);

CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_nombre ON usuarios(nombre);

CREATE INDEX idx_empresas_simbolo ON empresas(simbolo);
CREATE INDEX idx_empresas_sector ON empresas(sector);

CREATE INDEX idx_compras_usuario_id ON compras(usuario_id);
CREATE INDEX idx_compras_empresa_id ON compras(empresa_id);
CREATE INDEX idx_compras_fecha_compra ON compras(fecha_compra);

CREATE INDEX idx_ventas_usuario_id ON ventas(usuario_id);
CREATE INDEX idx_ventas_empresa_id ON ventas(empresa_id);
CREATE INDEX idx_ventas_fecha_venta ON ventas(fecha_venta);

CREATE INDEX idx_historial_usuario_id ON historial(usuario_id);
CREATE INDEX idx_historial_empresa_id ON historial(empresa_id);
CREATE INDEX idx_historial_tipo ON historial(tipo);
CREATE INDEX idx_historial_fecha_operacion ON historial(fecha_operacion);

INSERT INTO usuarios (id, nombre, email, password_hash, saldo)
VALUES
    ('11111111-1111-1111-1111-111111111111', 'Ana López', 'ana.lopez@stockmarketpro.dev', 'hash_demo_ana', 12500.00),
    ('22222222-2222-2222-2222-222222222222', 'Carlos Ruiz', 'carlos.ruiz@stockmarketpro.dev', 'hash_demo_carlos', 8500.50),
    ('33333333-3333-3333-3333-333333333333', 'María Torres', 'maria.torres@stockmarketpro.dev', 'hash_demo_maria', 14200.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO empresas (id, simbolo, nombre, sector, precio_actual, descripcion)
VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'AAPL', 'Apple Inc.', 'Tecnología', 214.75, 'Empresa de tecnología y dispositivos electrónicos.'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'MSFT', 'Microsoft Corporation', 'Software', 428.60, 'Empresa multinacional de software y servicios digitales.'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'NVDA', 'NVIDIA Corporation', 'Semiconductores', 124.40, 'Fabricante de GPUs y aceleradores de IA.'),
    ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'TSLA', 'Tesla, Inc.', 'Automotriz', 181.25, 'Fabricante de vehículos eléctricos y almacenamiento energético.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO compras (id, usuario_id, empresa_id, cantidad, precio_unitario, total)
VALUES
    ('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 10, 210.00, 2100.00),
    ('10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 6, 420.00, 2520.00),
    ('10000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 15, 120.00, 1800.00),
    ('10000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 8, 175.00, 1400.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO ventas (id, usuario_id, empresa_id, cantidad, precio_unitario, total)
VALUES
    ('20000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 3, 214.75, 644.25),
    ('20000000-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 5, 124.40, 622.00)
ON CONFLICT (id) DO NOTHING;

INSERT INTO historial (id, usuario_id, empresa_id, tipo, cantidad, precio_unitario, total, descripcion)
VALUES
    ('30000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'compra', 10, 210.00, 2100.00, 'Compra inicial de Apple'),
    ('30000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'compra', 6, 420.00, 2520.00, 'Compra inicial de Microsoft'),
    ('30000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'venta', 3, 214.75, 644.25, 'Venta parcial de Apple'),
    ('30000000-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'compra', 15, 120.00, 1800.00, 'Compra inicial de NVIDIA'),
    ('30000000-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'venta', 5, 124.40, 622.00, 'Venta parcial de NVIDIA'),
    ('30000000-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'compra', 8, 175.00, 1400.00, 'Compra inicial de Tesla')
ON CONFLICT (id) DO NOTHING;

COMMIT;
