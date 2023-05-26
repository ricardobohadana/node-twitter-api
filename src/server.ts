import { app } from './app'
import { env } from './env'

app.listen(
  {
    host: env.HOST,
    port: env.PORT,
  },
  (err, address) => {
    if (!err) console.log('Server listening on', address)
    else throw err
  },
)
