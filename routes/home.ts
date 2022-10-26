import {Request, Response, Router} from "express";
import {CookieMakerApp} from "../index";
import {MyRouter} from "../types/my-router";

export class HomeRouter implements MyRouter{
    public readonly urlPrefix: string = '/'
    public readonly router: Router = Router()

    constructor(public cmapp: CookieMakerApp,

    ) {
        this.setUpRoutes();
    }

    setUpRoutes(): void {
        this.router.get('/', this.home);
    }

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
