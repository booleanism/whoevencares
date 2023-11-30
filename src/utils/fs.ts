import { open, readdir, mkdir } from "fs/promises";

export namespace fs {
    export function write(path: string, data: string): void {
        open(path, 'w+').then((fh) => {
            fh.writeFile(data).catch((reason) => {
                throw reason;
            }).finally(() => {
                fh.close();
            });
        }).catch((reason) => {
            throw reason;
        });
    }

    export async function read(path: string): Promise<string> {
        const fh = await open(path);
        const content = fh.readFile({encoding: 'utf-8'});
        fh.close()
        return content
    }

    export async function readDir(dir: string): Promise<string[]> {
        const files = await readdir(dir)
        return files;
    }

    export function createDir(path: string, callback?: (newPath: string | undefined | null, err: any) => void): void {
        mkdir(path, {recursive: true}).then((pathCreated) => {
            if (callback) {
                callback(pathCreated, null);
            }
        }).catch((reason) => {
            if (callback) {
                callback(null, reason);
            }
        });
    }
}