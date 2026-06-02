CREATE TABLE IF NOT EXISTS catalogue_aluminium (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  reference VARCHAR(20) NOT NULL UNIQUE,
  nom VARCHAR(150) NOT NULL,
  categorie VARCHAR(80),
  image VARCHAR(255),
  largeur DECIMAL(8,2),
  hauteur DECIMAL(8,2),
  description TEXT
);

INSERT INTO catalogue_aluminium
  (reference, nom, categorie, image, largeur, hauteur, description)
VALUES
  ('67 103', 'Profile aluminium 67 103', 'Profiles aluminium', '/images/catalogue-aluminium/67-103.png', 65.00, 75.00, 'Profile aluminium technique reference 67 103. Largeur 65 mm, hauteur 75 mm, retombee visible 40 mm.'),
  ('67 112', 'Profile aluminium 67 112', 'Profiles aluminium', '/images/catalogue-aluminium/67-112.png', 65.00, 85.00, 'Profile aluminium technique reference 67 112. Largeur 65 mm, hauteur 85 mm, retombee visible 40 mm.'),
  ('67 109', 'Profile aluminium 67 109', 'Profiles aluminium', '/images/catalogue-aluminium/67-109.png', 81.50, 61.00, 'Profile aluminium technique reference 67 109. Largeur 81.5 mm, hauteur 61 mm, retombee visible 40 mm.'),
  ('67 102', 'Profile aluminium 67 102', 'Profiles aluminium', '/images/catalogue-aluminium/67-102.png', 65.00, 61.00, 'Profile aluminium technique reference 67 102. Largeur 65 mm, hauteur 61 mm, retombee visible 40 mm.'),
  ('67 101', 'Profile aluminium 67 101', 'Profiles aluminium', '/images/catalogue-aluminium/67-101.png', 65.00, 40.00, 'Profile aluminium technique reference 67 101. Largeur 65 mm, hauteur 40 mm, cote interieure visible 36.5 mm.'),
  ('67 115', 'Profile aluminium 67 115', 'Profiles aluminium', '/images/catalogue-aluminium/67-115.png', 65.00, 40.00, 'Profile aluminium technique reference 67 115. Largeur 65 mm, hauteur 40 mm, cote interieure visible 36.5 mm.')
ON DUPLICATE KEY UPDATE
  nom = VALUES(nom),
  categorie = VALUES(categorie),
  image = VALUES(image),
  largeur = VALUES(largeur),
  hauteur = VALUES(hauteur),
  description = VALUES(description);
