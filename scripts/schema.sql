CREATE DATABASE IF NOT EXISTS pwa_etape02 DEFAULT CHARACTER SET utf8mb4;
USE pwa_etape02;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150),
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client','editeur','gestionnaire','administrateur') DEFAULT 'client',
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) UNIQUE,
  description TEXT
);

CREATE TABLE IF NOT EXISTS ouvrages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(255),
  auteur VARCHAR(255),
  isbn VARCHAR(32) UNIQUE,
  description TEXT,
  prix DECIMAL(10,2),
  stock INT CHECK (stock >= 0),
  categorie_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_ouvrages_categorie FOREIGN KEY (categorie_id) REFERENCES categories(id)
    ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS panier (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  actif BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_panier_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS panier_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  panier_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite INT NOT NULL CHECK (quantite > 0),
  prix_unitaire DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_paniers_items_panier FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE CASCADE,
  CONSTRAINT fk_paniers_items_ouvrage FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS commandes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  total DECIMAL(10,2) NOT NULL,
  statut ENUM('en_cours','payee','annulee','expediee') DEFAULT 'en_cours',
  adresse_livraison TEXT,
  mode_livraison VARCHAR(100),
  mode_paiement VARCHAR(100),
  payment_provider_id VARCHAR(190),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_commandes_client FOREIGN KEY (client_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS commande_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  commande_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite INT NOT NULL CHECK (quantite > 0),
  prix_unitaire DECIMAL(10,2) NOT NULL,
  CONSTRAINT fk_commande_item_commande FOREIGN KEY (commande_id) REFERENCES commandes(id) ON DELETE CASCADE,
  CONSTRAINT fk_commande_item_ouvrage FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS listes_cadeaux (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(190),
  proprietaire_id INT NOT NULL,
  code_partage VARCHAR(64) UNIQUE,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_listes_user FOREIGN KEY (proprietaire_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS liste_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  liste_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  quantite_souhaitee INT NOT NULL CHECK (quantite_souhaitee > 0),
  CONSTRAINT fk_liste_item_liste FOREIGN KEY (liste_id) REFERENCES listes_cadeaux(id) ON DELETE CASCADE,
  CONSTRAINT fk_liste_item_ouvrage FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS avis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  note INT NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_avis_client_ouvrage UNIQUE (client_id, ouvrage_id),
  CONSTRAINT fk_avis_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_avis_ouvrage FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS commentaires (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT NOT NULL,
  ouvrage_id INT NOT NULL,
  contenu TEXT,
  valide BOOLEAN DEFAULT FALSE,
  date_soumission TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_validation TIMESTAMP NULL,
  valide_par INT NULL,
  CONSTRAINT fk_comment_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_ouvrage FOREIGN KEY (ouvrage_id) REFERENCES ouvrages(id) ON DELETE CASCADE,
  CONSTRAINT fk_comment_valide_par FOREIGN KEY (valide_par) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes utiles
CREATE INDEX idx_ouvrages_categorie ON ouvrages(categorie_id);
CREATE INDEX idx_ouvrages_titre ON ouvrages(titre);
CREATE INDEX idx_commandes_client ON commandes(client_id);

-- Règle: avis seulement si le client a commandé cet ouvrage
-- Cette contrainte sera vérifiée côté API (transactions).

