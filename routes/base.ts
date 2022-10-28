import {Router} from "express";
import {CookieMakerApp} from "../index";
import {RestDecoratorInfo} from "../types/rest-decorator";

export class BaseRouter {

    public readonly router: Router = Router()

    constructor(
        protected cmapp: CookieMakerApp,
    ) {
        this.setUpRoutes();
    }

    setUpRoutes(): void {
        const ar: RestDecoratorInfo[] = Reflect.get(this, '_restApiCalls') ?? [];

        // for (const apiOp of ar) {
        //     this.router[apiOp.httpMethod](apiOp.path, (this as any)[apiOp.propertyName]);
        // }

        ar.forEach(apiOp => this.router[apiOp.httpMethod](apiOp.path,(...args) => (this as any)[apiOp.propertyName](...args)));

    }
}
