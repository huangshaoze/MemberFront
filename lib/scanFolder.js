'user strict'

var fs = require('fs');
var path = require('path');

module.exports = scanFolder;

function scanFolder(src) {
    var fileList = [],
        folderList = [],
        walk = function (src, fileList, folderList) {
            files = fs.readdirSync(src);
            files.forEach(function (item) {
                var tmpPath = path.join(src, item);
                stats = fs.statSync(tmpPath);
                
                if (stats.isDirectory()) {
                    walk(tmpPath, fileList, folderList);
                    folderList.push(tmpPath);
                } else {
                    fileList.push(tmpPath);
                }
            });
        };
    
    walk(src, fileList, folderList);
    
    console.log('扫描' + src + '成功');
    
    return {
        'files': fileList,
        'folders': folderList
    }
}