-- ReWear Database Schema
-- PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(500),
    points INTEGER DEFAULT 100,
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Items table
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL CHECK (category IN ('tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'bags', 'other')),
    condition VARCHAR(20) NOT NULL CHECK (condition IN ('new', 'like_new', 'good', 'fair', 'poor')),
    size VARCHAR(20),
    brand VARCHAR(100),
    color VARCHAR(50),
    material VARCHAR(100),
    price_points INTEGER DEFAULT 0,
    image_urls TEXT, -- JSON array of image URLs
    is_available BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exchanges table
CREATE TABLE exchanges (
    id SERIAL PRIMARY KEY,
    exchange_type VARCHAR(20) NOT NULL CHECK (exchange_type IN ('direct_swap', 'points_exchange')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed', 'cancelled')),
    message TEXT,
    points_exchanged INTEGER DEFAULT 0,
    item_id INTEGER NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    offering_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    requesting_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    is_ai_response BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_items_owner ON items(owner_id);
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_available ON items(is_available);
CREATE INDEX idx_exchanges_item ON exchanges(item_id);
CREATE INDEX idx_exchanges_users ON exchanges(offering_user_id, requesting_user_id);
CREATE INDEX idx_exchanges_status ON exchanges(status);
CREATE INDEX idx_chat_messages_user ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_created ON chat_messages(created_at);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_exchanges_updated_at BEFORE UPDATE ON exchanges FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing
INSERT INTO users (email, username, hashed_password, full_name, bio, points) VALUES
('john@example.com', 'john_doe', '$2a$10$example_hash', 'John Doe', 'Sustainable fashion enthusiast', 150),
('jane@example.com', 'jane_smith', '$2a$10$example_hash', 'Jane Smith', 'Love swapping clothes!', 200),
('mike@example.com', 'mike_wilson', '$2a$10$example_hash', 'Mike Wilson', 'Reducing waste one swap at a time', 75);

INSERT INTO items (title, description, category, condition, size, brand, color, price_points, owner_id) VALUES
('Vintage Denim Jacket', 'Classic 90s denim jacket in great condition', 'outerwear', 'good', 'M', 'Levi''s', 'blue', 50, 1),
('Summer Dress', 'Light floral dress perfect for summer', 'dresses', 'like_new', 'S', 'H&M', 'floral', 30, 2),
('Running Shoes', 'Comfortable running shoes, barely worn', 'shoes', 'like_new', '9', 'Nike', 'white', 80, 3); 