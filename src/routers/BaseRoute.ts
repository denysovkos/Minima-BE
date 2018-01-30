import { Router } from "express";
import * as winston from "winston";

import { guard } from "../middleware/guard";

export abstract class BaseRoute {

    private readonly _registeredMethodEnding = "Action";
    public router: Router;
    public logger: any;
    public guard: any;
    public currentUser: any;

    constructor() {
        this.guard = guard;
        this.logger = winston;
        this.onInit();
        this.router = Router();
        this.initRoutes();
    }

    public getRoutes(): Router {
        return this.router;
    }

    public getRouterMethodNames(obj): Set<string> {
        const methods = new Set();
        while (obj = Reflect.getPrototypeOf(obj)) {
            const keys = Reflect.ownKeys(obj);
            keys.forEach((k) => {
                if (k.toString().indexOf(this._registeredMethodEnding,
                        (k.toString().length - this._registeredMethodEnding.length)) !== -1) {
                    methods.add(k);
                }
            });
        }
        return methods;
    }

    protected onInit(): void {}

    private initRoutes(): void {
        const methods = this.getRouterMethodNames(this);
        [...methods].map((method) => {
            this[method](this.router);
        });
    }
}
