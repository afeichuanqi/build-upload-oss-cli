var fs = require('fs');
var path = require('path');

function readFileList(dir, filesList = [], replace) {
    const files = fs.readdirSync(dir);
    files.forEach((item, index) => {
        var fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            readFileList(path.join(dir, item), filesList, replace); //递归读取文件
        } else {
            filesList.push(fullPath.replace(`${path.join(replace,'/')}`, ''));
        }
    });
    return filesList;
}
module.exports = readFileList;
