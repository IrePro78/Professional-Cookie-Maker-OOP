import {Request, Response} from "express";
import {MyRouter} from "../types/my-router";
import {get} from "../decorators/rest-decorator";
import {BaseRouter} from "./base";

export class HomeRouter extends BaseRouter implements MyRouter{
    public readonly urlPrefix: string = '/'


    @get('/')
    home = (req: Request, res: Response): void => {
        const {sum, addons, base, allBases, allAddons} = this.cmapp.getCookieSettings(req);

        res.render('home/index', {
            cookie: {
                base,
                addons,
            },
            allBases,
            allAddons,
            sum,
        });
    };
}
