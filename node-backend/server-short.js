import express from 'express'

const app = express()
const port = 3000

app.get('/test', (req, res) => {
  res.json({ message: 'Jednoduchý testovací server funguje!' })
})

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`)
})
