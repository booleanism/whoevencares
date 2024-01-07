import { fs } from "../utils/fs";

export namespace config {
    export const file = "./wec.json";
    export type config = {
        mdDir: string,
        htmlDir: string
        template: {
            dir: string,
            index: string,
            article: string
        },
        url: string,
        blogsName: string,
        copyright: string,
        author: {
            name: string,
            email: string,
            link: string
        },
        blogDescription: string
    }
    export async function parse() : Promise<config> {
        return JSON.parse(await fs.read(file))
    }
}