-- 000001_initial.up.sql
-- Initial schema for JelantikApps

-- Users table (synced from Supabase auth)
CREATE TABLE IF NOT EXISTS users (
    id CHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    phone VARCHAR(20),
    nik VARCHAR(20),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    speed VARCHAR(50) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    description TEXT,
    features JSON,
    active_period INT DEFAULT 30,
    is_promo BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    package_id CHAR(36) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    installation_address TEXT,
    billing_date INT DEFAULT 1,
    installed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id CHAR(36) PRIMARY KEY,
    user_id CHAR(36) NOT NULL,
    package_id CHAR(36) NOT NULL,
    customer_data JSON,
    installation_date DATE,
    installation_time VARCHAR(10),
    subtotal DECIMAL(12,2),
    tax DECIMAL(12,2) DEFAULT 0,
    admin_fee DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE RESTRICT,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed packages data
INSERT INTO packages (id, name, speed, price, description, features, active_period, is_promo, is_active) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Basic', '10 Mbps', 150000, 'Paket internet cocok untuk rumahan dengan penggunaan dasar', '["1-2 Perangkat","Streaming SD","Browsing & Chatting","Unlimited Quota"]', 30, FALSE, TRUE),
('550e8400-e29b-41d4-a716-446655440002', 'Family', '20 Mbps', 250000, 'Paket internet untuk keluarga dengan beberapa perangkat', '["3-5 Perangkat","Streaming HD","Browsing & Chatting","Unlimited Quota","Free Installation"]', 30, FALSE, TRUE),
('550e8400-e29b-41d4-a716-446655440003', 'Pro', '50 Mbps', 400000, 'Paket internet untuk pengguna heavy dan work from home', '["5-10 Perangkat","Streaming 4K","Gaming & Video Call","Unlimited Quota","Free Installation","Prioritas Support"]', 30, FALSE, TRUE),
('550e8400-e29b-41d4-a716-446655440004', 'Ultra', '100 Mbps', 650000, 'Paket internet ultra cepat untuk kebutuhan bisnis dan heavy user', '["Unlimited Perangkat","Streaming 4K Ultra HD","Gaming Tanpa Lag","Unlimited Quota","Free Installation","Prioritas Support","IP Public Static"]', 30, TRUE, TRUE);
