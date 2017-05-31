/*
 * Description:依赖form.js多图上传插件   提示使用的artDialog，不引入请替换对应方法
 * 2016.09.18--five(673921852)
 */
(function ($) {
	var upload={
		init:function (opts, container) {
            var id = new Date().getTime(),
            	str='';
            if (!$.isArray(opts.displayImgSrc)&&opts.displayImgSrc.indexOf(',')>=0){
            	opts.displayImgSrc = opts.displayImgSrc.split(',');
            } else {
                opts.displayImgSrc = [opts.displayImgSrc];
            }
            if(opts.canDel){ //是否可删除
            	var str = '<div class="clearfix">';
            	for (var i = 0; i < opts.imagesCount; i++) {
            		var display = opts.displayImgSrc[i] || i == 0 ? '' : 'style="display:none"',
            			show=opts.displayImgSrc[i]?'':'style="display:none"',
            			hide=opts.displayImgSrc[i]?'style="display:none"':'';
            		if(opts.displayImgSrc!=''&&opts.displayImgSrc.length<opts.imagesCount && opts.displayImgSrc.length==i){
            			display='';
            		}
            		
	            	str+=' <div class="upload-img-box imageBox" '+display+'>'+
						'<img '+show+' src="' + (opts.displayImgSrc[i] ? opts.displayImgSrc[i] : '') + '" class="img-upload"/>'+
						'<span class="remove-img" '+show+'>删除</span>'+
						'<div class="img-upload-btn" '+hide+'>'+(opts.isMobile?'<i class="glyphicon glyphicon-camera"></i>':'+')+'</div>'+
		                '<input type="hidden" class="hiddenImgSrc" value="' + (opts.displayImgSrc[i] ? opts.displayImgSrc[i] : '') + '"  name="' + opts.imgFieldName + '" />'+
						'<input class="file uploadFilebtn" type="file" name="_file"   id="imgUploader_' + id + '_' + i + '"/>'+
		            '</div>';
	            }
            }else{
            	var str= '<div class="upload-img-box" >';
	            for (var i = 0; i < opts.imagesCount; i++) {
	                var display = opts.displayImgSrc[i] || i == 0 ? '' : ' style="display:none"';
	                str += ' <div '+display+' class="imageBox fl">'+
	                    '<input type="hidden" class="hiddenImgSrc"  value="' + (opts.displayImgSrc[i] ? opts.displayImgSrc[i] : '') + '"   name="' + opts.imgFieldName + '" />'+
	                    '<span class="glyphicon glyphicon-picture"></span>'+
	                	'<input class="file uploadFilebtn" type="file" name="_file"   id="imgUploader_' + id + '_' + i + '"/>'+
	  			    '</div>';
	            }
            }
            if(opts.imageDescript){
                str += '<p class="help-default fl">' + opts.imageDescript + '</p>';
            }
            str+='</div>';
            
            $(container).html(str);
		},
		checkImgType:function(filename) {
	        var str = filename.substring(filename.lastIndexOf("."), filename.length).toLowerCase();
	        if (!/\.(gif|jpg|jpeg|png|bmp)$/.test(str)) {
	            return false;
	        }
	        return true;
	    },
		uploadfile:function(target, opts) {
	        var imgUpFile = $('.uploadFilebtn',target), //上传控件
	        	imgHideFile = $('.hiddenImgSrc',target); //图片隐藏域。
	        if(imgUpFile.val()!= ""){
	        	if (!this.checkImgType(imgUpFile.val())) {
	                $.dialog.errorTips("上传格式为gif、jpeg、jpg、png、bmp");
	                imgUpFile.val('');
	                return;
	            }
            	if (imgUpFile[0].files[0].size/1024 > opts.maxSize*1024) {
                    $.dialog.errorTips("上传的图片不能超过" + opts.maxSize + "M");
                    imgUpFile.val('');
                    return;
                }
	        }else{
	        	return;
	        }
	
	        var myform=$('<form action="'+opts.url+'" method="post" enctype="multipart/form-data" style="display:none"></form>');
	        imgUpFile.appendTo(myform);
	        $('body').append(myform);
			
	        //开始模拟提交表当。
	        target.css('opacity','.6');
	        myform.ajaxSubmit({
	            success: function (data) {
	                if (data == "NoFile" || data == "Error" || data == "格式不正确！") {
	                    $.dialog.errorTips(data);
	                }else {
	                	imgHideFile.val(data);
	                	if(opts.canDel){
	                		$('img.img-upload',target).attr('src',data).show();
	                		$('.img-upload-btn', target).hide();
	                		$('.remove-img', target).show();
	                	}else{
	                		$('.glyphicon-picture',target).addClass('active');
	                	}
						
						target.css('opacity','1');
						if (opts.callback) {
						    opts.callback(data);
						}
						if (target.index()+1 < opts.imagesCount){
		                    target.next().show();
						}
	                }
	                target.append(imgUpFile);
	                myform.remove();
	            }
	        });
	    },
	    bindEvent:function(target, opts) {
	    	var self=this;
	        $('input.uploadFilebtn', target).change(function () {
	            self.uploadfile(target, opts);
	        });
	        
	        if(!opts.canDel){
		        $('.glyphicon-picture',target).each(function () {
		            var imSrc = $('.hiddenImgSrc',target);
		            if (imSrc.val() != '') {
		                $(this).addClass('active');
		            }
		            
		            //图片预览
		            $(this).mouseenter(function () {
		                var src = $('.hiddenImgSrc', target).val();
		                if (src != '') {
			                var position = $(this).offset(),
								scrollTop=$('body').scrollTop(),
								pos=(position.top - scrollTop>= 200),
			                	imgstr = '<div class="lg-view-img" style="'+(pos?'bottom':'top')+':20px"><img src="' + src + '?version=' + Math.random() + '"></div>';
		                    $(this).append(imgstr);
		                }
		            });
		            $(this).mouseleave(function () {
		            	$(this).html('');
		            });
		        });
	        }else{
	        	if (!opts.isMobile) {
	        		if ($('input.hiddenImgSrc', target).val() != ''){
	        			target.hover(function(){
	        				$('span.remove-img', $(this)).toggle();
	        			});
	        		}
		        }
	        	
	        	$('span.remove-img', target).click(function () {
					$('img.img-upload', target).attr('src', '').hide();
					$('div.img-upload-btn', target).show();
					$('input.hiddenImgSrc', target).val('');
					$('input.file', target).val('');
					$(this).hide();
				});
	        	
	        }
	    }
	},
	exportFn={
		getImgSrc:function(target){
	    	var images = $('input.hiddenImgSrc',target);
            if (images.length == 1){
            	return images.val();
            }else {
                var srcArr = [];
                images.each(function () {
                    var src = $(this).val();
                    if (src)
                        srcArr.push(src);
                });
                return srcArr;
            }
	    }
	};
	
    $.fn.himallUpload = function (options) {
        if (typeof options == 'string') {
        	return exportFn[options]($(this));
        }
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
	    },
        opts = $.extend({}, defaults, options || {});
        
        upload.init(opts,this);
        $('.imageBox',this).each(function () {
            upload.bindEvent($(this), opts);
        });
    };

})(jQuery);