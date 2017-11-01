const Koa = require('koa')
const { graphql, buildSchema } = require('graphql')
const app = new Koa()

let schema = buildSchema(`
    type Query {
        hello: String
    }
`)

let root = {hello: () => 'hello world!'}

app.use(async ctx => {
    let response = await graphql(schema, '{hello}', root)

    ctx.body = response
})

app.listen(3000)