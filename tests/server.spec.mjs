import express from 'express'
import http from 'http'
import assert from 'assert'
import { once } from 'events'
import { test, before, after } from 'node:test'

// If using Node.js v18+, fetch is global. Otherwise, uncomment below:
// import fetch from 'node-fetch'

const app = express()
app.use(express.json())

class MockDatabase {
    byTypes(types) {
        return types.map((type) => ({ type }))
    }
    filterByTime(dataTypes, fromTime, toTime) {
        return [
            {
                dataTypes,
                from: fromTime,
                to: toTime,
            },
        ]
    }
}

const db = new MockDatabase()

app.get('/GetTypes', (req, res) => {
    const types = req.query.types.split(',')
    res.send(db.byTypes(types))
})

app.post('/TimeFilter', (req, res) => {
    const { FromTime, ToTime, DataTypes } = req.body
    res.send(db.filterByTime(DataTypes, FromTime, ToTime))
})

let server
let baseUrl

before(async () => {
    server = http.createServer(app)
    server.listen(0)
    await once(server, 'listening')
    const { port } = server.address()
    baseUrl = `http://localhost:${port}`
})

after(() => {
    server.close()
})

test('GET /GetTypes returns types', async () => {
    const res = await fetch(`${baseUrl}/GetTypes?types=a,b`)
    assert.strictEqual(res.status, 200)
    const data = await res.json()
    assert.deepStrictEqual(data, [{ type: 'a' }, { type: 'b' }])
})

test('POST /TimeFilter returns filtered data', async () => {
    const body = {
        FromTime: '2023-01-01',
        ToTime: '2023-01-02',
        DataTypes: ['x', 'y'],
    }
    const res = await fetch(`${baseUrl}/TimeFilter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    })
    assert.strictEqual(res.status, 200)
    const data = await res.json()
    assert.deepStrictEqual(data, [
        { dataTypes: ['x', 'y'], from: '2023-01-01', to: '2023-01-02' },
    ])
})
