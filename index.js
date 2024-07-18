import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import SequelizeStore from "connect-session-sequelize";
import db from "./config/database.js";
import UserRoute from "./routes/UserRoute.js";
import ProductRoute from "./routes/ProductRoute.js";
import AuthRoute from "./routes/AuthRoute.js";
import CSRFRoute from "./routes/CSRFRoute.js";

dotenv.config()

const app = express();

const seesionStore = SequelizeStore(session.Store);

const store = new seesionStore({
    db: db
});

// (async () => {
//     await db.sync();
// })();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

app.use(express.json())

app.use(UserRoute);
app.use(ProductRoute);
app.use(AuthRoute);
app.use(CSRFRoute);

// store.sync();

app.listen(process.env.PORT, () => {
    console.log("Server up and running")
})