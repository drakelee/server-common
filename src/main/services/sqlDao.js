const {Pool} = require('pg')
const pool = new Pool()

class SqlDao {
    async list(table) {
        try {
            return await pool.query(`SELECT * FROM ${table}`)
        } catch (e) {
            console.error('Error retrieving list from sqlDao', e)
            throw e
        }
    }

    async get(table, id) {
        try {
            return await pool.query(`SELECT * FROM ${table} WHERE id=$1`, [id])
        } catch (e) {
            console.error('Error on get from sqlDao', e)
            throw e
        } finally {
            // client.release()
        }
    }
}

module.exports =  new SqlDao()
