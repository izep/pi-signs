const { spawn } = require("child_process");
const http = require("https");
const fs = require("fs");
const { exec } = require("child_process");
const omx = require("omx-layers");

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
    let layers = [];
    // const player0 = exec(`omxplayer -o local --loop --orientation 270 --aspect-mode fill --no-osd ${runningLoc}${opts.files[0].name}`);
    // const player1 = exec(`omxplayer -o local --loop --aspect-mode fill --no-osd ${runningLoc}${opts.files[1].name}`);
    // const player2 = exec(`omxplayer -o local --loop --aspect-mode fill --no-osd ${runningLoc}${opts.files[2].name}`);
    for (var i = 0; i < opts.files.length; i++) {
        layers.push(
            new omx({
                audioOutput: 'local',
                blackBackground: i === 0,
                disableKeys: true,
                disableOnScreenDisplay: true,
                layer: i+1,
                
            })
        );
        layers[i].open(opts.files[i].name, { loop: true, orientation: i === 0 ? 270 : 0 });
    }
    await sleep(15000);
    //player.kill();
    console.log(new Date());
}

main();
