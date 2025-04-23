const addEvent = async (event) => {
  try {
    const response = await fetch('http://localhost/work-scheduler/backend/addEvent.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: event.date,
        description: event.description,
      }),
    })
    const data = await response.json()
    console.log(data)
  } catch (error) {
    console.error('Fetch Error:', error)
  }
}

addEvent({ date: '2025-04-23', description: 'Test událost' })

/*import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/json'

export const addEvent = async (event) => {
  const response = await axios.post(
    'http://localhost/work-scheduler/backend/addEvent.php',
    {
      date: event.date,
      description: event.description,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  return response.data
}
export const getEvents = async () => {
  const response = await axios.get('http://localhost/work-scheduler/backend/getEvents.php')
  return response.data
}
export const deleteEvent = async (id) => {
  const response = await axios.post('http://localhost/work-scheduler/backend/deleteEvent.php', {
    id: id,
  })
  return response.data
}*/
