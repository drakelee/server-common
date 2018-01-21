require('dotenv').config()
const Koa = require('koa')
const cors = require('koajs-cors')
const Router = require('koa-router')
const {graphql, buildSchema} = require('graphql')
const {Client, Pool} = require('pg')
const pool = new Pool()
const app = new Koa()
const router = new Router()

let schema = buildSchema(`
    type Query {
        hello: String
    }
`)

let root = {hello: () => 'hello world!'}

// routes

router
    .get('/blogs/:id', async (ctx, next) => {
        // let response = await graphql(schema, '{hello}', root)
        // const client = await pool.connect()
        try {
            const {rows} = await pool.query('SELECT * FROM blogs WHERE id=$1', [ctx.params.id])
            if (!rows.length) {
                ctx.throw(404, 'blog not found', {id: ctx.params.id})
            }
            ctx.body = rows[0]
        } catch (e) {
            console.error('Error on query', e)
            throw e
        } finally {
            // client.release()
        }
    })
    .post('/blogs', async (ctx, next) => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            const date = new Date()
            const insertBlogStatement = 'INSERT INTO blogs(title, content, created_on, created_by, updated_on, updated_by) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
            const insertBlogValues = ['New Title', 'Riveting Content', date, 0, date, 0]
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

app.use(cors({
    origin: ['http://localhost:3000']
}))

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    ctx.set('X-Response-Time', `${ms}ms`)
})

// logger
app.use(async (ctx, next) => {
    const start = Date.now()
    await next()
    const ms = Date.now() - start
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms ${ctx.status}`)
})

app
    .use(router.routes())
    .use(router.allowedMethods())


console.log('Server running on port 8080')
app.listen(8080)
