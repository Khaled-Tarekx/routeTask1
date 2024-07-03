import 'dotenv/config'
import express from 'express'
import UserRouter from './src/modules/users/routers.js'
import PostRouter from './src/modules/posts/routers.js'
import CommentRouter from './src/modules/comments/routers.js'
import AuthRouter from './src/modules/auth/routers.js'

const app = express()
const port = 3000


app.get('/', (req,
              res) => res.send('Hello World!'))

app.use(express.json())
app.use('/auth', AuthRouter)
app.use('/api/users', UserRouter)
app.use('/api/posts', PostRouter)
app.use('/api/comments', CommentRouter)

app.use('*', (req,
              res) => res.json('Page Not Found'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))