import express from 'express'
import os from 'os'
import Database from './database.mjs'

const app = express()
app.use(express.json())
const PORT = 3000

const db = new Database()

app.get('/', (req, res) => {
    res.status(200).send('OK')
})

app.get('/GetTypes', (req, res) => {
    const types = req.query.types.split(',')
    res.send(db.byTypes(types))
})

app.post('/TimeFilter', (req, res) => {
    const { FromTime, ToTime, DataTypes } = req.body
    res.send(db.filterByTime(DataTypes, FromTime, ToTime))
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
    console.log(`Hostname: ${os.hostname()}`)
    console.log(
        `IP Address: ${
            Object.values(os.networkInterfaces())
                .flat()
                .find((iface) => iface.family === 'IPv4' && !iface.internal)
                .address
        }`,
    )
})
