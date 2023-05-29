import express from "express";
import cors from 'cors';
import createError from 'http-errors';
import { ApiController } from "./controller/ApiController.js";
import { sequelize } from "./modules/database.js";

const app = express();

app.use(express.json())
app.use(cors({ origin: '*' }));

app.post('/api/v1/shorten', ApiController.generateHash);
app.get('/healthz', async (req, res, next) => {
    try {
        await sequelize.authenticate();
        return res.json({ status: "UP" });
    } catch (error) {
        return res.status(500).json({ status: "UP" });
    }
});
app.get('/:hash', ApiController.findURL);

// fallback route
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    return res.status(err.status ?? 500)
        .json({
            error: err.message
        });
});

app.listen(Number(process.env.APP_PORT ?? '3000'), '0.0.0.0', () => {
    console.log('Server listen onport', Number(process.env.APP_PORT ?? '3000'))
});