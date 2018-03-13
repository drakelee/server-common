require('dotenv').config()

const Koa = require('koa')
const cors = require('koajs-cors')
const bodyParser = require('koa-bodyparser')
const router = require('./routes')

const {graphql, buildSchema} = require('graphql')
const app = new Koa()

let schema = buildSchema(`
    type Query {
        hello: String
    }
`)

let root = {hello: () => 'hello world!'}

// routes

app.use(cors({
    origin: ['http://localhost:3000']
}))

app.use(bodyParser())

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

app.use(router)

console.log('Server running on port 8080')
app.listen(8080)
