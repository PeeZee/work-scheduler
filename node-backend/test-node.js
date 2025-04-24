import mysql from 'mysql2'

// Nastavení připojení
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'work_scheduler', // Název vaší databáze
})

// Test připojení
connection.connect((error) => {
  if (error) {
    console.error('Chyba při připojení k databázi:', error)
    return
  }
  console.log('Úspěšně připojeno k MySQL databázi!')
})

// Kontrola existence tabulky a její vytvoření
const createTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        date DATE NOT NULL,
        description TEXT NOT NULL
    )
`

connection.query(createTableQuery, (error) => {
  if (error) {
    console.error('Chyba při kontrole nebo vytváření tabulky:', error)
    return
  }
  console.log('Tabulka "events" je připravena!')
})

// Příklad dotazu (SELECT)
connection.query('SELECT * FROM events', (error, results) => {
  if (error) {
    console.error('Chyba při provádění dotazu:', error)
    return
  }
  console.log('Výsledky dotazu:', results)
})

// Ukončení připojení
connection.end()
