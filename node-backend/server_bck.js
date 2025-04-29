import express from 'express'
import mysql from 'mysql2'

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
// Připojení k databázi MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'work_scheduler',
})

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

//--- Endpoint pro získání úkolů daného dne --------------------------------------------------------------------------------
app.get('/api/eventsofday', (req, res) => {
  const { date } = req.query
  if (!date) {
    res.status(400).send('Chybí parametr data')
    return
  }
  ensureTableExists(tableEvents, (error) => {
    if (error) {
      res.status(500).send('Chyba na serveru při kontrole tabulky')
      return
    }

    let query = 'SELECT * FROM events e '
    query += ' WHERE e.date = ? AND disabled = 0 ORDER BY e.date ASC, e.id ASC'

    // Dotaz na data z tabulky
    connection.query(query, [date], (queryError, results) => {
      if (queryError) {
        console.error('Chyba při dotazu:', queryError)
        res.status(500).send('Chyba na serveru - získávání událostí')
        return
      }
      // Formátování dat pro JSON odpověď
      const formattedResults = results.map((event) => ({
        ...event,
        date: event.date ? formatToLocal(event.date) : null,
        date_end: event.date_end ? formatToLocal(event.date_end) : null,
      }))

      res.json(formattedResults)
    })
  })
})
//--- Endpoint pro získání typů úkolů --------------------------------------------------------------------------------
app.get('/api/tasks', (req, res) => {
  ensureTableExists(tableTasks, (error) => {
    if (error) {
      res.status(500).send('Chyba na serveru při kontrole tabulky')
      return
    }

    let query = 'SELECT * FROM eventtasks t  WHERE t.disabled = 0 ORDER BY t.num ASC, t.id ASC'
    // Dotaz na data z tabulky
    connection.query(query, (queryError, results) => {
      if (queryError) {
        console.error('Chyba při dotazu:', queryError)
        res.status(500).send('Chyba na serveru - získávání událostí')
        return
      }

      res.json(results)
    })
  })
})
//--- Endpoint pro přidání/editaci typu úkolů -------------------------------------------------------------------------------
app.post('/api/tasks', (req, res) => {
  const { id, id_user, id_group, num, name, icon, bg, color, description, disabled, visible } =
    req.body

  ensureTableExists(tableTasks, (error) => {
    if (error) {
      res.status(500).send('Chyba na serveru při kontrole tabulky - POST')
      return
    }

    // Pokud je id vyplněno, použijeme UPDATE, jinak INSERT
    if (id > 0) {
      const updateQuery = `
        UPDATE eventtasks
        SET id_user = ?, id_group = ?, num = ?, name = ?, icon = ?, bg = ?, color = ?, description = ?, disabled = ?, visible = ?
        WHERE id = ?
      `
      connection.query(
        updateQuery,
        [id_user, id_group, num, name, bg, color, description, disabled, visible, id],
        (updateError, results) => {
          if (updateError) {
            console.error('Chyba při aktualizaci databáze:', updateError)
            res.status(500).send('Chyba na serveru při aktualizaci záznamu')
            return
          }
          res.json({
            status: 'success',
            message: 'EventTask aktualizován!',
            Values: {
              id: results.insertId,
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
            },
          })
        },
      )
    } else {
      const insertQuery = `
        INSERT INTO eventtasks (id_user, id_group, num, name, icon, bg, color, description, disabled, visible)
        VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?)
      `
      connection.query(
        insertQuery,
        [id_user, id_group, num, name, bg, color, description, disabled, visible],
        (insertError, results) => {
          if (insertError) {
            console.error('Chyba při vkládání do databáze:', insertError)
            res.status(500).send('Chyba na serveru při vkládání záznamu')
            return
          }
          res.json({
            status: 'success',
            message: 'EventTask přidán!',
            Values: {
              id: results.insertId,
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
            },
          })
        },
      )
    }
  })
})

//------------------------------------------------------------------------------------------------------------------
//--- Endpoint pro získání skupin úkolů --------------------------------------------------------------------------------
app.get('/api/groups', (req, res) => {
  ensureTableExists(tableGroups, (error) => {
    if (error) {
      res.status(500).send('Chyba na serveru při kontrole tabulky')
      return
    }

    // Dotaz na data z tabulky
    connection.query('SELECT * FROM eventgroups WHERE disabled = 0', (queryError, results) => {
      if (queryError) {
        console.error('Chyba při dotazu:', queryError)
        res.status(500).send('Chyba na serveru - získávání událostí')
        return
      }

      res.json(results)
    })
  })
})
//--- Endpoint pro přidání/editaci skupiny úkolů -------------------------------------------------------------------------------
app.post('/api/groups', (req, res) => {
  const { id, id_user, num, name, description, disabled, visible, bg, color, icon } = req.body

  ensureTableExists(tableGroups, (error) => {
    if (error) {
      res.status(500).send('Chyba na serveru při kontrole tabulky - POST')
      return
    }

    // Pokud je id vyplněno, použijeme UPDATE, jinak INSERT
    if (id > 0) {
      const updateQuery = `
        UPDATE eventgroups
        SET id_user = ?, num = ?, name = ?, description = ?, disabled = ?, visible = ?, bg = ?, color = ?, icon = ?
        WHERE id = ?
      `
      connection.query(
        updateQuery,
        [id_user, num, name, description, disabled, visible, id, bg, color, icon],
        (updateError, results) => {
          if (updateError) {
            console.error('Chyba při aktualizaci databáze:', updateError)
            res.status(500).send('Chyba na serveru při aktualizaci záznamu')
            return
          }
          res.json({
            status: 'success',
            message: 'Skupina aktualizována!',
            Values: {
              id: results.insertId,
              id_user,
              num,
              name,
              description,
              disabled,
              visible,
              bg,
              color,
              icon,
            },
          })
        },
      )
    } else {
      const insertQuery = `
        INSERT INTO eventgroups (id_user, num, name, description, disabled, visible, bg, color, icon)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      connection.query(
        insertQuery,
        [id_user, num, name, description, disabled, visible],
        (insertError, results) => {
          if (insertError) {
            console.error('Chyba při vkládání do databáze:', insertError)
            res.status(500).send('Chyba na serveru při vkládání záznamu')
            return
          }
          res.json({
            status: 'success',
            message: 'Skupina přidána!',
            Values: {
              id: results.insertId,
              id_user,
              num,
              name,
              description,
              disabled,
              visible,
              bg,
              color,
              icon,
            },
          })
        },
      )
    }
  })
})

//------------------------------------------------------------------------------------------------------------------
//--- Endpoint pro získání událostí --------------------------------------------------------------------------------
app.get('/api/events', (req, res) => {
  ensureTableExists(tableEvents, (error) => {
    if (error) {
      res.status(500).send('Chyba na serveru při kontrole tabulky')
      return
    }

    let query = 'SELECT e.*, t.id_group FROM events e '
    query += 'INNER JOIN eventtasks t ON e.type_event = t.id'
    query += ' WHERE e.disabled = 0 AND e.visible = 1'
    query += ' ORDER BY e.date ASC, e.id ASC'

    // Dotaz na data z tabulky
    connection.query(query, (queryError, results) => {
      if (queryError) {
        console.error('Chyba při dotazu:', queryError)
        res.status(500).send('Chyba na serveru - získávání událostí')
        return
      }
      // Formátování dat pro JSON odpověď
      const formattedResults = results.map((event) => ({
        ...event,
        date: event.date ? formatToLocal(event.date) : null,
        date_end: event.date_end ? formatToLocal(event.date_end) : null,
      }))

      res.json(formattedResults)
    })
  })
})
//--- Endpoint pro přidání/editaci události -------------------------------------------------------------------------------
app.post('/api/events', (req, res) => {
  const { id, id_user, type_event, date, date_end, description, name, disabled, visible, num } =
    req.body

  ensureTableExists(tableEvents, (error) => {
    if (error) {
      res.status(500).send('Chyba na serveru při kontrole tabulky - POST')
      return
    }

    // Rozdělení logiky na UPDATE a INSERT
    if (id > 0) {
      const updateQuery = `
        UPDATE events
        SET id_user = ?, type_event = ?, date = ?, date_end = ?, description = ?, name = ?, disabled = ?, visible = ?, num = ?
        WHERE id = ?
      `
      connection.query(
        updateQuery,
        [id_user, type_event, date, date_end, description, name, disabled, visible, num, id],
        (updateError, results) => {
          if (updateError) {
            console.error('Chyba při aktualizaci databáze:', updateError)
            res.status(500).send('Chyba na serveru při aktualizaci záznamu')
            return
          }
          res.json({
            status: 'success',
            message: 'Událost aktualizována!',
            Values: {
              id: results.insertId,
              id_user,
              type_event,
              date,
              date_end,
              num,
              name,
              description,
              disabled,
              visible,
            },
          })
        },
      )
    } else {
      const insertQuery = `
        INSERT INTO events (id_user, type_event, date, date_end, description, name, disabled, visible, num)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      connection.query(
        insertQuery,
        [id_user, type_event, date, date_end, description, name, disabled, visible, num],
        (insertError, results) => {
          if (insertError) {
            console.error('Chyba při vkládání do databáze:', insertError)
            res.status(500).send('Chyba na serveru při vkládání záznamu')
            return
          }
          res.json({
            status: 'success',
            message: 'Událost přidána!',
            Values: {
              id: results.insertId,
              id_user,
              type_event,
              date,
              date_end,
              num,
              name,
              description,
              disabled,
              visible,
            },
          })
        },
      )
    }
  })
})
//--- Endpoint pro vypnutí události -------------------------------------------------------------------------------
app.put('/api/events/:id/disable', async (req, res) => {
  const eventId = req.params.id
  try {
    await connection.query('UPDATE events SET disabled = 1 WHERE id = ?', [eventId])
    res.status(200).send({ message: `Událost s ID ${eventId} byla deaktivována.` })
  } catch (error) {
    console.error('Chyba při deaktivaci události:', error)
    res.status(500).send({ error: 'Nepodařilo se deaktivovat událost.' })
  }
})
//--- Funkce pro zajištění existence tabulky ---------------------------------------------------
const ensureTableExists = (createTableQuery, callback) => {
  connection.query(createTableQuery, (error) => {
    if (error) {
      console.error('Chyba při kontrole nebo vytváření tabulky:', error)
      callback(error) // Vracíme chybu zpět volající funkci
      return
    }
    callback(null) // Úspěšně zkontrolováno nebo vytvořeno
  })
}
// Funkce pro formátování času na lokální časovou zónu (Europe/Prague)
function formatToLocal(date) {
  const utcDate = new Date(date)
  return new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000)
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19)
}
//-- Spuštění serveru ------------------------------------------------
app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`)
})
