import {Request, Response} from 'express';
import {Base} from "../types/bases";
import {Addon} from "../types/addons";
import {MyRouter} from "../types/my-router";
import {BaseRouter} from "./base";
import {get} from "../decorators/rest-decorator";


export class ConfiguratorRouter extends BaseRouter implements MyRouter{
    public readonly urlPrefix: string = '/configurator'


    @get('/select-base/:baseName')
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
    @get('/add-addon/:addonName')
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
    @get('/delete-addon/:addonName')
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


