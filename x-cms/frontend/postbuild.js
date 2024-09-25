/* eslint-env es6 */
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const dirName = `./dist/ams-cms`;

// find the styles css file
const files = getFilesFromPath(dirName, '.css');
let data = [];

if (!files && files.length <= 0) {
    console.log("cannot find style files to purge");
    process.exit();
}

for (let f of files) {
    // get original file size
    const originalSize = getFilesizeInKiloBytes(dirName + '/' + f) + "kb";
    var o = { "file": f, "originalSize": originalSize, "newSize": "" };
    data.push(o);
}

console.log("Run PurgeCSS...");

exec(`purgecss -css ${dirName}/*.css --content ${dirName}/index.html ${dirName}/*.js -o ${dirName}/`, function (error, stdout, stderr) {
    if (error) {
        console.error(error, stderr);
        process.exit();
    }
    console.log("PurgeCSS done");

    for (let d of data) {
        // get new file size
        const newSize = getFilesizeInKiloBytes(dirName + '/' + d.file) + "kb";
        d.newSize = newSize;
    }

    console.table(data);
});

function getFilesizeInKiloBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size / 1024;
    return fileSizeInBytes.toFixed(3);
}

function getFilesFromPath(dir, extension) {
    if (!fs.existsSync(dir)) {
        console.error('Dir not exist');
        process.exit();
    }
    let files = fs.readdirSync(dir);
    return files.filter(e => path.extname(e).toLowerCase() === extension);
}
