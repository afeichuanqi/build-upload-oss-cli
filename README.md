# 安装
````
yarn add build-upload-oss-cli -D
npm install build-upload-oss-cli -D
````
# -cli
<u>**<u>作用：将打包后的文件上传到阿里云oss上</u>**</u>

1. 会自动在项目下搜索uploadOss.config.json文件 


1. The upload Oss.config.json file will be automatically searched under the project
2. Also supports filling in new plugin(config)

## uploadOss.config.json

```{
    "region": "",
    "accessKeyId": "",
    "accessKeySecret": "",
    "bucket": "",
    以上是oss上传必备
    The above is necessary for oss upload
    "bucketPath": "/build", 上传到阿里云哪个文件夹 **Which folder to upload to Alibaba Cloud**
    "enable": true 是否开启
}
```

## use
1. build-upload-oss upload 开始上传
2. build-upload-oss info 查看本地和远程的文件路径

## webpack-plugin
webpack-build-upload-alioss-plugin