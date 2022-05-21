const path = require('path');
const OSS = require('ali-oss');
const Async = require('async');
const ProgressBar = require('./ProgressBar')
const ReadFileList = require("./ReadFileList");
const projectDir = path.join(__dirname, '../../../');

class UploadOssUtil {
    ossConfig = {
        accessKeyId: "",
        accessKeySecret: "",
        bucket: "",
        region: "",
        bucketPath: '',
        enable: true,
        buildPath: '/build',
    }
    constructor(config) {
        if (config) {
            this.ossConfig = config;
            return ;
        }
        let _config = null;
        try {
            _config = require(`${projectDir}uploadOss.config.js`);
        } catch (err) {
            console.log(`${path.resolve(projectDir, 'uploadOss.config')}路径可能没有找到`)
        }
        this.ossConfig = Object.assign(this.ossConfig,_config);
        this.run()
        // fs.readFile(path.resolve('uploadOss.config.json'), 'utf8', (err, data) => {
        //     if (err) {
        //         this.ossConfig = null;
        //         return;
        //     }
        // })
    }

    run () {
        const _this = this;
        if (!this.ossConfig || !this.ossConfig.enable) {
            return ;
        }
        const outputPath = path.join(projectDir, this.ossConfig.buildPath);
        const client = new OSS(this.ossConfig);
        const headers = [{
            allowedOrigin: '*',
            allowedMethod: 'GET',
            allowedHeader: '*',
            exposeHeader: 'Content-Length',
            maxAgeSeconds: '3600',

        }];
        const promises = [];
        let files = [];
        try {
            ReadFileList(outputPath, files, outputPath);
        } catch (err) {
            console.log(`${outputPath}文件夹好像不存在哦~ 是否忘记生成了`);
            return ;
        }
        const pb = new ProgressBar('上传进度', 50);
        let num = 0, total = files.length;
        for (const filePathName of files) {
            promises.push(async function () {
                const result = await client.put(`${_this.ossConfig.bucketPath}${filePathName}`, path.normalize(`${outputPath}/${filePathName}`), {
                    headers: {
                        "x-oss-object-acl": "public-read-write",
                        ...headers
                    }
                });
                if (result && result.url) {
                    num++;
                    if (num <= total) {
                        // 更新进度条
                        pb.render({ completed: num, total, info: result.url });

                    }
                }
                return (result && result.url) || ''
            })
        }

        Async.eachSeries(promises, async function (item) {
            await item();
        }, function () {
            console.log('\n全部文件上传完毕')
        });
    }
}
module.exports = UploadOssUtil;
