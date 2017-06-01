# himallUpload
支持移动端 pc端可以删除预览的多图上传jquery插件

插件依赖jquery.form.js模拟表单提交，适用于移动端、pc端，可删除、预览图片，可初始化原有图片，回调返回服务器图片地址，可限制图片大小、上传数量等，内含exportFn方法可扩展需要新增的方法；

参数配置如下

var defaults = {

    url: '/common/PublicOperation/UploadPic',  //图片提交api接口
    
    displayImgSrc: '',	//初始化图片，可为数组或逗号拼接字符串
    
    imageDescript: '',	//图片描述
    
    imgFieldName: 'icon', //input表单name
    
    imagesCount: 1,		//可上传数量
    
    maxSize:2,			//图片大小限制，单位M 
    
    callback:null,		//上传成功回调，返回服务器图片路径
    
    canDel:false,		//是否支持删除
    
    isMobile: false		//是否为移动端
    
}


插件简介实用，异步上传图片，如有需要可自行添加loading状态。
