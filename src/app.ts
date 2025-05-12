import { Pages } from "./pages/pages.js";
import { Config } from "./parser/config.js";

const config = new Config("./wec.json").parse();

const page = new Pages(await config).build();
page.withIndex();
page.render();
page.done();
