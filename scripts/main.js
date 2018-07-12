const { spawn } = require("child_process");
const http = require("https");
const fs = require("fs");
const { exec } = require("child_process");


console.info(`Starting programs...`);
const optionsLoc = "../running/options.json";
const mediaLoc = "../running/media/";

const sleep = function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const downloadFile = function (path, url) {
    return new Promise((resolve) => {
        let file = fs.createWriteStream(path);
        var request = http.get(url, function (response) {
            response.pipe(file);
            file.on('error', function (err) {
                console.error(err);
                fs.unlink(dest);
                resolve();
            });
            file.on('close', () => {
                resolve();
            })
        });
    });
}

async function main() {
    await downloadFile(optionsLoc, "https://raw.githubusercontent.com/izep/pi-signs/master/scripts/options.json");
    let optsStr = fs.readFileSync(optionsLoc);
    let opts = JSON.parse(optsStr);
    console.log(JSON.stringify(opts));
    let mediaPromises = [];
    opts.files.forEach(itm => {
        let dl = downloadFile(mediaLoc + itm.name, itm.url);
        mediaPromises.push(dl);
    });
    mediaPromises.forEach(async itm => {
        await itm;
    });

    exec(`omxplayer -o local --loop --orientation 270  ${mediaLoc}${opts[0].name}`);

    console.log('exiting.');
}

main();