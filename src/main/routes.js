const combineRouters = require('koa-combine-routers')
const blogRouter = require('./routes/blogs/blogRouter')

const router = combineRouters([
    blogRouter
])

module.exports = router
