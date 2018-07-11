const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");

console.info(`Starting programs...`);
const optionsLoc = "../running/options.json";
const mediaLoc = "../running/media/";

const sleep = function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const downloadSettings = function () {
    return new Promise((resolve) => {
        let file = fs.createWriteStream(optionsLoc);
        var request = http.get("http://raw.githubusercontent.com/izep/pi-signs/master/scripts/options.json", function (response) {
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

const downloadMedia = function (name, location) {
    file = fs.createWriteStream(videoFile);
    var request = http.get(
        "http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg",
        function (response) {
            response.pipe(file);
            file.on("error", function (err) {
                fs.unlink(dest);
            });
        }
    );

}


async function main() {
    await downloadSettings();
    let optsStr = fs.readFileSync(optionsLoc);
    let opts = JSON.parse(optsStr);
    console.log(optsStr);
}

main();