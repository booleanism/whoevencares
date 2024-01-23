import { frontmatter } from "../frontmatter.js";

export namespace sorting {
    export async function date(idxItems: frontmatter.attr[]) {
        idxItems.sort((a, b) => {
            return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
        });
    }
}