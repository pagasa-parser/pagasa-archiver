import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import PagasaScraper from "./scraper/PagasaScraper";
import Logger from "bunyan";
import bunyanFormat from "bunyan-format";
import {buildCode} from "./data/CycloneNames";
import * as fs from "fs";
import path from "path";

(async () => {
    const argv = await yargs(hideBin(process.argv)).options({
        v: {
            description: "Verbosity. Used to generate more detailed log output.",
            type: "count",
            alias: ["verbose"]
        },
        q: {
            description: "Quiet mode. Overrides `v`, mutes all output (besides stdout, if using --json).",
            type: "boolean",
            alias: "quiet"
        },
        f: {
            description: "Forcefully overwrite files if a conflicting filename exists.",
            type: "boolean",
            alias: ["force"],
            default: false
        },
        u: {
            description: "Include bulletins/advisories with no names. This is commonly more used with TCAs, where a storm may not be named yet before entry into the PAR. Storms with unknown names are marked \"Unnamed\".",
            type: "boolean",
            alias: ["include-unnamed", "unnamed"],
            default: false
        },
        d: {
            description: "Whether to download bulletins and advisories or not.",
            type: "boolean",
            alias: ["download"],
            default: null,
            defaultDescription: "true"
        },
        tca: {
            description: "When enabled, only TCAs are processed, unless --tcb is also supplied.",
            type: "boolean",
            alias: ["tcas", "tcas-only"],
            default: null
        },
        tcb: {
            description: "When enabled, only TCBs are processed, unless --tca is also supplied.",
            type: "boolean",
            alias: ["tcbs", "tcbs-only"],
            default: null
        },
        index: {
            description: "The index URL to use. Use this when downloading from websites other than the DOST-PAGASA pubfiles website, or in automated scripts as a backup if the DOST-PAGASA pubfiles website is inaccessible. This sets the index for both TCAs and TCBs, use --index-tca and --index-tcb for more fine tuning.",
            type: "string",
        },
        "index-tca": {
            description: "The index URL to use for tropical cyclone advisories. See --index for more details.",
            type: "string"
        },
        "index-tcb": {
            description: "The index URL to use for tropical cyclone bulletins. See --index for more details.",
            type: "string"
        },
        json: {
            description: "Dump JSON of the available TCAs and/or TCBs (depending on --tca or --tcb) into stdout. Actual output is still logged through stderr.",
            type: "boolean"
        }
    }).argv;

    const log = Logger.createLogger({
        name: "PAGASA Archiver",
        level: argv.q ? Number.POSITIVE_INFINITY : Math.max(30 - (argv.v * 10), 0),
        stream: bunyanFormat({
            outputMode: "short",
            levelInString: true
        }, argv.json ? process.stderr : process.stdout)
    });

    log.trace( argv );

    log.info(`Starting PAGASA Archiver at ${ new Date().toUTCString() }...`);

    // Download by default
    const download = (argv.tca == null && argv.b == null) && argv.download !== false;

    if ((argv.tca === true || argv.tcb === true) && argv.download === false) {
        log.warn("--tca or --tcb was supplied but --download is false. File checking will be performed but no downloads will be performed.");
    }

    let TCAs, TCBs;
    if (download || !!argv.tcb) {
        log.info("Getting list of Tropical Cyclone Bulletins...");
        TCBs = await PagasaScraper.listTCBs({
            indexURL: argv["index-tcb"] ?? argv.index,
            includeUnnamed: argv.u
        });

        if (!argv.json) {
            for (const tcb of TCBs) {
                log.debug(`Found TCB: ${tcb.file}`);
                const advisoryCode = buildCode(tcb);

                if (argv.download === false) {
                    // Downloads are disabled. Skip.
                } else if (fs.existsSync(path.join(process.cwd(), `${advisoryCode}.pdf`)) && !argv.f) {
                    log.debug(`File exists: ${advisoryCode}, skipping...`);
                } else {
                    log.debug(`Downloading to ${advisoryCode}...`);
                    const fileStream = fs.createWriteStream(`${advisoryCode}.pdf`);
                    const downloadStream = await PagasaScraper.downloadTCB(tcb.file, {responseType: "stream"});
                    downloadStream.data.pipe(fileStream);
                    log.trace(`Finished downloading to ${advisoryCode}.`);
                }
            }
        }
    }

    if (download || !!argv.tca) {
        log.info("Getting list of Tropical Cyclone Advisories...");
        TCAs = await PagasaScraper.listTCAs({
            indexURL: argv["index-tca"] ?? argv.index,
            includeUnnamed: argv.u
        });

        if (!argv.json) {
            for (const tca of TCAs) {
                log.debug(`Found TCA: ${tca.file}`);
                const advisoryCode = buildCode(tca, true);

                if (argv.download === false) {
                    // Downloads are disabled. Skip.
                } else if (fs.existsSync(path.join(process.cwd(), `${advisoryCode}.pdf`)) && !argv.f) {
                    log.debug(`File exists: ${advisoryCode}, skipping...`);
                } else {
                    log.debug(`Downloading to ${advisoryCode}...`);
                    const fileStream = fs.createWriteStream(`${advisoryCode}.pdf`);
                    const downloadStream = await PagasaScraper.downloadTCA(tca.file, {responseType: "stream"});
                    downloadStream.data.pipe(fileStream);
                    log.trace(`Finished downloading to ${advisoryCode}.`);
                }
            }
        }
    }

    if (argv.json) {
        const out: Record<string, any> = {};
        if (argv.tcb !== false) {
            out.tcb = TCBs;
        }
        if (argv.tca !== false) {
            out.tca = TCAs;
        }
        process.stdout.write(JSON.stringify(out) + (process.stdout.isTTY ? "\n" : ""));
    }

    log.info("Done.");

})();
