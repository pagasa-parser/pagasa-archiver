import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {FileMismatchError} from "../error/FileMismatchError";

export interface PAGASADocument {
    file: string,
    count: number,
    name: string,
    final?: boolean
}

interface ListOptions {
    /**
     * The index URL to use. Pass this parameter in cases where a proper index could not be
     * read or used, or if you wish to download from another site that mirrors the DOST-PAGASA's
     * pubfiles website.
     *
     * @example "https://pubfiles.pagasa.dost.gov.ph/tamss/weather/tca/"
     */
    indexURL?: string;
    /**
     * Whether to include unnamed storms. Unnamed storms will have names of "UNNAMED", and will
     * respectively be denoted in {@link CycloneNames} as cyclone 00 of the current year.
     */
    includeUnnamed?: boolean;
}

function cloneRegex(original: RegExp): RegExp {
    return new RegExp(original.source, original.flags);
}

export default class PagasaScraper {

    static readonly INDEX_URL_TCA =
        process.env.TCA_INDEX_URL ?? "https://pubfiles.pagasa.dost.gov.ph/tamss/weather/tca/";
    static readonly INDEX_URL_TCB =
        process.env.TCB_INDEX_URL ?? "https://pubfiles.pagasa.dost.gov.ph/tamss/weather/bulletin/";

    static async findLinks(url: string, config: AxiosRequestConfig = {}) : Promise<string[]> {
        const { data } = (await axios(Object.assign(config, { responseType: "text", url: url })));

        const links : string[] = [];

        const searchRegex = /a[^>]+href="(.+?)"/g;
        let foundData = null;
        while ((foundData = searchRegex.exec(data)) != null) {
            links.push(foundData[1]);
        }

        return links;
    }

    static async listTCAs(
        config: AxiosRequestConfig & ListOptions = {}
    ) : Promise<PAGASADocument[]> {
        const urlRegex = config.includeUnnamed ?
            /TCA%23(\d+)A?-?(F(?:INAL)?)?(?:(?:%20| |_)+(.+?))?\.pdf/gi :
            /TCA%23(\d+)A?-?(F(?:INAL)?)?(?:%20| |_)+(.+?)\.pdf/gi;
        const nameRegex = config.includeUnnamed ?
            /TCA#(\d+)A?-?(F(?:INAL)?)?(?:[ _]+(.+?))?\.pdf/gi :
            /TCA#(\d+)A?-?(F(?:INAL)?)?[ _]+(.+?)\.pdf/gi;

        return (await this.findLinks(config.indexURL || this.INDEX_URL_TCA, config))
            .filter(v => cloneRegex(urlRegex).test(v))
            .map(v => {
                const file = decodeURIComponent(v);
                const tcaParts = cloneRegex(nameRegex).exec(file);

                if (tcaParts == null) {
                    throw new FileMismatchError( v, file, tcaParts );
                }

                return {
                    file,
                    count: +tcaParts[1],
                    name: tcaParts[3] || (config.includeUnnamed ? "Unnamed" : undefined),
                    final: tcaParts[2] != null && tcaParts[2].startsWith("F")
                };
            });
    }

    static async listTCBs(
        config: AxiosRequestConfig & ListOptions = {}
    ) : Promise<PAGASADocument[]> {
        const urlRegex = config.includeUnnamed ?
            /TCB%23(\d+)A?-?(F(?:INAL)?)?(?:(?:%20| |_)+(.+?))?\.pdf/gi :
            /TCB%23(\d+)A?-?(F(?:INAL)?)?(?:%20| |_)+(.+?)\.pdf/gi;
        const nameRegex = config.includeUnnamed ?
            /TCB#(\d+)A?-?(F(?:INAL)?)?(?:[ _]+(.+?))?\.pdf/gi :
            /TCB#(\d+)A?-?(F(?:INAL)?)?[ _]+(.+?)\.pdf/gi;


        return (await this.findLinks(config.indexURL || this.INDEX_URL_TCB, config))
            .filter(v => cloneRegex(urlRegex).test(v))
            .map(v => {
                const file = decodeURIComponent(v);
                const tcbParts = cloneRegex(nameRegex).exec(file);

                if (tcbParts == null) {
                    throw new FileMismatchError( v, file, tcbParts );
                }

                return {
                    file,
                    count: +tcbParts[1],
                    name: tcbParts[3] || (config.includeUnnamed ? "Unnamed" : undefined),
                    final: tcbParts[2] != null && tcbParts[2].startsWith("F")
                };
            });
    }

    static async downloadTCA(
        tca: string, config: AxiosRequestConfig & { indexURL?: string }
    ) : Promise<AxiosResponse> {
        return axios(
            new URL(encodeURIComponent(tca), config.indexURL ?? this.INDEX_URL_TCA).toString(),
            config
        );
    }

    static async downloadTCB(
        tcb: string, config: AxiosRequestConfig & { indexURL?: string }
    ) : Promise<AxiosResponse> {
        return axios(
            new URL(encodeURIComponent(tcb), config.indexURL ?? this.INDEX_URL_TCB).toString(),
            config
        );
    }

}
