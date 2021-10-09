import axios from "axios";
import * as Stream from "stream";

interface PAGASADocument {
    file: string,
    count: number,
    name: string,
    final?: boolean
}

export default class PagasaScraper {

    static readonly INDEX_URL_TCA = "https://pubfiles.pagasa.dost.gov.ph/tamss/weather/tca/";
    static readonly INDEX_URL_TCB = "https://pubfiles.pagasa.dost.gov.ph/tamss/weather/bulletin/";

    static async findLinks(url: string) : Promise<string[]> {
        const { data } = (await axios(url, { responseType: "text" }));

        const links : string[] = [];

        const searchRegex = /a[^>]+href="(.+?)"/g;
        let foundData = null;
        while ((foundData = searchRegex.exec(data)) != null) {
            links.push(foundData[1]);
        }

        return links;
    }

    static async listTCAs() : Promise<PAGASADocument[]> {
        return (await this.findLinks(this.INDEX_URL_TCA))
            .filter(v => /TCA%23(\d+)-?(F(?:INAL)?)?_(.+?)\.pdf/gi.test(v))
            .map(v => {
                const file = decodeURIComponent(v);
                const tcaParts = /TCA#(\d+)-?(F(?:INAL)?)?_(.+?)\.pdf/gi.exec(file);
                return {
                    file,
                    count: +tcaParts[1],
                    name: tcaParts[3],
                    final: tcaParts[2] != null && tcaParts[2].startsWith("F")
                }
            });
    }

    static async listTCBs() : Promise<PAGASADocument[]> {
        return (await this.findLinks(this.INDEX_URL_TCB))
            .filter(v => /TCB%23(\d+)-?(F(?:INAL)?)?_(.+?)\.pdf/gi.test(v))
            .map(v => {
                const file = decodeURIComponent(v);
                const tcbParts = /TCB#(\d+)-?(F(?:INAL)?)?_(.+?)\.pdf/gi.exec(file);
                return {
                    file,
                    count: +tcbParts[1],
                    name: tcbParts[3],
                    final: tcbParts[2] != null && tcbParts[2].startsWith("F")
                }
            });
    }

    static async downloadTCA(tca: string) : Promise<Stream> {
        return axios(
            new URL(encodeURIComponent(tca), this.INDEX_URL_TCA).toString(),
            { responseType: "stream" }
        )
            .then(r => r.data);
    }

    static async downloadTCB(tcb: string) : Promise<Stream> {
        return axios(
            new URL(encodeURIComponent(tcb), this.INDEX_URL_TCB).toString(),
            { responseType: "stream" }
        )
            .then(r => r.data);
    }

}