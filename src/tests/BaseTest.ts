import * as chai from "chai";
import * as chaiHttp from "chai-http";

import { server } from "../index";

export class BaseTest {

    public chai: any;
    public should: any;
    public route: string;
    public server: any;

    constructor() {
        this.server = server.getServerInstance();
        this.route = `/${process.env.API_VERSION}/`;
        this.chai = chai;
        this.chai.use(chaiHttp);
        this.should = chai.should();
    }
}
