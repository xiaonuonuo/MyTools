/**
 * Created by CC on 2017/7/20.
 */

jQuery.extend({
    upyunUpload: function(fileObject,callback) {
        if (!fileObject[0].files[0]) return false;
        var id = new Date().getTime();
        fileObject.parent().prepend('<div class="upload-loading" id="loader'+id+'"></div>');
        var data={};
        //bucket可选static(测试),image(正式)
        $.ajax({
            url: 'https://plugin.vipbcw.com/?m=site&c=upyun&a=getUpyunSign&t=',
            type: "GET",
            dataType: "jsonp",
            success:function(serverData){
                var formData = new FormData();
                formData.append('policy',serverData.policy);
                formData.append('signature',serverData.sign);
                formData.append('file',fileObject[0].files[0]);
                $.ajax({
                    url : serverData.action,
                    type : 'POST',
                    data : formData,
                    processData : false,
                    contentType : false,
                    xhr: function(){
                        _xhr = $.ajaxSettings.xhr();
                        if(_xhr.upload){
                            $('#loader'+id+'').append('<progress></progress>');
                            _xhr.upload.addEventListener('progress',function(e) {
                                if (e.lengthComputable) {
                                    $('#loader'+id+' progress').attr({value : e.loaded, max : e.total}); //更新数据到进度条
                                    var percent = e.loaded/e.total*100;
                                    //console.log(percent);
                                    //$('#loader'+id+'').html(e.loaded + "/" + e.total+" bytes. " + percent.toFixed(2) + "%");
                                    //$('#loader'+id+'').html(percent.toFixed(0) + "%");
                                }
                            }, false);
                        }
                        return _xhr;
                    },
                    success : function(response) {
                        $('#loader'+id).remove();
                        var obj = $.parseJSON(response);
                        data={'status':'1','msg':'图片成功上传到又拍云','url':serverData.url+obj.url};
                        callback && callback.call(this,data);
                    },
                    error : function(response) {
                        $('#loader'+id).hide();
                        data={'status':'-1','msg':'失败：'+JSON.stringify(response)}
                        callback && callback.call(this,data);
                    }
                });
            },
            error:function(error){
                alert(error);
            }
        });
    },
    qiniuUpload: function(fileObject,callback) {
        if (!fileObject[0].files[0]) return false;
        var id = new Date().getTime();
        fileObject.parent().prepend('<div class="upload-loading" id="loader'+id+'"></div>');
        var data={};
        //bucket可选test(测试),app(正式),picture(正式)
        $.ajax({
            url: 'https://plugin.vipbcw.com/?m=site&c=qiniu&a=getQiniuToken&t=',
            type: "GET",
            dataType: "jsonp",
            success:function(serverData){
                var formData = new FormData();
                formData.append('key',serverData.key);
                formData.append('token',serverData.token);
                formData.append('file',fileObject[0].files[0]);
                var _action = serverData.action.replace("http", "https");
                $.ajax({
                    url : serverData.action,
                    type : 'POST',
                    data : formData,
                    processData : false,
                    contentType : false,
                    xhr: function(){
                        _xhr = $.ajaxSettings.xhr();
                        if(_xhr.upload){
                            $('#loader'+id+'').append('<progress></progress>');
                            _xhr.upload.addEventListener('progress',function(e) {
                                if (e.lengthComputable) {
                                    $('#loader'+id+' progress').attr({value : e.loaded, max : e.total}); //更新数据到进度条
                                    var percent = e.loaded/e.total*100;
                                    //console.log(percent);
                                    //$('#loader'+id+'').html(e.loaded + "/" + e.total+" bytes. " + percent.toFixed(2) + "%");
                                    //$('#loader'+id+'').html(percent.toFixed(0) + "%");
                                }
                            }, false);
                        }
                        return _xhr;
                    },
                    success : function(response) {
                        $('#loader'+id).remove();
                        var obj = response;
                        data={'status':'1','msg':'图片成功上传到七牛','url':serverData.url+obj.key};
                        callback && callback.call(this,data);
                    },
                    error : function(response) {
                        $('#loader'+id).remove();
                        //data={'status':'-1','msg':'失败：'+JSON.stringify(response)}
                        data={'status':'-1','msg':'图片上传失败'};
                        callback && callback.call(this,data);
                    }
                });
            },
            error:function(error){
                alert(error);
            }
        });
    },
});
