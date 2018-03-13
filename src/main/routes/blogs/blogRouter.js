const Router = require('koa-router')
const {Pool} = require('pg')
const sqlDao = require('../../services/sqlDao')

const blogRouter = new Router()
const pool = new Pool()

blogRouter
    .get('/blogs', async (ctx, next) => {
        try {
            const {rows} = await sqlDao.list('blogs')
            ctx.body = rows
        } catch (e) {
            console.error('Error on getting blogs', e)
            throw e
        }
    })
    .get('/blogs/:id', async (ctx, next) => {
        // let response = await graphql(schema, '{hello}', root)
        // const client = await pool.connect()
        try {
            const {rows} = await sqlDao.get('blogs', ctx.params.id)
            if (!rows.length) {
                ctx.throw(404, 'blog not found', {id: ctx.params.id})
            }
            ctx.body = rows[0]
        } catch (e) {
            console.error('Error on getting blog', e)
            throw e
        } finally {
            // client.release()
        }
    })
    .post('/blogs', async (ctx, next) => {
        const client = await pool.connect()
        const {title, content} = ctx.request.body
        const date = new Date()
        const created_on = date
        const updated_on = date
        const created_by = 0
        const updated_by = 0
        try {
            await client.query('BEGIN')
            const insertBlogStatement = 'INSERT INTO blogs(title, content, created_on, created_by, updated_on, updated_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
            const insertBlogValues = [title, content, created_on, created_by, updated_on, updated_by]
            let {rows} = await client.query(insertBlogStatement, insertBlogValues)
            await client.query('COMMIT')
            ctx.body = rows[0]
        } catch (e) {
            await client.query('ROLLBACK')
            console.log('Error inserting blog', e)
            throw e
        } finally {
            client.release()
        }
    })
    .put('/blogs', async (ctx, next) => {

    })

module.exports = blogRouter