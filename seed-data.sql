-- Insert categories
INSERT INTO categories (id, name_en, name_am, description_en, description_am, created_at)
VALUES
  ('1', 'Building Construction', 'የህንፃ ግንባታ', 'Construction of buildings and structures', 'የህንፃዎች እና መሰረተ ልማቶች ግንባታ', NOW()),
  ('2', 'Road Construction', 'የመንገድ ግንባታ', 'Construction of roads, highways, and bridges', 'የመንገዶች፣ አውራ ጎዳናዎች እና ድልድዮች ግንባታ', NOW()),
  ('3', 'Water Construction', 'የውሃ ግንባታ', 'Construction of water infrastructure and systems', 'የውሃ መሰረተ ልማት እና ስርዓቶች ግንባታ', NOW());

-- Insert subcategories
CREATE TABLE IF NOT EXISTS subcategories (
  id SERIAL PRIMARY KEY,
  name_en VARCHAR(255) NOT NULL,
  name_am VARCHAR(255) NOT NULL,
  category_id VARCHAR(255) REFERENCES categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO subcategories (name_en, name_am, category_id)
VALUES
  ('Public', 'የህዝብ', '1'),
  ('Commercial', 'የንግድ', '1'),
  ('Residential', 'የመኖሪያ', '1'),
  ('Industrial', 'ኢንዱስትሪያል', '1'),
  ('Infrastructure', 'መሰረተ ልማት', '1'),
  
  ('Public', 'የህዝብ', '2'),
  ('Commercial', 'የንግድ', '2'),
  ('Industrial', 'ኢንዱስትሪያል', '2'),
  ('Infrastructure', 'መሰረተ ልማት', '2'),
  
  ('Public', 'የህዝብ', '3'),
  ('Commercial', 'የንግድ', '3'),
  ('Residential', 'የመኖሪያ', '3'),
  ('Industrial', 'ኢንዱስትሪያል', '3'),
  ('Infrastructure', 'መሰረተ ልማት', '3');

-- Sample company users (you would need to create these users in auth first)
-- For demonstration purposes, assuming we have company users with these IDs
INSERT INTO projects (id, title, description, company_id, category_id, location, budget, status, created_at, updated_at)
VALUES
  ('1', 'Modern Apartment Complex', 'Construction of a 5-story modern apartment complex with 20 units. Each unit will have 2 bedrooms, a living room, kitchen, and bathroom. The complex will include parking spaces and a small garden.', 'company-user-id-1', '1', 'Addis Ababa', 5000000, 'open', NOW(), NOW()),
  
  ('2', 'Office Building Renovation', 'Complete renovation of a 3-story office building including electrical rewiring, plumbing updates, new flooring, and modern office partitioning.', 'company-user-id-1', '1', 'Bahir Dar', 2500000, 'open', NOW(), NOW()),
  
  ('3', 'Shopping Mall Construction', 'Construction of a new shopping mall with 50 retail spaces, food court, and underground parking. The project includes all electrical, plumbing, and HVAC installations.', 'company-user-id-2', '1', 'Hawassa', 12000000, 'open', NOW(), NOW()),
  
  ('4', 'Road Construction Project', 'Construction of a 5km asphalt road connecting the industrial zone to the main highway. Includes drainage systems and street lighting.', 'company-user-id-2', '2', 'Mekelle', 8000000, 'open', NOW(), NOW()),
  
  ('5', 'Warehouse Construction', 'Construction of a 2000 sq meter warehouse with loading docks, office space, and security systems. The warehouse will be used for storing agricultural products.', 'company-user-id-3', '1', 'Dire Dawa', 3500000, 'open', NOW(), NOW()),
  
  ('6', 'Residential Villa', 'Construction of a luxury villa with 5 bedrooms, swimming pool, garden, and smart home features. The villa will be built on a 1000 sq meter plot.', 'company-user-id-3', '1', 'Addis Ababa', 7000000, 'open', NOW(), NOW()),
  
  ('7', 'School Building Renovation', 'Renovation of a primary school building including new classrooms, library, and playground. The project also includes installing new sanitary facilities.', 'company-user-id-1', '1', 'Gondar', 1800000, 'open', NOW(), NOW()),
  
  ('8', 'Bridge Construction', 'Construction of a 100-meter concrete bridge over the river. The bridge will have two lanes and pedestrian walkways on both sides.', 'company-user-id-2', '2', 'Jimma', 9500000, 'open', NOW(), NOW()),
  
  ('9', 'Hotel Construction', 'Construction of a 4-star hotel with 100 rooms, conference facilities, restaurant, and swimming pool. The hotel will be located in the city center.', 'company-user-id-3', '1', 'Addis Ababa', 15000000, 'open', NOW(), NOW()),
  
  ('10', 'Factory Building', 'Construction of a textile factory building with production area, storage, and office space. The building will be equipped with all necessary utilities.', 'company-user-id-1', '1', 'Adama', 6500000, 'open', NOW(), NOW());
