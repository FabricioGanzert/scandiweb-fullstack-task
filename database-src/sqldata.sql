-- Create Categories Table
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    __typename VARCHAR(255) NOT NULL
);

-- Create Products Table
CREATE TABLE products (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    inStock BOOLEAN NOT NULL,
    description TEXT,
    category VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    __typename VARCHAR(255) NOT NULL
);

-- Create Attributes Table
CREATE TABLE attributes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    attribute_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    __typename VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create Attribute Items Table
CREATE TABLE attribute_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    attribute_id INT NOT NULL,
    displayValue VARCHAR(255) NOT NULL,
    value VARCHAR(255) NOT NULL,
    __typename VARCHAR(255) NOT NULL,
    FOREIGN KEY (attribute_id) REFERENCES attributes(id)
);

-- Create Prices Table
CREATE TABLE prices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency_label VARCHAR(255) NOT NULL,
    currency_symbol VARCHAR(10) NOT NULL,
    __typename VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Create Gallery Table
CREATE TABLE gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id VARCHAR(255) NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE orders (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED,  -- if you have a users table, otherwise omit or adjust accordingly
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
  total DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (user_id)
);

CREATE TABLE order_items (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  order_id INT UNSIGNED NOT NULL,
  product_id VARCHAR(255) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) NOT NULL,
  selected_attributes JSON,  -- requires MySQL 5.7+; stores key-value pairs as in your GraphQL query
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  INDEX (product_id)
);

--insert data

INSERT INTO categories (name, __typename) VALUES
('all', 'Category'),
('clothes', 'Category'),
('tech', 'Category');

INSERT INTO products (id, name, inStock, description, category, brand, __typename) VALUES
('huarache-x-stussy-le', 'Nike Air Huarache Le', TRUE, '<p>Great sneakers for everyday use!</p>', 'clothes', 'Nike x Stussy', 'Product'),
('jacket-canada-goosee', 'Jacket', TRUE, '<p>Awesome winter jacket</p>', 'clothes', 'Canada Goose', 'Product'),
('ps-5', 'PlayStation 5', TRUE, '<p>A good gaming console. Plays games of PS4! Enjoy if you can buy it mwahahahaha</p>', 'tech', 'Sony', 'Product'),
('xbox-series-s', 'Xbox Series S 512GB', FALSE, '<div><ul><li><span>Hardware-beschleunigtes Raytracing macht dein Spiel noch realistischer</span></li><li><span>Spiele Games mit bis zu 120 Bilder pro Sekunde</span></li><li><span>Minimiere Ladezeiten mit einer speziell entwickelten 512GB NVMe SSD und wechsle mit Quick Resume nahtlos zwischen mehreren Spielen.</span></li><li><span>Xbox Smart Delivery stellt sicher, dass du die beste Version deines Spiels spielst, egal, auf welcher Konsole du spielst</span></li><li><span>Spiele deine Xbox One-Spiele auf deiner Xbox Series S weiter. Deine Fortschritte, Erfolge und Freundesliste werden automatisch auf das neue System übertragen.</span></li><li><span>Erwecke deine Spiele und Filme mit innovativem 3D Raumklang zum Leben</span></li><li><span>Der brandneue Xbox Wireless Controller zeichnet sich durch höchste Präzision, eine neue Share-Taste und verbesserte Ergonomie aus</span></li><li><span>Ultra-niedrige Latenz verbessert die Reaktionszeit von Controller zum Fernseher</span></li><li><span>Verwende dein Xbox One-Gaming-Zubehör -einschließlich Controller, Headsets und mehr</span></li><li><span>Erweitere deinen Speicher mit der Seagate 1 TB-Erweiterungskarte für Xbox Series X (separat erhältlich) und streame 4K-Videos von Disney+, Netflix, Amazon, Microsoft Movies &amp; TV und mehr</span></li></ul></div>', 'tech', 'Microsoft', 'Product'),
('apple-imac-2021', 'iMac 2021', TRUE, 'The new iMac!', 'tech', 'Apple', 'Product'),
('apple-iphone-12-pro', 'iPhone 12 Pro', TRUE, 'This is iPhone 12. Nothing else to say.', 'tech', 'Apple', 'Product'),
('apple-airpods-pro', 'AirPods Pro', FALSE, '<h3>Magic like you’ve never heard</h3><p>AirPods Pro have been designed to deliver Active Noise Cancellation for immersive sound, Transparency mode so you can hear your surroundings, and a customizable fit for all-day comfort. Just like AirPods, AirPods Pro connect magically to your iPhone or Apple Watch. And they’re ready to use right out of the case.</p><h3>Active Noise Cancellation</h3><p>Incredibly light noise-cancelling headphones, AirPods Pro block out your environment so you can focus on what you’re listening to. AirPods Pro use two microphones, an outward-facing microphone and an inward-facing microphone, to create superior noise cancellation. By continuously adapting to the geometry of your ear and the fit of the ear tips, Active Noise Cancellation silences the world to keep you fully tuned in to your music, podcasts, and calls.</p><h3>Transparency mode</h3><p>Switch to Transparency mode and AirPods Pro let the outside sound in, allowing you to hear and connect to your surroundings. Outward- and inward-facing microphones enable AirPods Pro to undo the sound-isolating effect of the silicone tips so things sound and feel natural, like when you’re talking to people around you.</p><h3>All-new design</h3><p>AirPods Pro offer a more customizable fit with three sizes of flexible silicone tips to choose from. With an internal taper, they conform to the shape of your ear, securing your AirPods Pro in place and creating an exceptional seal for superior noise cancellation.</p><h3>Amazing audio quality</h3><p>A custom-built high-excursion, low-distortion driver delivers powerful bass. A superefficient high dynamic range amplifier produces pure, incredibly clear sound while also extending battery life. And Adaptive EQ automatically tunes music to suit the shape of your ear for a rich, consistent listening experience.</p><h3>Even more magical</h3><p>The Apple-designed H1 chip delivers incredibly low audio latency. A force sensor on the stem makes it easy to control music and calls and switch between Active Noise Cancellation and Transparency mode. Announce Messages with Siri gives you the option to have Siri read your messages through your AirPods. And with Audio Sharing, you and a friend can share the same audio stream on two sets of AirPods — so you can play a game, watch a movie, or listen to a song together.</p>', 'tech', 'Apple', 'Product'),
('apple-airtag', 'AirTag', TRUE, '<h1>Lose your knack for losing things.</h1><p>AirTag is an easy way to keep track of your stuff. Attach one to your keys, slip another one in your backpack. And just like that, they’re on your radar in the Find My app. AirTag has your back.</p>', 'tech', 'Apple', 'Product');

-- Attributes for 'huarache-x-stussy-le'
INSERT INTO attributes (product_id, attribute_id, name, type, __typename) VALUES
('huarache-x-stussy-le', 'Size', 'Size', 'text', 'AttributeSet');

INSERT INTO attribute_items (attribute_id, displayValue, value, __typename) VALUES
(1, '40', '40', 'Attribute'),
(1, '41', '41', 'Attribute'),
(1, '42', '42', 'Attribute'),
(1, '43', '43', 'Attribute');

-- Attributes for 'jacket-canada-goosee'
INSERT INTO attributes (product_id, attribute_id, name, type, __typename) VALUES
('jacket-canada-goosee', 'Size', 'Size', 'text', 'AttributeSet');

INSERT INTO attribute_items (attribute_id, displayValue, value, __typename) VALUES
(2, 'Small', 'S', 'Attribute'),
(2, 'Medium', 'M', 'Attribute'),
(2, 'Large', 'L', 'Attribute'),
(2, 'Extra Large', 'XL', 'Attribute');

-- Attributes for 'ps-5'
INSERT INTO attributes (product_id, attribute_id, name, type, __typename) VALUES
('ps-5', 'Color', 'Color', 'swatch', 'AttributeSet'),
('ps-5', 'Capacity', 'Capacity', 'text', 'AttributeSet');

INSERT INTO attribute_items (attribute_id, displayValue, value, __typename) VALUES
(3, 'Green', '#44FF03', 'Attribute'),
(3, 'Cyan', '#03FFF7', 'Attribute'),
(3, 'Blue', '#030BFF', 'Attribute'),
(3, 'Black', '#000000', 'Attribute'),
(3, 'White', '#FFFFFF', 'Attribute'),
(4, '512G', '512G', 'Attribute'),
(4, '1T', '1T', 'Attribute');

-- Attributes for 'xbox-series-s'
INSERT INTO attributes (product_id, attribute_id, name, type, __typename) VALUES
('xbox-series-s', 'Color', 'Color', 'swatch', 'AttributeSet'),
('xbox-series-s', 'Capacity', 'Capacity', 'text', 'AttributeSet');

INSERT INTO attribute_items (attribute_id, displayValue, value, __typename) VALUES
(5, 'Green', '#44FF03', 'Attribute'),
(5, 'Cyan', '#03FFF7', 'Attribute'),
(5, 'Blue', '#030BFF', 'Attribute'),
(5, 'Black', '#000000', 'Attribute'),
(5, 'White', '#FFFFFF', 'Attribute'),
(6, '512G', '512G', 'Attribute'),
(6, '1T', '1T', 'Attribute');

-- Attributes for 'apple-imac-2021'
INSERT INTO attributes (product_id, attribute_id, name, type, __typename) VALUES
('apple-imac-2021', 'Capacity', 'Capacity', 'text', 'AttributeSet'),
('apple-imac-2021', 'With USB 3 ports', 'With USB 3 ports', 'text', 'AttributeSet'),
('apple-imac-2021', 'Touch ID in keyboard', 'Touch ID in keyboard', 'text', 'AttributeSet');

INSERT INTO attribute_items (attribute_id, displayValue, value, __typename) VALUES
(7, '256GB', '256GB', 'Attribute'),
(7, '512GB', '512GB', 'Attribute'),
(8, 'Yes', 'Yes', 'Attribute'),
(8, 'No', 'No', 'Attribute'),
(9, 'Yes', 'Yes', 'Attribute'),
(9, 'No', 'No', 'Attribute');

-- Attributes for 'apple-iphone-12-pro'
INSERT INTO attributes (product_id, attribute_id, name, type, __typename) VALUES
('apple-iphone-12-pro', 'Capacity', 'Capacity', 'text', 'AttributeSet'),
('apple-iphone-12-pro', 'Color', 'Color', 'swatch', 'AttributeSet');

INSERT INTO attribute_items (attribute_id, displayValue, value, __typename) VALUES
(10, '512G', '512G', 'Attribute'),
(10, '1T', '1T', 'Attribute'),
(11, 'Green', '#44FF03', 'Attribute'),
(11, 'Cyan', '#03FFF7', 'Attribute'),
(11, 'Blue', '#030BFF', 'Attribute'),
(11, 'Black', '#000000', 'Attribute'),
(11, 'White', '#FFFFFF', 'Attribute');

INSERT INTO prices (product_id, amount, currency_label, currency_symbol, __typename) VALUES
('huarache-x-stussy-le', 144.69, 'USD', '$', 'Price'),
('jacket-canada-goosee', 518.47, 'USD', '$', 'Price'),
('ps-5', 844.02, 'USD', '$', 'Price'),
('xbox-series-s', 333.99, 'USD', '$', 'Price'),
('apple-imac-2021', 1688.03, 'USD', '$', 'Price'),
('apple-iphone-12-pro', 1000.76, 'USD', '$', 'Price'),
('apple-airpods-pro', 300.23, 'USD', '$', 'Price'),
('apple-airtag', 120.57, 'USD', '$', 'Price');

-- Gallery for 'huarache-x-stussy-le'
INSERT INTO gallery (product_id, image_url) VALUES
('huarache-x-stussy-le', 'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_2_720x.jpg?v=1612816087'),
('huarache-x-stussy-le', 'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_1_720x.jpg?v=1612816087'),
('huarache-x-stussy-le', 'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_3_720x.jpg?v=1612816087'),
('huarache-x-stussy-le', 'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_5_720x.jpg?v=1612816087'),
('huarache-x-stussy-le', 'https://cdn.shopify.com/s/files/1/0087/6193/3920/products/DD1381200_DEOA_4_720x.jpg?v=1612816087');

-- Gallery for 'jacket-canada-goosee'
INSERT INTO gallery (product_id, image_url) VALUES
('jacket-canada-goosee', 'https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016105/product-image/2409L_61.jpg'),
('jacket-canada-goosee', 'https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016107/product-image/2409L_61_a.jpg'),
('jacket-canada-goosee', 'https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016108/product-image/2409L_61_b.jpg'),
('jacket-canada-goosee', 'https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016109/product-image/2409L_61_c.jpg'),
('jacket-canada-goosee', 'https://images.canadagoose.com/image/upload/w_480,c_scale,f_auto,q_auto:best/v1576016110/product-image/2409L_61_d.jpg'),
('jacket-canada-goosee', 'https://images.canadagoose.com/image/upload/w_1333,c_scale,f_auto,q_auto:best/v1634058169/product-image/2409L_61_o.png'),
('jacket-canada-goosee', 'https://images.canadagoose.com/image/upload/w_1333,c_scale,f_auto,q_auto:best/v1634058159/product-image/2409L_61_p.png');

-- Gallery for 'ps-5'
INSERT INTO gallery (product_id, image_url) VALUES
('ps-5', 'https://images-na.ssl-images-amazon.com/images/I/510VSJ9mWDL._SL1262_.jpg'),
('ps-5', 'https://images-na.ssl-images-amazon.com/images/I/610%2B69ZsKCL._SL1500_.jpg'),
('ps-5', 'https://images-na.ssl-images-amazon.com/images/I/51iPoFwQT3L._SL1230_.jpg'),
('ps-5', 'https://images-na.ssl-images-amazon.com/images/I/61qbqFcvoNL._SL1500_.jpg'),
('ps-5', 'https://images-na.ssl-images-amazon.com/images/I/51HCjA3rqYL._SL1230_.jpg');

-- Gallery for 'xbox-series-s'
INSERT INTO gallery (product_id, image_url) VALUES
('xbox-series-s', 'https://images-na.ssl-images-amazon.com/images/I/71vPCX0bS-L._SL1500_.jpg'),
('xbox-series-s', 'https://images-na.ssl-images-amazon.com/images/I/71q7JTbRTpL._SL1500_.jpg'),
('xbox-series-s', 'https://images-na.ssl-images-amazon.com/images/I/71iQ4HGHtsL._SL1500_.jpg'),
('xbox-series-s', 'https://images-na.ssl-images-amazon.com/images/I/61IYrCrBzxL._SL1500_.jpg'),
('xbox-series-s', 'https://images-na.ssl-images-amazon.com/images/I/61RnXmpAmIL._SL1500_.jpg');

INSERT INTO gallery (product_id, image_url) VALUES
('apple-imac-2021', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/imac-24-blue-selection-hero-202104?wid=904&hei=840&fmt=jpeg&qlt=80&.v=1617492405000');

INSERT INTO gallery (product_id, image_url) VALUES
('apple-iphone-12-pro', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-pro-family-hero?wid=940&amp;hei=1112&amp;fmt=jpeg&amp;qlt=80&amp;.v=1604021663000');

INSERT INTO gallery (product_id, image_url) VALUES
('apple-airpods-pro', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MWP22?wid=572&hei=572&fmt=jpeg&qlt=95&.v=1591634795000');

INSERT INTO gallery (product_id, image_url) VALUES
('apple-airtag', 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airtag-double-select-202104?wid=445&hei=370&fmt=jpeg&qlt=95&.v=1617761672000');
