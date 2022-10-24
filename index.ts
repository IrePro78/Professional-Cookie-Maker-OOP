const hbs = require('express-handlebars');
import {HomeRouter} from "./routes/home";
import {OrderRouter} from "./routes/order";
import * as express from "express";
import {Application, Request, Response} from 'express';
import {COOKIE_ADDONS, COOKIE_BASES} from "./data/cookies-data";
import {handlebarsHelpers} from "./utils/handlebars-helpers";
import cookieParser from "cookie-parser";
import {ConfiguratorRouter} from "./routes/configurator";


interface Cookie {
    COOKIE_ADDONS: {
        chocolate: number,
        sprinkles: number,
        honey: number,
        cranberries: number,
        coconut: number,
    },
        COOKIE_BASES: {
        light: number,
        dark: number,
    }
}


class CookieMakerApp {
    app: Application = express();
    data: Cookie;

    constructor() {
        this._loadData();
        this._configureApp();
        this._setRoutes();
        this._run();
    }

    _configureApp() {
        // this.app = express();
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(cookieParser());
        this.app.engine('.hbs', hbs({
            extname: '.hbs',
            helpers: handlebarsHelpers,
        }));
        this.app.set('view engine', '.hbs');
    }

    _setRoutes() {
        this.app.use('/', new HomeRouter(this).router);
        this.app.use('/configurator', new ConfiguratorRouter(this).router);
        this.app.use('/order', new OrderRouter(this).router);
    }

    _run() {
        this.app.listen(3000, '0.0.0.0', () => {
            console.log('Listening on :3000');
        });
    }

    showErrorPage(res: Response, description: string) {
        res.render('error', {
            description,
        });
    }

    getAddonsFromReq(req: Request) {
        const {cookieAddons} = req.cookies;
        return cookieAddons ? JSON.parse(cookieAddons) : [];
    }

    getCookieSettings(req: Request) {
        const {cookieBase: base} = req.cookies;

        const addons = this.getAddonsFromReq(req);

        const allBases = Object.entries(this.data.COOKIE_BASES);
        const allAddons = Object.entries(this.data.COOKIE_ADDONS);

        const sum = (base ? handlebarsHelpers.findPrice(allBases, base) : 0)
            + addons.reduce((prev: number, curr: number) => (
                prev + handlebarsHelpers.findPrice(allAddons, curr)
            ), 0);

        return {
            // Selected stuff
            addons,
            base,

            // Calculations
            sum,

            // All possibilities
            allBases,
            allAddons,
        };
    }

    _loadData() {
        this.data = {
            COOKIE_BASES,
            COOKIE_ADDONS,
        };
    }

}

new CookieMakerApp();
