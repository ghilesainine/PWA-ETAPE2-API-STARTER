import { pool } from '../src/config/db.js';
// hash bcrypt pour "admin123"
const adminHash = '$2b$10$D7o6XWbV9pUQn53wO2YVxO4B5O9m0iH7oXK9nTz8r0yH0y4QH9lD6';

async function run() {
  await pool.query("INSERT INTO categories (nom, description) VALUES ('Roman','Fiction'),('Informatique','Tech'),('Manga','BD');");
  await pool.query("INSERT INTO users (nom, email, password_hash, role) VALUES ('Admin', 'admin@example.com', ?, 'administrateur');",[adminHash]);
  await pool.query(`INSERT INTO ouvrages (titre, auteur, isbn, description, prix, stock, categorie_id)
    VALUES
    ('Clean Code','Robert C. Martin','9780132350884','Bonnes pratiques',39.99,5,2),
    ('One Piece T1','Eiichiro Oda','9781569319017','Aventure',12.99,20,3),
    ('Le Petit Prince','Antoine de Saint-Exupéry','9780156013987','Classique',9.99,10,1);`);
  console.log('Jeu de données minimal inséré.');
  process.exit(0);
}
run().catch(e => { console.error(e); process.exit(1); });