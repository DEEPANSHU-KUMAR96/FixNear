import mongoose from "mongoose";
import { config } from '../config/config.js'


const connectToDb = async () => {

    try {
        await mongoose.connect(config.MONGO_URI)
        console.log('database connected successfully')
    } catch (err) {
        console.log('database not connected', err)
    }
}

export default connectToDb;