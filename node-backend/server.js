import express from 'express'
import mysql from 'mysql2'
//import cors from 'cors'

const app = express()
const port = 3000

// Middleware pro zpracování JSON požadavků
app.use(express.json())

// Middleware pro CORS
/*app.use(
  cors({
    origin: 'http://localhost:5174', // Povolení Vue frontend
    methods: ['GET', 'POST'], // Povolené metody
    allowedHeaders: ['Content-Type'], // Povolené hlavičky
  }),
)*/

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

// Testovací endpoint pro kontrolu CORS
/*app.get('/test', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5174')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  res.json({ message: 'Testovací odpověď funguje!' })
})*/

// Připojení k databázi
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'work_scheduler',
})

// Endpoint pro získání událostí
app.get('/api/events', (req, res) => {
  connection.query('SELECT * FROM events', (error, results) => {
    if (error) {
      console.error('Chyba při dotazu:', error)
      res.status(500).send('Chyba na serveru')
      return
    }
    res.json(results)
  })
})

// Endpoint pro přidání nové události
app.post('/api/events', (req, res) => {
  const { date, description } = req.body
  const query = 'INSERT INTO events (date, description) VALUES (?, ?)'
  connection.query(query, [date, description], (error) => {
    if (error) {
      console.error('Chyba při vkládání do databáze:', error)
      res.status(500).send('Chyba na serveru')
      return
    }
    res.json({ status: 'success', message: 'Událost přidána!' })
  })
})

// Spuštění serveru
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`)
})
