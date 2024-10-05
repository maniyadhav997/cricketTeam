const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')

const app = express()
app.use(express.json())

const dpath = path.join(__dirname, 'cricketTeam.db')

let db = null

const intialzeDBAndServer = async () => {
  try {
    db = await open({
      filename: dpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running on http://localhost:3000')
    })
  } catch (e) {
    console.log(`Error ${e.message}`)
    process.exit(1)
  }
}

intialzeDBAndServer()
//Get player details
app.get('/players/', async (request, response) => {
  const getALlplayersQuery = `
    SELECT * FROM cricket_team;
    `
  const playerArray = await db.all(getALlplayersQuery)
  response.send(playerArray)
})
//Add player
app.post('/players/', async (request, response) => {
  const getDetails = request.body
  const {playerName, jerseyNumber, role} = getDetails
  const addPlayerQuery = `
  INSERT INTO 
      cricket_team(player_name, jersey_number, role)
  values(
    ${playerName},
    ${jerseyNumber},
    ${role}
  );`
  const dbResponse = await db.run(addPlayerQuery)
  response.send('Player Added to Team')
})

app.get('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const getplayerQuery = `
    SELECT * FROM cricket_team
     WHERE player_id=${playerId};
    `
  const player = await db.get(getplayerQuery)
  response.send(player)
})

//Update player

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getBody = request.body
  const {playerName, jerseyNumber, role} = getBody
  const updatePlayerQuery = `
  update
    cricket_team
  set 
    player_name:${playerName},
    jersey_number: ${jerseyNumber},
    role: ${role} 
  where
    player_id = ${playerId} ;`
  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})
//Delete player

app.delete('/players/:playerId', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
  DELETE 
       FROM
          cricket_team
           WHERE player_id=${playerId};
  `
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
