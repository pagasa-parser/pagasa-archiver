export class FileMismatchError extends Error {

    readonly name = "FileMismatchError";

    constructor( readonly url: string, readonly file: string, readonly match: RegExpMatchArray ) {
        super("File caught in URL RegExp but not in name RegExp.");
    }

    toString(): string {
        return `${this.name}: ${this.message}\n    URL: ${
            this.url
        }\nDecoded filename: ${
            this.file
        }\nMatch result: ${
            JSON.stringify(this.match)
        }`;
    }

}
