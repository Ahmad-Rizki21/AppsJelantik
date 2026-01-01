-- ============================================
-- SEED PACKAGES FOR JELANTIKAPI
-- Run this in pgAdmin or psql
-- ============================================

-- Insert sample packages
INSERT INTO packages (id, name, speed, price, description, features, active_period, is_promo, is_active, created_at, updated_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Basic', '10 Mbps', 150000, 'Paket internet cocok untuk rumahan dengan penggunaan dasar', '["1-2 Perangkat", "Streaming SD", "Browsing & Chatting", "Unlimited Quota"]'::json, 30, false, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440002', 'Family', '20 Mbps', 250000, 'Paket internet untuk keluarga dengan beberapa perangkat', '["3-5 Perangkat", "Streaming HD", "Browsing & Chatting", "Unlimited Quota", "Free Installation"]'::json, 30, false, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440003', 'Pro', '50 Mbps', 400000, 'Paket internet untuk pengguna heavy dan work from home', '["5-10 Perangkat", "Streaming 4K", "Gaming & Video Call", "Unlimited Quota", "Free Installation", "Prioritas Support"]'::json, 30, false, true, NOW(), NOW()),
('550e8400-e29b-41d4-a716-446655440004', 'Ultra', '100 Mbps', 650000, 'Paket internet ultra cepat untuk kebutuhan bisnis dan heavy user', '["Unlimited Perangkat", "Streaming 4K Ultra HD", "Gaming Tanpa Lag", "Unlimited Quota", "Free Installation", "Prioritas Support", "IP Public Static"]'::json, 30, true, true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Verify insert
SELECT id, name, speed, price, is_promo, is_active FROM packages ORDER BY price;
