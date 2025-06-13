import fs from 'fs'
import path from 'path'

export default class Database {
    data = {}

    constructor() {
        const resourcesDir = path.join('./resources')
        const files = fs.readdirSync(resourcesDir)
        this.data = {}

        files.forEach((file) => {
            if (file.endsWith('.txt')) {
                const type = path.basename(file, '.txt')
                const content = fs.readFileSync(
                    path.join(resourcesDir, file),
                    'utf8',
                )
                const lines = content.trim().split('\n')
                if (lines.length < 2) return
                const headers = lines[0].split('|')
                const records = lines.slice(1).map((line) => {
                    const values = line.split('|')
                    const obj = headers.reduce((obj, header, idx) => {
                        obj[header] = values[idx]
                        return obj
                    }, {})
                    // Convert DateTime if present
                    if (obj.DateTime) {
                        const date = new Date(obj.DateTime)
                        if (!isNaN(date)) {
                            const yyyy = date.getFullYear()
                            const mm = String(date.getMonth() + 1).padStart(
                                2,
                                '0',
                            )
                            const dd = String(date.getDate()).padStart(2, '0')
                            const hh = String(date.getHours()).padStart(2, '0')
                            const min = String(date.getMinutes()).padStart(
                                2,
                                '0',
                            )
                            obj.DateTime = `${yyyy}-${mm}-${dd}T${hh}:${min}`
                        }
                    }
                    return obj
                })
                this.data[type] = records
            }
        })
    }

    byTypes(types) {
        const responseObject = {}

        types.forEach((type) => {
            responseObject[type] = this.data[type]
        })

        return responseObject
    }

    filterByTime(types, from, to) {
        const fromTime = new Date(from)
        const toTime = new Date(to)
        const responseObject = {}

        types.forEach((type) => {
            if (!this.data[type]) return
            responseObject[type] = this.data[type].filter(({ DateTime }) => {
                const time = new Date(DateTime)
                return time >= fromTime && time <= toTime
            })
        })

        return responseObject
    }
}
