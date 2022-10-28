import {Request, Response} from 'express';
import {MyRouter} from "../types/my-router";
import {get} from "../decorators/rest-decorator";
import {BaseRouter} from "./base";

export class OrderRouter extends BaseRouter implements MyRouter{
    public readonly urlPrefix: string = '/order';

    @get('/summary')
    private sumary = (req: Request, res: Response): void => {
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
    @get('/thanks')
    private thanks = (req: Request, res:Response): void => {
        const {sum} = this.cmapp.getCookieSettings(req);

        res
            .clearCookie('cookieBase')
            .clearCookie('cookieAddons')
            .render('order/thanks', {
                sum,
            });
    }
}
