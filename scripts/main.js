const { spawn } = require("child_process");
const http = require("https");
const fs = require("fs");
const { exec } = require("child_process");


console.info(`Starting programs...`);
const runningLoc = "./running/";
const optionsLoc =   runningLoc + "options.json";

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
    if (!fs.existsSync(runningLoc)) fs.mkdirSync(runningLoc);
    await downloadFile(optionsLoc, "https://raw.githubusercontent.com/izep/pi-signs/master/scripts/options.json");
    let optsStr = fs.readFileSync(optionsLoc);
    let opts = JSON.parse(optsStr);
    console.log(JSON.stringify(opts));
    let mediaPromises = [];
    opts.files.forEach(itm => {
        let dl = downloadFile(runningLoc + itm.name, itm.url);
        mediaPromises.push(dl);
    });
    mediaPromises.forEach(async itm => {
        await itm;
    });

    console.log(new Date());
    const player = exec(`omxplayer -o local --loop --orientation 270 --aspect-mode fill --no-osd ${runningLoc}${opts.files[0].name}`);
    await sleep(15000);
    player.kill();
    console.log(new Date());
}

main();