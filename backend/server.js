import app from './src/app.js'
import { config } from './src/config/config.js'
import connectToDb from './src/config/database.js'

connectToDb()


const PORT = config.PORT || 8000


app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})