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
            type: "count",
            alias: "verbose"
        }
    }).argv;

    const log = Logger.createLogger({
        name: "PAGASA Archiver",
        level: 30 - (argv.v * 10),
        stream: bunyanFormat({
            outputMode: "short",
            levelInString: true
        }, process.stdout)
    });

    log.info(`Starting PAGASA Archiver at ${ new Date().toUTCString() }...`);

    log.info("Downloading Tropical Cyclone Bulletins...");
    const TCBs = await PagasaScraper.listTCBs();
    for (const tcb of TCBs) {
        log.debug(`Found TCB: ${tcb.file}`);
        const advisoryCode = buildCode(tcb);

        if (fs.existsSync(path.join(process.cwd(), `${advisoryCode}.pdf`))) {
            log.debug(`File exists: ${advisoryCode}, skipping...`);
        } else {
            log.debug(`Downloading to ${advisoryCode}...`);
            const fileStream = fs.createWriteStream(`${advisoryCode}.pdf`);
            const downloadStream = await PagasaScraper.downloadTCB(tcb.file, {responseType: "stream"});
            downloadStream.data.pipe(fileStream);
            log.trace(`Finished downloading to ${advisoryCode}.`);
        }
    }

    log.info("Downloading Tropical Cyclone Advisories...");
    const TCAs = await PagasaScraper.listTCAs();
    for (const tca of TCAs) {
        log.debug(`Found TCA: ${tca.file}`);
        const advisoryCode = buildCode(tca, true);

        if (fs.existsSync(path.join(process.cwd(), `${advisoryCode}.pdf`))) {
            log.debug(`File exists: ${advisoryCode}, skipping...`);
        } else {
            log.debug(`Downloading to ${advisoryCode}...`);
            const fileStream = fs.createWriteStream(`${advisoryCode}.pdf`);
            const downloadStream = await PagasaScraper.downloadTCA(tca.file, {responseType: "stream"});
            downloadStream.data.pipe(fileStream);
            log.trace(`Finished downloading to ${advisoryCode}.`);
        }
    }

    log.info("Done.");

})();
