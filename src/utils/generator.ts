export namespace generator {
    export function genHref(title: string): string {
        return title.replace("[^A-Za-z0-9]", "-").concat(".html").toLocaleLowerCase();
    }
}