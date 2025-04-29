import express from 'express'
import mysql from 'mysql2/promise' // Použití Promise verze

const app = express()
const port = 3000

// Middleware pro zpracování JSON požadavků
app.use(express.json())

// Nastavení hlaviček pro CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

//--- Připojení k databázi ---------------------------------------------------------------
let connection
;(async () => {
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'work_scheduler',
    })
    console.log('Připojeno k databázi!')
  } catch (error) {
    console.error('Chyba při připojení k databázi:', error)
  }
})()

const tableEvents = `
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NULL,
  type_event INT NULL,
  date DATETIME NULL,
  date_end DATETIME NULL,
  num INT NOT NULL DEFAULT 0,
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  name VARCHAR(255) NOT NULL DEFAULT '',
  disabled BOOLEAN NOT NULL DEFAULT FALSE,
  visible BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci
AUTO_INCREMENT=1
`
const tableGroups = `
CREATE TABLE IF NOT EXISTS eventgroups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NULL,
  num INT NOT NULL DEFAULT 0,
  name VARCHAR(255) NOT NULL DEFAULT '',
  description TEXT NULL,
  icon VARCHAR(50) NOT NULL DEFAULT '',
  bg VARCHAR(10) NOT NULL DEFAULT '',
  color VARCHAR(10) NOT NULL DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  disabled BOOLEAN NOT NULL DEFAULT FALSE,
  visible BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci
AUTO_INCREMENT=1
`
const tableTasks = `
CREATE TABLE IF NOT EXISTS eventtasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_user INT NULL,
  id_group INT NULL,
  num INT NOT NULL DEFAULT 0,
  name VARCHAR(255) NOT NULL DEFAULT '',
  icon VARCHAR(50) NOT NULL DEFAULT '',
  bg VARCHAR(10) NOT NULL DEFAULT '',
  color VARCHAR(10) NOT NULL DEFAULT '',
  description TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  disabled BOOLEAN NOT NULL DEFAULT FALSE,
  visible BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci
AUTO_INCREMENT=1
`

//--- Funkce pro zajištění existence tabulky ---------------------------------------------------
const ensureTableExists = async (createTableQuery) => {
  try {
    await connection.query(createTableQuery)
    //console.log('Tabulka úspěšně zkontrolována nebo vytvořena!')
  } catch (error) {
    console.error('Chyba při kontrole nebo vytváření tabulky:', error)
    throw error
  }
}

// Funkce pro formátování času na lokální časovou zónu
function formatToLocal(date) {
  const utcDate = new Date(date)
  return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19)
}

//--- Endpointy ---------------------------------------------------------------------------
app.get('/api/eventsofday', async (req, res) => {
  const { date } = req.query
  if (!date) {
    res.status(400).send('Chybí parametr data')
    return
  }
  try {
    await ensureTableExists(tableEvents)
    const query = 'SELECT * FROM events WHERE date = ? AND disabled = 0 ORDER BY date ASC, id ASC'
    const [results] = await connection.query(query, [date])
    res.json(results.map((event) => ({ ...event, date: formatToLocal(event.date) })))
  } catch (error) {
    console.error(error)
    res.status(500).send('Chyba na serveru - získávání událostí')
  }
})

app.get('/api/tasks', async (req, res) => {
  try {
    await ensureTableExists(tableTasks)
    const query = 'SELECT * FROM eventtasks WHERE disabled = 0 ORDER BY num ASC, id ASC'
    const [results] = await connection.query(query)
    res.json(results)
  } catch (error) {
    console.error(error)
    res.status(500).send('Chyba na serveru - získávání úkolů')
  }
})

app.post('/api/tasks', async (req, res) => {
  const { id, id_user, id_group, num, name, icon, bg, color, description, disabled, visible } =
    req.body
  try {
    await ensureTableExists(tableTasks)
    if (id > 0) {
      const updateQuery = `
        UPDATE eventtasks
        SET id_user = ?, id_group = ?, num = ?, name = ?, icon = ?, bg = ?, color = ?, description = ?, disabled = ?, visible = ?
        WHERE id = ?
      `
      await connection.query(updateQuery, [
        id_user,
        id_group,
        num,
        name,
        icon,
        bg,
        color,
        description,
        disabled,
        visible,
        id,
      ])
      res.json({ status: 'success', message: 'EventTask aktualizován!', id: id })
    } else {
      const insertQuery = `
        INSERT INTO eventtasks (id_user, id_group, num, name, icon, bg, color, description, disabled, visible)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      const [result] = await connection.query(insertQuery, [
        id_user,
        id_group,
        num,
        name,
        icon,
        bg,
        color,
        description,
        disabled,
        visible,
      ])
      res.json({
        status: 'success',
        message: 'EventTask přidán!',
        id: result.insertId,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Chyba na serveru při zpracování úkolů')
  }
})

app.get('/api/groups', async (req, res) => {
  try {
    await ensureTableExists(tableGroups)
    const [results] = await connection.query('SELECT * FROM eventgroups WHERE disabled = 0')
    res.json(results)
  } catch (error) {
    console.error(error)
    res.status(500).send('Chyba na serveru - získávání skupin')
  }
})

app.post('/api/groups', async (req, res) => {
  const { id, id_user, num, name, description, disabled, visible, bg, color, icon } = req.body
  try {
    await ensureTableExists(tableGroups)
    if (id > 0) {
      const updateQuery = `
        UPDATE eventgroups
        SET id_user = ?, num = ?, name = ?, description = ?, disabled = ?, visible = ?, bg = ?, color = ?, icon = ?
        WHERE id = ?
      `
      await connection.query(updateQuery, [
        id_user,
        num,
        name,
        description,
        disabled,
        visible,
        bg,
        color,
        icon,
        id,
      ])
      res.json({ status: 'success', message: 'Skupina aktualizována!', id: id })
    } else {
      const insertQuery = `
        INSERT INTO eventgroups (id_user, num, name, description, disabled, visible, bg, color, icon)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      const [result] = await connection.query(insertQuery, [
        id_user,
        num,
        name,
        description,
        disabled,
        visible,
        bg,
        color,
        icon,
      ])
      res.json({ status: 'success', message: 'Skupina přidána!', id: result.insertId })
    }
  } catch (error) {
    console.error(error)
    res.status(500).send('Chyba na serveru při zpracování skupin')
  }
})

app.get('/api/events', async (req, res) => {
  try {
    await ensureTableExists(tableEvents) // Zajištění existence tabulky

    const query = `
      SELECT e.*, t.id_group
      FROM events e
      INNER JOIN eventtasks t ON e.type_event = t.id
      WHERE e.disabled = 0 AND e.visible = 1
      ORDER BY e.date ASC, e.id ASC
    `

    const [results] = await connection.query(query) // Asynchronní dotaz na databázi

    const formattedResults = results.map((event) => ({
      ...event,
      date: event.date ? formatToLocal(event.date) : null,
      date_end: event.date_end ? formatToLocal(event.date_end) : null,
    }))

    res.json(formattedResults)
  } catch (error) {
    console.error('Chyba při získávání událostí:', error)
    res.status(500).send('Chyba na serveru při získávání událostí')
  }
})

//--- Endpoint pro přidání nebo aktualizaci událostí ---------------------------------------------
app.post('/api/events', async (req, res) => {
  const { id, id_user, type_event, date, date_end, description, name, disabled, visible, num } =
    req.body

  try {
    await ensureTableExists(tableEvents) // Zajištění existence tabulky

    if (id > 0) {
      const updateQuery = `
        UPDATE events
        SET id_user = ?, type_event = ?, date = ?, date_end = ?, description = ?, name = ?, disabled = ?, visible = ?, num = ?
        WHERE id = ?
      `
      await connection.query(updateQuery, [
        id_user,
        type_event,
        date,
        date_end,
        description,
        name,
        disabled,
        visible,
        num,
        id,
      ])
      res.json({ status: 'success', message: 'Událost aktualizována!', id: id })
    } else {
      const insertQuery = `
        INSERT INTO events (id_user, type_event, date, date_end, description, name, disabled, visible, num)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      const [result] = await connection.query(insertQuery, [
        id_user,
        type_event,
        date,
        date_end,
        description,
        name,
        disabled,
        visible,
        num,
      ])
      res.json({ status: 'success', message: 'Událost přidána!', id: result.insertId })
    }
  } catch (error) {
    console.error('Chyba při ukládání události:', error)
    res.status(500).send('Chyba na serveru při ukládání události')
  }
})

//--- Endpoint pro deaktivaci události ------------------------------------------------------
app.put('/api/events/:id/disable', async (req, res) => {
  const eventId = req.params.id

  try {
    await ensureTableExists(tableEvents) // Zajištění existence tabulky

    const disableQuery = 'UPDATE events SET disabled = 1 WHERE id = ?'
    await connection.query(disableQuery, [eventId])

    res.status(200).send({ message: `Událost s ID ${eventId} byla deaktivována.` })
  } catch (error) {
    console.error('Chyba při deaktivaci události:', error)
    res.status(500).send('Chyba na serveru při deaktivaci události')
  }
})
//--- Endpoint pro deaktivaci skupiny ------------------------------------------------------
app.put('/api/groups/:id/disable', async (req, res) => {
  const eventId = req.params.id

  try {
    await ensureTableExists(tableGroups) // Zajištění existence tabulky

    const disableQuery = 'UPDATE eventgroups SET disabled = 1 WHERE id = ?'
    await connection.query(disableQuery, [eventId])

    res.status(200).send({ message: `Skupina s ID ${eventId} byla deaktivována.` })
  } catch (error) {
    console.error('Chyba při deaktivaci skupiny:', error)
    res.status(500).send('Chyba na serveru při deaktivaci skupiny')
  }
})
//--- Endpoint pro deaktivaci typu ukolu ------------------------------------------------------
app.put('/api/tasks/:id/disable', async (req, res) => {
  const eventId = req.params.id

  try {
    await ensureTableExists(tableTasks) // Zajištění existence tabulky

    const disableQuery = 'UPDATE eventtasks SET disabled = 1 WHERE id = ?'
    await connection.query(disableQuery, [eventId])

    res.status(200).send({ message: `Typ úkolu s ID ${eventId} byla deaktivován.` })
  } catch (error) {
    console.error('Chyba při deaktivaci typu úkolu:', error)
    res.status(500).send('Chyba na serveru při deaktivaci typu úkolu')
  }
})
//--- Spuštění serveru ----------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`)
})
