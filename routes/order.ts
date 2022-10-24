import * as express from "express";
import {Request, Response} from 'express';

export class OrderRouter {
    router = express.Router()

    constructor(public cmapp: any,
    ) {
        this.setUpRoutes();
    }

    setUpRoutes() {
        this.router.get('/summary', this.sumary);
        this.router.get('/thanks', this.thanks);
    }

    sumary = (req: Request, res: Response) => {
        const {sum, addons, base, allBases, allAddons} = this.cmapp.getCookieSettings(req);

        res.render('order/summary', {
            cookie: {
                base,
                addons,
            },
            allBases,
            allAddons,
            sum,
        });
    };

    thanks = (req: Request, res:Response) => {
        const {sum} = this.cmapp.getCookieSettings(req);

        res
            .clearCookie('cookieBase')
            .clearCookie('cookieAddons')
            .render('order/thanks', {
                sum,
            });
    }
}
