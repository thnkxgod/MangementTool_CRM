
CREATE DATABASE specselect;

\c specselect;

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,       -- Auto-incrementing primary key
    pname VARCHAR(255) NOT NULL, -- Product name
    color VARCHAR(255) NOT NULL, -- Color
    dimension VARCHAR(255) NOT NULL, -- Dimension
    description TEXT NOT NULL,   -- Product description
    images TEXT[]                -- Array of image URLs (stored as text array)
);

INSERT INTO inventory (pname, color, dimension, description, images)
VALUES 
('Sample Product 1', 'Red', '10x10', 'This is a sample product description', '{"https://example.com/image1.jpg", "https://example.com/image2.jpg"}'),
('Sample Product 2', 'Blue', '15x15', 'This is another sample product description', '{"https://example.com/image3.jpg"}');
