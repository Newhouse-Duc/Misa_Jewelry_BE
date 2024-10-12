import express from 'express';
import configViewEngine from "./config/viewEngine";

import initapiRoute from './routes/api';
import initapiadminRoute from './routes/admin';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import connection from '../src/config/connectdb';
import configCors from "./config/cors";


dotenv.config();

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


const PORT = process.env.PORT || 8080;

configCors(app);

configViewEngine(app);
connection();


initapiRoute(app);
initapiadminRoute(app);
console.log(process.env.PORT);

app.use((req, res) => {
    return res.send("404 not found")
})


app.listen(PORT, () => {

    console.log("back end node js is running " + PORT);
});