-- Import propose des produits C2A extraits de GENERL.pdf
-- Source: GENERL.pdf, page unique "Sections des profils" - TPR 67 Ellipse
-- Important:
--   1. Ce script est une proposition d'import uniquement.
--   2. Ne pas executer avant verification des colonnes reelles de la table produits.
--   3. Le backend actuel semble utiliser prix_achat/prix_vente/stock_actuel/stock_min via JPA.
--   4. Le PDF ne montre pas de prix, stock, designation complete ou image produit separee.

INSERT INTO produits
(reference, categorie, designation, description, image_url, prix, stock_actuel, seuil_alerte, unite, actif)
VALUES
('67 103', 'ALUMINIUM', 'Profil aluminium 67 Ellipse 67 103', 'Profil aluminium serie 67 Ellipse. Dimensions visibles sur le plan technique du PDF GENERL.', 'C:\U\c2a-frontend\produits\produit1.png', NULL, 0, 5, 'metre', true),
('67 112', 'ALUMINIUM', 'Profil aluminium 67 Ellipse 67 112', 'Profil aluminium serie 67 Ellipse. Dimensions visibles sur le plan technique du PDF GENERL.', '/images/produits/default-product.jpg', NULL, 0, 5, 'metre', true),
('67 109', 'ALUMINIUM', 'Profil aluminium 67 Ellipse 67 109', 'Profil aluminium serie 67 Ellipse. Dimensions visibles sur le plan technique du PDF GENERL.', '/images/produits/default-product.jpg', NULL, 0, 5, 'metre', true),
('67 102', 'ALUMINIUM', 'Profil aluminium 67 Ellipse 67 102', 'Profil aluminium serie 67 Ellipse. Dimensions visibles sur le plan technique du PDF GENERL.', '/images/produits/default-product.jpg', NULL, 0, 5, 'metre', true),
('67 101', 'ALUMINIUM', 'Profil aluminium 67 Ellipse 67 101', 'Profil aluminium serie 67 Ellipse. Dimensions visibles sur le plan technique du PDF GENERL.', '/images/produits/default-product.jpg', NULL, 0, 5, 'metre', true),
('67 115', 'ALUMINIUM', 'Profil aluminium 67 Ellipse 67 115', 'Profil aluminium serie 67 Ellipse. Dimensions visibles sur le plan technique du PDF GENERL.', '/images/produits/default-product.jpg', NULL, 0, 5, 'metre', true);

