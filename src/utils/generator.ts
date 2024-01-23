export namespace generator {
    export function genHref(title: string): string {
        return title.replace(/\s+/g, '-')
                    .replace(/[^a-zA-Z0-9\-_]/g, '')
                    .concat(".html").toLocaleLowerCase();
    }
}