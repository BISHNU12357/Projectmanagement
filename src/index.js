import app from "./app.js"
import dotenv from "dotenv"
import dbConnect from "./db/mongo.db.js"

dotenv.config( {
    path: "./.env",
} )

dbConnect()
    .then( () => {
        app.listen( process.env.PORT, () =>
            console.log( `server is listening on ${ process.env.PORT }` ) )
    } )
    .catch( ( error ) => console.log( `mongodb connnection error ${ error }` ) )

