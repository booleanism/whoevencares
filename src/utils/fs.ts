import { open, readdir, mkdir, stat } from "fs/promises";
import { join } from "path";

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

    export async function readDir(dir: string, fileFormat: string): Promise<string[]> {
        // const order = 1
        // const files = await readdir(dir);
        // const stats = await Promise.all(
        // files.map((filename) =>
        //     stat(join(dir, filename))
        //         .then((stat) => ({ filename, mtime: stat.mtime }))
        //     )
        // );

        // return stats.sort((a, b) =>
        //     order * (b.mtime.getTime() - a.mtime.getTime())
        // ).map((stat) => stat.filename);
        const files = await readdir(dir)
        let htmlFiles = []
        for (const file of files) {
            if (file.endsWith(fileFormat)) {
                htmlFiles.push(file)
            }
        }
        return htmlFiles;
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