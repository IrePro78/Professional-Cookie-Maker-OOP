import {Request, Response, Router} from 'express';
import {CookieMakerApp} from "../index";
import {Base} from "../types/bases";
import {Addon} from "../types/addons";
import {MyRouter} from "../types/my-router";


export class ConfiguratorRouter implements MyRouter{
    public readonly urlPrefix: string = '/configurator'
    public readonly router: Router = Router();

    constructor(private cmapp: CookieMakerApp) {
        this.setUpRoutes();
    }


    private setUpRoutes(): void {
        this.router.get('/select-base/:baseName', this.selectBase);
        this.router.get('/add-addon/:addonName', this.addAddon);
        this.router.get('/delete-addon/:addonName', this.deleteAddon);
    }

    private selectBase = (req: Request, res: Response): undefined | void => {
        const {baseName} = req.params as {
            baseName: Base;
        }
        if (!this.cmapp.data.COOKIE_BASES[baseName]) {
            return this.cmapp.showErrorPage(res, `There is no such base as ${baseName}.`);
        }

        res
            .cookie('cookieBase', baseName)
            .render('configurator/base-selected', {
                baseName,
            });
    };

    private addAddon = (req: Request, res: Response): undefined | void => {
        const {addonName} = req.params as {
            addonName: Addon;
        }

        if (!this.cmapp.data.COOKIE_ADDONS[addonName]) {
            return this.cmapp.showErrorPage(res, `There is no such addon as ${addonName}.`);
        }

        const addons = this.cmapp.getAddonsFromReq(req);

        if (addons.includes(addonName)) {
            return this.cmapp.showErrorPage(res, `${addonName} is already on your cookie. You cannot add it twice.`);
        }

        addons.push(addonName);

        res
            .cookie('cookieAddons', JSON.stringify(addons))
            .render('configurator/added', {
                addonName,
            });
    };

    private deleteAddon = (req: Request, res: Response): undefined | void => {
        const {addonName} = req.params as {
            addonName: Addon;
        }

        const oldAddons = this.cmapp.getAddonsFromReq(req);

        if (!oldAddons.includes(addonName)) {
            return this.cmapp.showErrorPage(res, `Cannot delete something that isn't already added to the cookie. ${addonName} not found on cookie.`);
        }

        const addons = oldAddons.filter((addon: string) => addon !== addonName);

        res
            .cookie('cookieAddons', JSON.stringify(addons))
            .render('configurator/deleted', {
                addonName,
            });
    };
}


