-- Inventory Images Table
CREATE TABLE inventory_images (
    ImageId UUID PRIMARY KEY DEFAULT gen_random_uuid(),     
    ImageUrl TEXT NOT NULL,                                 
    IsActive BOOLEAN DEFAULT TRUE,                          
    CreatedDate TIMESTAMPTZ DEFAULT NOW(),                  
    CreatedBy UUID,                                         
    ModifiedBy UUID,                                       
    ModifiedDate TIMESTAMPTZ DEFAULT NOW()                  
);

-- Inventory items table
CREATE TABLE inventory_items (
    InventoryId UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    SKU VARCHAR(50) NOT NULL,                               
    InventoryCode VARCHAR(100) NOT NULL,                    
    DefaultImageId UUID REFERENCES inventory_images(ImageId) ON DELETE SET NULL, 
    IsActive BOOLEAN DEFAULT TRUE,                           
    Description TEXT,                                       
    Notes TEXT,                                             
    CreatedDate TIMESTAMPTZ DEFAULT NOW(),                  
    CreatedBy UUID,                                         
    ModifiedBy UUID,                                       
    ModifiedDate TIMESTAMPTZ DEFAULT NOW()                 
);

-- Junction Table for Inventory items and images
CREATE TABLE inventory_item_images (
    InventoryId UUID REFERENCES inventory_items(InventoryId) ON DELETE CASCADE, 
    ImageId UUID REFERENCES inventory_images(ImageId) ON DELETE CASCADE,        
    PRIMARY KEY (InventoryId, ImageId)                                          
);

-- Categories Table
CREATE TABLE categories (
    CategoryId UUID PRIMARY KEY DEFAULT gen_random_uuid(), 
    Name VARCHAR(100) NOT NULL,                            
    Description TEXT,                                      
    IsActive BOOLEAN DEFAULT TRUE,                         
    CreatedDate TIMESTAMPTZ DEFAULT NOW(),                 
    CreatedBy UUID,                                        
    ModifiedBy UUID,                                      
    ModifiedDate TIMESTAMPTZ DEFAULT NOW()                 
);

-- Junction Table for categories and inventory items
CREATE TABLE inventory_item_categories (
    InventoryId UUID REFERENCES inventory_items(InventoryId) ON DELETE CASCADE, 
    CategoryId UUID REFERENCES categories(CategoryId) ON DELETE CASCADE,        
    PRIMARY KEY (InventoryId, CategoryId)                                        
);
