/**
 * Created by CC on 2017/7/20.
 */

var current_iframe = $('#main-frame');



//文本框只能输入数字，并屏蔽输入法和粘贴
$.fn.utilSetNumber = function() {
    $(this).css("ime-mode", "disabled");
    this.bind("keypress", function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);  //兼容火狐 IE
        if (!$.browser.msie && (e.keyCode == 0x8)) {    //火狐下不能使用退格键
            return;
        }
        return code >= 48 && code <= 57 || code == 46;
        ;
    });
    this.bind("blur", function() {
        if (this.value.lastIndexOf(".") == (this.value.length - 1)) {
            this.value = this.value.substr(0, this.value.length - 1);
        } else if (isNaN(this.value)) {
            this.value = "";
        }
    });
    this.bind("paste", function() {
        var s = clipboardData.getData('text');
        if (!/\D/.test(s))
            ;
        value = s.replace(/\D/, '');
        return false;
    });
    this.bind("dragenter", function() {
        return false;
    });
    this.bind("keyup", function() {
        this.value = this.value.replace(/[^\d.]/g, "");
        //必须保证第一个为数字而不是.
        this.value = this.value.replace(/^\./g, "");
        //保证只有出现一个.而没有多个.
        this.value = this.value.replace(/\.{2,}/g, ".");
        //保证.只出现一次，而不能出现两次以上
        this.value = this.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    });
}

/*
 * 表单校验 utilValidateForm
 * <form name="" class=validate-form">
 * <input type="text" name="" id="name"><span class="tip-validate" data-target="" data-rule="" data-function="function name"></span>
 * </form>
 * 在tip-validate中设置属性data-target(验证的目标ID，可以多个目标，使用|间隔或&间隔)
 * 设置data-rule，使用内置的方法来判断，默认为empty，如果多个rule可以使用，隔开，将按照顺序进行验证，内置rule有
 * mobile 验证手机     email 验证邮箱 number 只能输入数字   empty 验证是否为空  length|0|5 判断字符数 第一个数字是最小字符数，第二个数字是最多字符数
 * 当data-target有多个值且dat-rule不为empty，则所有的data-target校验全部使用data-rule去校验
 * 设置compare-with,与其值做比较。data-target只能为单一值
 * 设置data-function，使用单独的函数来判断，无需指定target。通常用于判断条件复杂，需要另外写函数来判断，只需写函数名称，不需要带();
 * data-function示例
 * var functionName=function(){
 * 	if (){
 * 		return '错误信息提示';
 * 	}else{
 * 		return true;
 * 	}
 * }
 */
$.fn.utilValidateForm = function() {
    var obj_form = $(this);
    var errors = 0;
    if (obj_form.find('.tip-validate').size() > 0) {
        $.each(obj_form.find('.tip-validate'), function(i, o) {
            var error = 0, message, target_array = [], target_type = 0;
            var obj_target = $(o).attr('data-target'),
                validate_rule = $(o).attr('data-rule'),
                compare_with = $(o).attr('compare-with'),
                validate_function = $(o).attr('data-function');

            if (obj_target.indexOf('|') != -1) {
                target_array = obj_target.split('|');
                target_type = 1;
            } else if (obj_target.indexOf('&') != -1) {
                target_array = obj_target.split('&');
                target_type = 2;
            } else {

                target_array.push(obj_target);
                target_type = 0;
            }

            if (validate_rule == undefined && validate_function == undefined) {
                validate_rule = 'empty';
            }
            if (validate_rule == 'empty') {
                $.each(target_array, function(ii, oo) {
                    if ($('#' + oo).size() > 0 && $('#' + oo).val() == '') {
                        error++;
                    }
                });
                message = '该项不能为空，请正确输入';
            }
            if (validate_rule == 'mobile') {
                $.each(target_array, function(ii, oo) {
                    if ($('#' + oo).size() > 0 && !$('#' + oo).utilValidateMobile()) {
                        error++;
                    }
                });
                message = '格式不正确，请输入正确手机号码';
            }
            if (validate_rule == 'email') {
                $.each(target_array, function(ii, oo) {
                    if ($('#' + oo).size() > 0 && !$('#' + oo).utilValidateEmail()) {
                        error++;
                    }
                });
                message = '格式不正确，请输入正确邮箱地址';
            }
            if (validate_rule == 'sixDigit') {
                $.each(target_array, function(ii, oo) {
                    if ($('#' + oo).size() > 0 && $('#' + oo).val().length < 6) {
                        error++;
                    }
                });
                message = '密码位数不能少于六位';
            }

            if (typeof validate_rule=='string' && validate_rule.indexOf('maxlength') > -1) {
                var data_target = $(o).attr('data-target');
                var length = $("#cou_name").val().length;
                var maxlength = $(o).attr("data-rule").split(":")[1];
                if(length>maxlength){
                    message = '输入的长度小于'+maxlength+'字符';
                    error++;
                }
            }

            if (typeof validate_rule=='string' && validate_rule.indexOf('minlength') > -1) {
                var data_target = $(o).attr('data-target');
                var length = $("#cou_name").val().length;
                var minlength = $(o).attr("data-rule").split(":")[1];
                if(length<minlength){
                    message = '输入的长度大于'+minlength+'字符';
                    error++;
                }

            }

            if (compare_with) {
                if ($('#' + obj_target).val() != $('#' + compare_with).val()) {
                    error++;
                    message = "两次输入的值不一致";
                }
            }

            if (validate_function) {//判断是否存在自定义判断函数
                try {
                    if (typeof (eval(validate_function)) == "function") {
                        if (eval(validate_function + '()') != true) {
                            error++;
                            message = eval(validate_function + '()');
                        }
                    }
                    ;
                } catch (e) {
                    alert('不存在' + validate_function + '这个函数');
                    return false;
                }
            }


            if (error > 0) {
                errors++;
                $(o).show().html(message);
            } else {
                $(o).hide();
            }
        });

        if (errors > 0) {
            return false;
        } else {
            return true;
        }
    } else {
        return true;
    }
}

/* 检测手机号
 * 用法
 * <input type="text" name="mobile" class="mobile" />
 * $('.mobile').utilValidateMobile();
 */

$.fn.utilValidateMobile = function() {
    $(this).css("ime-mode", "disabled");
    //var re_mobile = /^[1][3456789]\d{9}$/;
    var re_mobile = /0?(13|14|15|18)[0-9]{9}/;
    if (re_mobile.test($(this).val())) {
        return true;
    } else {
        return false;
    }
}

/* 检测邮箱
 * 用法
 * <input type="text" name="email" class="email" />
 * $('.email').utilValidateEmail();
 */
$.fn.utilValidateEmail = function() {
    $(this).css("ime-mode", "disabled");
    var re_email = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (re_email.test($(this).val())) {
        return true;
    } else {
        return false;
    }
}
$.utilFormatCurrency = function(num) {
    if (!isNaN(num)) {
        num = num.toString().replace(/\$|\,/g, '');
        if (isNaN(num))
            num = "0";
        sign = (num == (num = Math.abs(num)));
        num = Math.floor(num * 100 + 0.50000000001);
        cents = num % 100;
        num = Math.floor(num / 100).toString();
        if (cents < 10)
            cents = "0" + cents;
        for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
            num = num.substring(0, num.length - (4 * i + 3)) + ',' +
                num.substring(num.length - (4 * i + 3));
        return (((sign) ? '' : '-') + num + '.' + cents);
    }
}
$.fn.utilTransAmountToCN = function(num) {
    for (i = num.length - 1; i >= 0; i--) {
        num = num.replace(",", "");
        num = num.replace(" ", "");
    }
    num = num.replace("￥", "");
    if (isNaN(num)) {
        alert("请检查小写金额是否正确");
        return;
    }
    part = String(num).split(".");
    newchar = "";
    for (i = part[0].length - 1; i >= 0; i--) {
        if (part[0].length > 10) {
            alert("位数过大，无法计算");
            return "";
        }
        tmpnewchar = "";
        perchar = part[0].charAt(i);
        switch (perchar) {
            case "0":
                tmpnewchar = "零" + tmpnewchar;
                break;
            case "1":
                tmpnewchar = "壹" + tmpnewchar;
                break;
            case "2":
                tmpnewchar = "贰" + tmpnewchar;
                break;
            case "3":
                tmpnewchar = "叁" + tmpnewchar;
                break;
            case "4":
                tmpnewchar = "肆" + tmpnewchar;
                break;
            case "5":
                tmpnewchar = "伍" + tmpnewchar;
                break;
            case "6":
                tmpnewchar = "陆" + tmpnewchar;
                break;
            case "7":
                tmpnewchar = "柒" + tmpnewchar;
                break;
            case "8":
                tmpnewchar = "捌" + tmpnewchar;
                break;
            case "9":
                tmpnewchar = "玖" + tmpnewchar;
                break;
        }
        switch (part[0].length - i - 1) {
            case 0:
                tmpnewchar = tmpnewchar + "元";
                break;
            case 1:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "拾";
                break;
            case 2:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "佰";
                break;
            case 3:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "仟";
                break;
            case 4:
                tmpnewchar = tmpnewchar + "万";
                break;
            case 5:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "拾";
                break;
            case 6:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "佰";
                break;
            case 7:
                if (perchar != 0)
                    tmpnewchar = tmpnewchar + "仟";
                break;
            case 8:
                tmpnewchar = tmpnewchar + "亿";
                break;
            case 9:
                tmpnewchar = tmpnewchar + "拾";
                break;
        }
        newchar = tmpnewchar + newchar;
    }


    if (num.indexOf(".") != -1) {
        if (part[1].length > 2) {
            part[1] = part[1].substr(0, 2);
        }
        for (i = 0; i < part[1].length; i++) {
            tmpnewchar = "";
            perchar = part[1].charAt(i);
            switch (perchar) {
                case "0":
                    tmpnewchar = "零" + tmpnewchar;
                    break;
                case "1":
                    tmpnewchar = "壹" + tmpnewchar;
                    break;
                case "2":
                    tmpnewchar = "贰" + tmpnewchar;
                    break;
                case "3":
                    tmpnewchar = "叁" + tmpnewchar;
                    break;
                case "4":
                    tmpnewchar = "肆" + tmpnewchar;
                    break;
                case "5":
                    tmpnewchar = "伍" + tmpnewchar;
                    break;
                case "6":
                    tmpnewchar = "陆" + tmpnewchar;
                    break;
                case "7":
                    tmpnewchar = "柒" + tmpnewchar;
                    break;
                case "8":
                    tmpnewchar = "捌" + tmpnewchar;
                    break;
                case "9":
                    tmpnewchar = "玖" + tmpnewchar;
                    break;
            }
            if (i == 0)
                tmpnewchar = tmpnewchar + "角";
            if (i == 1)
                tmpnewchar = tmpnewchar + "分";
            newchar = newchar + tmpnewchar;
        }
    }
    while (newchar.search("零零") != -1) {
        newchar = newchar.replace("零零零", "");
        newchar = newchar.replace("零零", "零");
        newchar = newchar.replace("零亿", "亿");
        newchar = newchar.replace("亿万", "亿");
        newchar = newchar.replace("零万", "万");
        newchar = newchar.replace("零元", "元");
        newchar = newchar.replace("零角", "");
        newchar = newchar.replace("零分", "");
        if (newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角") {
            newchar = newchar + "整"
        }
    }
    newchar = newchar.replace("零元", "元");
    return newchar;
}
//创建弹出窗口
$.utilBaseModal = {
    create: function(option) {
        var obj = $(this);
        var options = $.extend({
            type: 'pop',
            inAnimate: '',
            outAnimate: '',
            width: 500,
            height: 245,
            backClose: false,
            remove: true
        }, option);
        if (options.remove == false) {
            if ($('#' + options.type + '-modal-outer').size() > 0) {
                $('#' + options.type + '-modal-mask').show();
                $('#' + options.type + '-modal-outer').show();
                options.inAnimate != '' && $('#' + options.type + '-modal-outer').addClass(options.inAnimate);
            }
        }
        if ($('#' + options.type + '-modal-outer').size() <= 0) {
            var html = '';
            html += '<div id="' + options.type + '-modal-mask" class="modal-mask"></div>\
            <div id="' + options.type + '-modal-outer" class="modal-outer animated ' + (options.inAnimate != '' ? options.inAnimate : '') + '">\
            <div id="' + options.type + '-modal-inner" class="modal-inner">\
            <div id="' + options.type + '-modal-title" class="modal-title">\
            <a href="javascript:" id="' + options.type + '-modal-remove" class=""><i class="fa fa-close"></i></a>\
            </div>\
            <div id="' + options.type + '-modal-content" class="modal-content clearfix"></div>\
            </div>\
            </div>';
            $('body').append(html);
        }
        $('#' + options.type + '-modal-outer').css({'width': options.width + 'px', 'marginLeft': '-' + (options.width / 2) + 'px', 'background': '#fff'});
        $('#' + options.type + '-modal-remove').click(function() {
            $.utilBaseModal.remove(options.type, options);
            return false;
        });

        if (options.backClose == true) {
            $('#' + options.type + '-modal-mask').on('click', function() {
                $('#' + options.type + '-modal-remove').trigger('click');
                return false;
            });
        }

    },
    position: function(type) {
        if ($('#' + type + '-modal-outer').height() > $(document).height()) {
            $('#' + type + '-modal-outer').css({'top': '5px', 'bottom': '5px'});
            $('#' + type + '-modal-content').css({'position': 'absolute', 'top': 0, 'bottom': 0, 'left': 0, 'right': 0, 'overflow': 'auto'});
        } else {
            $('#' + type + '-modal-outer').css({'marginTop': '-' + ($('#' + type + '-modal-outer').height() / 2) + 'px'});
        }
        //console.log($('#'+type+'-modal-outer').height());
    },
    remove: function(type, options) {
        if (options == undefined || options == '') {
            options = {inAnimate: '', outAnimate: ''};
        }

        $('#' + type + '-modal-remove').unbind("click");
        if (options.inAnimate != '') {
            $('#' + type + '-modal-outer').removeClass(options.inAnimate);
        }
        if (options.outAnimate != '') {
            $('#' + type + '-modal-outer').addClass(options.outAnimate);
            timer = setTimeout(function() {
                $('#' + type + '-modal-outer').removeClass(options.inAnimate + ' ' + options.outAnimate);
                options.remove == true ? $('#' + type + '-modal-outer').remove() : $('#' + type + '-modal-outer').hide();
            }, 500);
        } else {
            options.remove == true ? $('#' + type + '-modal-outer').remove() : $('#' + type + '-modal-outer').hide();
        }
        options.remove == true ? $('#' + type + '-modal-mask').remove() : $('#' + type + '-modal-mask').hide();
        return false;
    }
}
$.utilAlertModal = {
    ok_button: '确 定',
    cancel_button: '取 消',
    type: 'alert',
    alert: function(message, callback) {
        $.utilAlertModal.show(message, 'alert', function(result) {
            if (callback)
                callback(result);
        });
    },
    confirm: function(message, callback) {
        $.utilAlertModal.show(message, 'confirm', function(result) {
            if (callback)
                callback(result);
        });
    },
    remove: function() {
        $('#' + $.utilAlertModal.type + '-modal-remove').trigger('click');
    },
    show: function(msg, mtype, callback) {
        $.utilBaseModal.create({
            type: $.utilAlertModal.type,
            width: 380
        });
        var html = '<div class="alert-modal-fixed"><div class="alert-modal">\
            <p class="alert-title">系统提示</p>\
            <p class="alert-msg">' + msg + '</p>\
            <p class="alert-buttons"></p>\
            </div></div>';
        $('#' + $.utilAlertModal.type + '-modal-content').html(html);
        switch (mtype) {
            case 'alert':
                $(".alert-buttons").html('<button type="button" class="btn btn-primary btn-sm alert-ok">' + $.utilAlertModal.ok_button + '</button>');
                $(".alert-ok").on('click', function() {
                    $.utilAlertModal.remove();
                    callback(true);
                    return false;
                });
                break;
            case 'confirm':
                $(".alert-buttons").html('<button type="button" class="btn btn-primary btn-sm alert-ok">' + $.utilAlertModal.ok_button + '</button> <button type="button" class="btn btn-default btn-sm alert-cancel">' + $.utilAlertModal.cancel_button + '</button>');
                $(".alert-ok").on('click', function() {
                    $.utilAlertModal.remove();
                    if (callback)
                        callback(true);
                    return false;
                });
                $(".alert-cancel").on('click', function() {
                    $.utilAlertModal.remove();
                    if (callback)
                        callback(false);
                    return false;
                });
                break;
        }
        return false;
    }
}
// Shortuct functions
jAlert = function(message, callback) {
    $.utilAlertModal.alert(message, callback);
}
jConfirm = function(message, callback) {
    $.utilAlertModal.confirm(message, callback);
}

//普通弹出层
$.popModal = function(option) {
    //var obj=$(this);
    var type = "pop";
    var options = $.extend({
        url: null,
        content: null,
        width: 600,
        backClose: false,
        inAnimate: 'fadeInUp',
        outAnimate: 'fadeOutDown'
    }, option);

    $.utilBaseModal.create({
        type: type,
        width: options.width,
        backClose: options.backClose,
        inAnimate: options.inAnimate,
        outAnimate: options.outAnimate
    });
    if (options.url) {
        $.get(options.url, function(data) {
            $('#' + type + '-modal-content').html(data);
        });
    }
    if (options.content) {
        $('#' + type + '-modal-content').html(options.content);
    }
    setTimeout(function() {
        $.utilBaseModal.position(type);
    }, 100);
}
$.popModalClose = function() {
    $('#pop-modal-remove').trigger('click');
    return false;
}

$.popupModalClose = function() {
    $('#popup-modal-remove').trigger('click');
    return false;
}
var timer = null;
$.flashToast = function(option) {
    clearTimeout(timer);
    var options = $.extend({
        position: 'center', //top,center,bottom
        type: 'warning', //success,warning,error
        message: '',
        time: 3000
    }, option);
    var type_icon = (options.type == 'success') ? 'check-circle-o' : 'exclamation-triangle';
    if ($('.flash-toast').size() > 0) {
        $('.flash-toast').css('margin-left', '');
        $('.flash-toast').attr('class', 'flash-toast flash-toast-type-' + options.type).html('<i class="fa fa-' + type_icon + '"></i> ' + options.message);
    } else {
        $('body').append('<div class="flash-toast flash-toast-type-' + options.type + '"><i class="fa fa-' + type_icon + '"></i> ' + options.message + '</div>');
    }
    $('.flash-toast').css('margin-left', '-' + (options.message.length * 15) / 2 + 'px');

    $('.flash-toast').addClass('flash-toast-pos-' + options.position).fadeIn();
    timer = setTimeout(function() {
        $('.flash-toast').fadeOut();
    }, options.time);
}
//全选
function checkbox_status() {
    if ($('.check-item:checked').size() > 0) {
        $('.operator-button button').attr('disabled', false);
    } else {
        $('.operator-button button').attr('disabled', true);
    }
}

$(document).on('click', '.check-all', function() {
    if ($(this).prop('checked') == true) {
        $('.check-item:not(:disabled)').prop('checked', true);
        $('.check-item:not(:disabled)').parent().parent().css('background', '#f4f9fb');
        $('.check-all').prop('checked', true);
    } else {
        $('.check-item:not(:disabled)').prop('checked', false);
        $('.check-item:not(:disabled)').parent().parent().css('background', '');
        $('.check-all').prop('checked', false);
    }
    checkbox_status();
});
$(document).on('click', '.check-item', function() {
    var check_length = $('.check-item').length;
    if ($(this).prop('checked') == true) {
        $(this).parent().parent().css('background', '#E9F2F5');
    } else {
        $(this).parent().parent().css('background', '');
    }
    checkbox_status();
    if($('input[class="check-item"]:checked').length == check_length){
        $('.check-all').prop('checked', true);
    }else {
        $('.check-all').prop('checked', false);
    }
});

//编辑器批量上传插件
var multipleUpload = function(editor) {
    var uploadQueue = function(callback) {
        var obj = $('.pre-upload-img[data-status="wait"]');
        if (obj.size() > 0) {
            var id = obj.attr('data-id');
            $('.pre-upload-img[data-id=' + id + ']').prepend('<div class="upload-loading" id="multi-loader' + id + '"></div>');
            $.when($.getJSON('http://plugin.vipbcw.com/?m=site&c=qiniu&a=getQiniuToken&t=picture&callback=?')).done(function(serverData) {
                var formData = new FormData();
                formData.append('key', serverData.key);
                formData.append('token', serverData.token);
                //bucket可选static(测试),image(正式)
                //$.when($.getJSON('http://plugin.vipbcw.com/?m=site&c=upyun&a=getUpyunSign&t=&callback=?')).done(function(serverData){
                //var formData = new FormData();
                //formData.append('policy',serverData.policy);
                //formData.append('signature',serverData.sign);
                formData.append('file', fileList[id]);
                $.ajax({
                    url: serverData.action,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    xhr: function() {
                        _xhr = $.ajaxSettings.xhr();
                        if (_xhr.upload) {
                            $('#multi-loader' + id + '').append('<progress></progress>');
                            _xhr.upload.addEventListener('progress', function(e) {
                                if (e.lengthComputable) {
                                    $('#multi-loader' + id + ' progress').attr({value: e.loaded, max: e.total}); //更新数据到进度条
                                    var percent = e.loaded / e.total * 100;
                                    //console.log(percent);
                                    //$('#loader'+id+'').html(e.loaded + "/" + e.total+" bytes. " + percent.toFixed(2) + "%");
                                    //$('#loader'+id+'').html(percent.toFixed(0) + "%");
                                }
                            }, false);
                        }
                        return _xhr;
                    },
                    success: function(response) {
                        $('#multi-loader' + id).remove();
                        $('.pre-upload-img[data-id=' + id + ']').attr('data-status', 'complete');
                        //var obj = $.parseJSON(response);
                        //data={'status':'1','msg':'图片成功上传到又拍云','url':serverData.url+obj.url};
                        var obj = response;
                        data = {'status': '1', 'msg': '图片成功上传到七牛', 'url': serverData.url + obj.key};
                        $('.pre-upload-img[data-id=' + id + '] img').attr('src', serverData.url + obj.key);
                        callback && callback.call(this, data);
                        uploadQueue(callback);
                    },
                    error: function(response) {
                        $('#multi-loader' + id).hide();
                        data = {'status': '-1', 'msg': '失败：' + JSON.stringify(response)};
                        callback && callback.call(this, data);
                    }
                });
            });

        }
    };
    var str = '<div id="multi-upload" class="multi-upload-wrap">\
		<div class="multi-upload-title"><a href="javascript:" class="upload-close">关闭</a><strong>上传图片</strong></div>\
		<div class="multi-upload-cont">\
			<div id="multi-upload-empty" style="width:100%;height:100%;">\
				<div class="upload-wrap" style="margin-top:20%;">\
					<input type="file" class="upload-file multiple" id="multiple-upload-button" name="files" multiple  />\
					<div class="preview">+</div>\
				</div>\
			</div>\
			<div id="multi-upload-queue" class="multi-upload-queue" style="display:none;">\
				<div id="multi-upload-queue-cont" style="height:310px;overflow:auto;">\
			    </div>\
			    <div style="height:35px;padding-top:5px">\
			    	<button type="button" name="upload-start" id="multi-upload-start" class="btn btn-primary btn-sm"><i class="fa fa-cloud-upload"></i> 开始上传</button> &nbsp; &nbsp; &nbsp;\
			    	<button type="button" name="upload-restart" id="multi-upload-restart" class="btn btn-danger btn-sm"><i class="fa fa-refresh"></i> 重新添加</button> &nbsp; &nbsp; &nbsp;\
					<button type="button" name="upload-continue" id="multi-upload-continue" class="btn btn-info btn-sm display-none"><i class="fa fa-caret-square-o-right"></i> 继续添加</button>\
			    </div>\
			</div>\
		</div>\
	</div>';
    $('.xhe_nostyle').before(str);

    var fileList = new Array();
    $(document).off('change', '#multiple-upload-button');
    $(document).off('click', '#multi-upload-start');
    $(document).off('click', '#multi-upload-restart');
    $(document).off('click', '#multi-upload-continue');
    $(document).on('change', '#multiple-upload-button', function() {
        var files = $(this)[0].files;
        $.each(files, function(i, d) {
            var isExists = false;
            if (!d.type.match(/jpeg|gif|png|bmp/i)) {
                //判断上传文件格式
                return alert("上传的图片格式不正确，请重新选择");
            }
            $.each(fileList, function(li, ld) {
                //console.log(d.name==ld.name);
                if (d.name == ld.name) {
                    isExists = true;
                }
            });
            if (isExists == false) {
                $('#multi-upload-empty').hide();
                $('#multi-upload-queue').show();
                var reader = new FileReader();
                reader.readAsDataURL(d);
                fileList.push(d);
                //console.log(fileList);
                var m = fileList.length - 1;
                $('#multi-upload-queue-cont').append('<div class="pre-upload-img" data-id="' + m + '" data-status="wait"><img src="/static/img/loading_1.gif" alt="" /></div>');
                reader.onload = function(e) {
                    $('.pre-upload-img[data-id=' + m + '] img').attr('src', this.result);
                }
            }
        });
    });

    //关于上传窗口
    $(document).on('click', '.multi-upload-title .upload-close', function() {
        $('#multi-upload').remove();
        return false;
    });
    //
    $(document).on('click', '#multi-upload-start', function() {
        if (fileList.length > 0) {
            uploadQueue(function(data) {
                if (data.status == 1) {
                    editor.pasteHTML('<img src="' + data.url + '" alt="" />');
                } else {
                    alert(data.msg)
                }
            });
        }
    });

    $(document).on('click', '#multi-upload-restart', function() {
        if (confirm('确定要清空上传列表重新选择文件上传吗？')) {
            fileList = [];
            $('#multi-upload-queue-cont').html('');
            $('#multiple-upload-button').trigger('click');
        }
        return false;
    });

    $(document).on('click', '#multi-upload-continue', function() {
        $('#multiple-upload-button').trigger('click');
        return false;
    });
}

/* 表单校验
 * 只要指定表单的样式为validate-form,自动会使用以下方式进行表单校验
 * 指定了success-tip,则在成功后显示success-tip的文字
 * 指定了confirm，则先弹出确认框，在进行操作
 * 指定call-back，则执行完成后执行call-back
 * 指定tip-type，则提示形式为flashtip和alert
 * form加了target将不经过ajax请求
 * 具体设置请参考plugin.js 里的utilValidateForm;
 */
$(document).on('submit', '.validate-form', function() {
    var form = $(this);
    var url = form.attr('action'),
        success_tip = form.attr('success-tip'),
        fail_tip = form.attr('fail-tip'),
        confirm_text = form.attr('confirm'),
        call_function = form.attr('call-back'),
        redirect_url = form.attr('redirect-url'),
        target = form.attr('target'),
        is_confirm = $('body').data('is_confirm_form');
    var iframe_location;
    if(current_iframe){
        if(current_iframe[0] == undefined){
            iframe_location = current_iframe.context.location;
        }else{
            iframe_location = $(current_iframe[0].contentDocument)[0].location;
        }
    }else{
        iframe_location = location;
    }

    if (form.utilValidateForm()) {
        if (confirm_text && !is_confirm) {
            jConfirm(confirm_text, '', function(r) {
                if (r) {
                    if (target == undefined) {
                        $.ajax({
                            url: url,
                            data: form.serialize(),
                            type: form.attr('method'),
                            dataType: 'json',
                            beforeSend: function() {
                                form.find('button[type=submit],input[type=submit]').attr('disabled', true);
                            },
                            success: function(data) {
                                setTimeout(function() {
                                    form.find('button[type=submit],input[type=submit]').removeAttr('disabled');
                                }, 2000);
                                /*if (data.result.status==-2){
                                 if ($('#random-code-insert').html()==''){
                                 var random_code_html=template('random-code-template',{'timestr':new Date().getTime()});
                                 $('#random-code-insert').html(random_code_html);
                                 }
                                 }*/
                                if (data.error == 200) {
                                    if (success_tip != 'false') {
                                        if (!success_tip)
                                            success_tip = data.result.msg;
                                        success_tip != '' && window.parent.$.flashToast({position: 'center', type: 'success', message: success_tip});
                                    }
                                    if (call_function) {
                                        if (call_function != false) {
                                            try {
                                                $('body').data('return_data', data);
                                                if (typeof (eval(call_function)) == "function") {
                                                    eval(call_function + '()');
                                                }
                                                ;
                                            } catch (e) {
                                                alert('不存在' + call_function + '这个函数');
                                                return false;
                                            }
                                        }
                                    } else {
                                        setTimeout(function() {
                                            redirect_url ? iframe_location.href = redirect_url : iframe_location.reload();
                                            if (form.hasClass('pop-form')){
                                                $.popModalClose();
                                            }
                                        }, 1000);
                                    }
                                } else {
                                    if (!fail_tip)
                                        fail_tip = data.msg;
                                    $.flashToast(fail_tip, 'warning');
                                    //$('.validate-img').trigger('click');
                                }
                            }
                        });
                    } else {
                        $('body').data('is_confirm_form', true);
                        form.submit();
                    }
                }
            });
            return false;
        } else {
            if (target == undefined) {
                $.ajax({
                    url: url,
                    data: form.serialize(),
                    type: form.attr('method'),
                    dataType: 'json',
                    beforeSend: function() {
                        form.find('button[type=submit],input[type=submit]').attr('disabled', true);
                    },
                    success: function(data) {
                        console.log(data);
                        setTimeout(function() {
                            form.find('button[type=submit],input[type=submit]').removeAttr('disabled');
                        }, 2000);
                        /*if (data.result.status==-2){
                         if ($('#random-code-insert').html()==''){
                         var random_code_html=template('random-code-template',{'timestr':new Date().getTime()});
                         $('#random-code-insert').html(random_code_html);
                         }
                         }*/
                        if (data.error== 200) {
                            if (success_tip != 'false') {
                                if (!success_tip)
                                    success_tip = data.result.msg;
                                success_tip != '' && window.parent.$.flashToast({position: 'center', type: 'success', message: success_tip});
                            }
                            if (call_function) {
                                if (call_function != false) {
                                    try {
                                        $('body').data('return_data', data);
                                        if (typeof (eval(call_function)) == "function") {
                                            eval(call_function + '()');
                                        };
                                    } catch (e) {
                                        alert('不存在' + call_function + '这个函数');
                                        return false;
                                    }
                                }
                            } else {
                                setTimeout(function() {
                                    redirect_url ? iframe_location.href = redirect_url : iframe_location.reload();
                                    if (form.hasClass('pop-form')){
                                        $.popModalClose();
                                    }
                                }, 1000);
                            }
                        } else {
                            if (!fail_tip)
                                fail_tip = data.msg;
                            success_tip != '' && window.parent.$.flashToast({position: 'center', type: 'warning', message: fail_tip});
                            //$('.validate-img').trigger('click');
                        }
                    }
                });
                return false;
            }
        }
    } else {
        return false;
    }

})

/* a,button进行ajax处理，只要指定class="ajax-request"
 *
 * <a href="javascript:" data-url="" template-url="" request-url="" data-param="{id:'',name:''}" data-type="get" confirm="" success-tip="" call-function="" redirect-url="" template-id=""></a>
 * <button type="button" data-url="" template-url="" method-type="get" confirm="" success-tip="" call-function="" redirect-url="" template-id=""></button>
 * method-type默认是get，也可以指定为post
 *
 * 只请求一次，则
 * <a href="javascript:" data-url=""></a>
 * 若请求之前需要确认，则加入confirm属性；希望执行成功后自定义提示语，加入success-tip；
 * 请求完毕后默认刷新本页，加入redirect-url则成功后跳转到该url；
 * 需要成功后执行某个函数，则加入call-back，该属性覆盖redirect-url,call-back=false则不进行任何动作
 * success-tip不设置则取系统返回的信息，设置为false则不提示任何信息
 * ---------------------------------------------
 * 请求后有下一步操作的，使用弹出层（popModal）或浮动层（floatModal）。只负责弹出内容，内容里的下一步操作需要另外写函数方法
 * 一，请求一个模板地址，即请求一个url地址，返回页面内容到popModal和floatModal上，则指定template-url（使用get请求）
 * <a href="javascript:" template-url=""></a>
 * 在输出的内容里进行操作可以结合表单校验
 *
 * 二，弹出层的内容是页面自定义模板
 * <a href="javascript:" data-url="" template-id=""></a>
 * data-url为指定到模板表单里的action地址
 * 若需要先请求一个url地址返回数据到模板，则指定request-url
 *
 * 如果指定request-url,则先请求request-url，返回数据后再进行赋值
 * 如果指定template-url，则会去请求template-url，返回一个模板数据
 * 如果指定template-id，则使用id为template-id的模板
 */
$(document).on('click', '.ajax-request:not(.disabled)', function() {
    var obj = $(this);
    var obj_id = obj.attr('id'),
        data_url = obj.attr('data-url'),
        title = obj.attr('title'),
        template_url = obj.attr('template-url'), //和template_id一起用，请求模板json的地址
        request_url = obj.attr('request-url'),
        template_id = obj.attr('template-id'),
        method_type = obj.attr('method-type'), //ajax发送的方法，默认get，也可改为post
        data_param = obj.attr('data-param'), //传递的参数
        confirm_text = obj.attr('data-confirm'), //弹窗内的提示内容
        success_tip = obj.attr('success-tip'), //操作成功的提示
        fail_tip = obj.attr('fail-tip'), //操作失败的提示
        modal_type = obj.attr('modal-type'),
        modal_width = obj.attr('modal-width'),
        call_function = obj.attr('call-back'), //操作成功的回调函数
        redirect_url = obj.attr('redirect-url'); //跳转的url
    var iframe_location = current_iframe ? current_iframe.context.location : location;
    var param;
    if (data_param) {
        param = eval('(' + data_param + ')');
    } else {
        param = {};
    }
    if (!method_type)
        method_type = 'get';
    if (!template_url && !template_id) {//只请求
        if (confirm_text) {
            window.parent.jConfirm(confirm_text, function(r) {
                if (r) {
                    $.ajax({
                        url: data_url,
                        type: method_type,
                        data: param,
                        dataType: 'json',
                        success: function(data) {
                            if (data.error == 200) {
                                if (success_tip != "false") {
                                    if (!success_tip)
                                        success_tip = data.msg;

                                    success_tip != '' && window.parent.$.flashToast({position: 'center', type: 'success', message: success_tip});
                                }
                                if (call_function) {
                                    if (call_function != false) {
                                        if (!call_function.indexOf('(')) {
                                            eval(call_function + '()');
                                        } else {
                                            eval(call_function)
                                        }
                                    }
                                } else {
                                    setTimeout(function() {
                                        redirect_url ? iframe_location.href = redirect_url : iframe_location.reload();
                                    }, 1000);
                                    return false;
                                }
                            } else {
                                if (!fail_tip)
                                    fail_tip = data.msg;
                                window.parent.$.flashToast({position: 'center', type: 'error', message: fail_tip});
                            }
                        }
                    });
                }
            });
        } else {
            $.ajax({
                url: data_url,
                data: param,
                type: method_type,
                dataType: 'json',
                success: function(data) {
                    if (data.error == 200) {
                        if (success_tip != "false") {
                            if (!success_tip)
                                success_tip = data.msg;
                            success_tip != '' && window.parent.$.flashToast({position: 'center', type: 'success', message: success_tip});
                        }
                        if (call_function) {
                            if (call_function != false) {
                                if (!call_function.indexOf('(')) {
                                    eval(call_function + '()');
                                } else {
                                    eval(call_function);
                                }
                            }
                        } else {
                            setTimeout(function() {
                                redirect_url ? iframe_location.href = redirect_url : iframe_location.reload();
                            }, 1000);
                            return false;
                        }
                    } else {
                        if (!fail_tip)
                            fail_tip = data.msg;
                        window.parent.$.flashToast({position: 'center', type: 'error', message: fail_tip});
                    }
                }
            });
        }
        return false;
    } else {
        var data = {};
        if (template_url) {
            $.get(template_url, param, function(data) {
                if (modal_type == 'pop') {
                    if (!modal_width)
                        modal_width = 640;
                    window.parent.$.popModal({'content': data, 'width': modal_width});
                } else {
                    obj.floatModal({'str': data, 'title': title, 'direction': 'right'});
                }
            });
        }
        if (request_url) {//如果有先请求的地址，则先请求
            $.getJSON(request_url, function(result) {
                data = result.data;
                data.url = data_url;
                var html = template(template_id, data);//此处调用template模板
                if (modal_type == 'pop') {
                    if (!modal_width)
                        modal_width = 640;
                    window.parent.$.popModal({'content': html, 'width': modal_width});
                } else {
                    obj.floatModal({'str': html, 'title': title, 'direction': 'right'});
                }
            });
        }
        if (!request_url && template_id) {
            if (data_param)
                data = eval('(' + data_param + ')');
            data.url = data_url;
            var html = template(template_id, data);
            if (modal_type == 'pop') {
                if (!modal_width)
                    modal_width = 640;
                window.parent.$.popModal({'content': html, 'width': modal_width});
            } else {
                obj.floatModal({'str': html, 'title': title, 'direction': 'right'});
            }
        }
        return false;
    }
});

//popover
$(document).on('mouseenter', '[rel=user-info]', function() {
    var _this = this;
    var uid = $(this).attr('data-id');
    $('.popover').hide();
    $(this).popover({container: 'body', html: true, placement: 'auto right', content: '<div class="user-card" style="line-height:130px;text-align:center;"><i class="fa fa-2x fa-spinner fa-pulse"></i></div>'}).popover('show');
    $('.popover-content').load('/user/card?id=' + uid);
    $('.popover').on('mouseleave', function() {
        $(_this).popover('destroy');
    });
}).on('mouseleave', '[rel=author]', function() {
    var _this = this;
    setTimeout(function() {
        if (!$('.popover:hover').length) {
            $(_this).popover('destroy');
        }
    }, 100);
});


/*
 *
 * @todo 搜素商品开始
 */

var button_index;
/*input框获得焦点弹窗*/
$(document).on('click','.good-request',function (event) {
    /* 阻止冒泡事件 */
    event.stopPropagation();
    var obj = $(this);
    var address = obj.attr('data-address'),
        name = obj.attr('data-name');
    $(this).parents('.form-group').children('div').addClass('index-num');
    button_index = $(this).parents('.index-num').index();
    $(this).parents('.form-group').addClass('button-icon');
    if(address){
        if(obj.parent().parent().find('.float-modal').length == 0){
            obj.parent().parent().append('<div class="float-modal" id="outer-div"></div>');

        }
        $.get(address,function (data) {
            $('.float-modal').html(data);
        });
    }else{
        /*window.parent.$.flashToast({position: 'center', type: 'error', message:'请求的地址不能为空'});*/
        throw '请求的地址不能为空,请在获取列表的button的data-address上加入相应的地址';
    }
});


/*点击下拉框里面的商品将商品名称和商品ID加载到页面中*/
$(document).on('click','.float-modal-temp',function (event) {
    var button = $(this).parents('.form-group').find('button'),
        limit_number = button.attr('data-limit'),/*商品可选的最大数量*/
        data_difference = button.attr('data-difference'),/*如果一张页面同时存在两个good-request则data-difference="true"，则表示两个good-request的选择的商品不能重复*/
        name = button.attr('data-name'),/*如果需要另外加name字段则添加data-name，但只能添加一个name*/
        has_num = button.attr('data-hasNum'),
        has_order = button.attr('data-order'),
        list_copy = $(this).children(),
        product_id = list_copy.find('.product_id').text().match(/\d+/)[0],
        div_text,product,product_boolen;
    var float_modal_list = $(".del-goods-list").length;
    if(limit_number&&float_modal_list>0&&float_modal_list >= limit_number){//限制商品只能选择一个
        /*window.parent.$.flashToast({position: 'center', type: 'warning', message:'商品只能选择'+limit_number+'个！'});*/
        return;
    }

    /*设置sku的限制数量*/
    var num_text = '<div class="col-sm-3 col-md-3 clearfix margin-top-30">\
                        <label class="control-label col-sm-7 col-md-7" for="basicgoodsgroup-group_info">商品数量</label>\
                        <div class=" col-sm-5 col-md-5">\
                            <input type="text" name="goods_number[]" value="" id="basicgoodsgroup-group_info" class="form-control">\
                        </div>\
                    </div>';

    /*排序*/
    var ord_text = '<div class="col-sm-3 col-md-3 clearfix margin-top-30">\
                        <label class="control-label col-sm-7 col-md-7" for="basicgoodsgroup-ord">排序</label>\
                        <div class=" col-sm-5 col-md-5">\
                            <input type="text" name="goods_order[]" value="" id="basicgoodsgroup-ord" class="form-control">\
                        </div>\
                    </div>';




    $(this).addClass('float-modal-choose');

    if(name){/*如果有新的name则增加一个隐藏域，并将隐藏域的name设置为新的name*/
        div_text = '<div class="goods-list col-sm-12 no-padding" style="margin-top: 3px;">\
                            <div class="clearfix float-modal-list float-modal-temp col-sm-5 float-modal-add col-sm-offset-3 class-'+product_id+'">' +list_copy[0].outerHTML+list_copy[1].outerHTML+'<input type="hidden" name="'+name+'" value="'+product_id+'"></div>\
                        </div>';
    }else{
        div_text = '<div class="goods-list col-sm-12 no-padding" style="margin-top: 3px;">\
                            <div class="clearfix float-modal-list float-modal-temp col-sm-5 float-modal-add col-sm-offset-2 class-'+product_id+'">'+list_copy[0].outerHTML+list_copy[1].outerHTML+'</div>\
                        </div>';
    }

    /*页面中的商品id是否重复*/
    if(data_difference){
        /*获取页面中所有有class-xxx的class,并判断列表中的商品id与xxx是否相同*/
        for(var i=0;i<$('.float-modal-add').length;i++){
            product = $('.float-modal-add')[i].className.match(/class-\d+/)[0].match(/\d+/)[0];
            if(product == $(this).find('.product_id').find('strong').html()){
                product_boolen =true;
            }
        }
    }else{
        /*获取button下所有有class-xxx的class,并判断列表中的商品id与xxx是否相同*/
        for(var i=0;i<$(this).parents('.form-group').find('.float-modal-add').length;i++){
            product = $(this).parents('.form-group').find('.float-modal-add')[i].className.match(/class-\d+/)[0].match(/\d+/)[0];
            if(product == $(this).find('.product_id').find('strong').html()){
                product_boolen =true;
            }
        }
    }

    div_text = $(div_text).clone();

    /*判断是否限制数量*/
    if(has_num){
        div_text.append(num_text);
    }
    if(has_order){
        div_text.append(ord_text);
    }

    is_sort = button.attr('data-is-sort');
    if(is_sort==='1'){
        /*加入删除和排序功能*/
        div_text.append('<div class="col-sm-2 col-md-2 col-lg-2 delete-button margin-top-30">'
            +'排序：<input type="text" name="sell_sort[]" class="sort_input form-control" value="0">&nbsp;'
            +'<button type="button" class="del-item btn btn-sm btn-danger del-goods-list"><i class="fa fa-close"></i> 删除</button></div>');
    }else{
        /*加入删除功能*/
        div_text.append('<div class="col-sm-1 col-md-1 col-lg-1 delete-button margin-top-30"><button type="button" class="del-item btn btn-sm btn-danger del-goods-list"><i class="fa fa-close"></i> 删除</button></div>');
    }

    //加入上移和下移
    data_up_down = button.attr('data-up-down');
    if(data_up_down == 'true'){
        div_text.append('<span class="up" onclick="up(this)">上</span><span class="down" onclick="down(this)">下</span>');
    }

    div_text.find('.float-modal-add').removeClass('float-modal-temp');

    /*判断没有重复商品被选*/
    if(!product_boolen){
        if($(this).parents('.button-icon').children()[0].tagName == 'DIV'){
            $(this).parents('.button-icon').children('div').eq(button_index).append(div_text);
        }else{
            $(this).parents('.button-icon').append(div_text);
            $('#list_check').val('1');/*商品已选择的验证*/
        }
    }else{
        window.parent.$.flashToast({position: 'center', type: 'error', message:'您选的商品与当前重复，请重新选择'});
    }
});


/*删除goods-list*/
$(document).on('click','.del-goods-list',function () {
    $('#list_check').val('');/*商品已删除的验证*/
    $(this).parents('.goods-list').remove();
});


/*关键字查找的提交*/
$(document).on('click','.search-goods',function(event) {
    /* 阻止冒泡事件 */
    event.stopPropagation();
    event.preventDefault();
    var obj = $(this).parents('.form-group').find('.good-request'),
        address = obj.attr('data-address');
    if(address) {
        if(obj.parent().parent().find('.float-modal').length == 0){
            obj.parent().parent().append('<div class="float-modal" id="outer-div"></div>');
        }
        $.get(address + '?goods_name=' + $('input[name="search_name"]').val(), function (data) {
            $('.float-modal').html(data);
        });
    }else{
        //window.parent.$.flashToast({position: 'center', type: 'fail', message:'请求的地址不能为空'});
        throw '请求的地址不能为空,请在关键字查找的button的data-address上加入相应的地址';
    }
});

/*阻止整个弹窗冒泡*/
$(document).on('click','.float-modal',function (event) {
    /* 阻止冒泡事件 */
    event.stopPropagation();
    event.preventDefault();
});


/*点击空白处关闭下拉框*/
$(document).on('click','body',function (event) {
    $('.float-modal').remove();
});

/*点击分页页码窗口跳转相应的页面*/
$(document).on('click','.page-num',function (event) {
    /* 阻止冒泡事件 */
    event.stopPropagation();
    event.preventDefault();
    var target = event.target;
    $('.float-modal').load($(target).attr('href'));
});


/*排序*/


/**
 * @todo 搜素商品结束
 */



/**
 * @todo 新增与编辑里面的的图片功能
 */
/*点击图片放大*/
$(document).on('click', '.avatar', function() {
    var url = $(this).attr('src');
    url = url.split('?')[0];
    var str = '<div style="text-align:center;margin-top: 55px;"><img src="' + url + '" style="max-width:580px;max-height:580px;" /></div>';
    window.parent.$.popModal({'content': str, 'width': 600, 'backClose': true});
    return false;
});



$(function (){
    //判断有图片的右上角加删除标志
    var preview = $('.preview');
    for(var k =0;k<preview.length;k++){
        if (preview.eq(k).find('img').length !=0) {
            preview.eq(k).parent().append('<a href="javascript:void(0)" class="fa fa-times-circle remove-img" style="font-size: 18px;"></a>');
        }
    }


    /*判断如果有图片则禁止input[type='file']的上传功能*/
    /* for(var j=0;j<$('.upload-file.square').parent().length;j++){
     if($('.upload-file.square').parent().eq(j).find('.remove-img').size()>0){
     $('input[type="file"]').eq(j).attr('disabled',true);
     }
     }*/

});

/*upload*/
$(document).on('change','.upload-file.square',function(){
    var obj = $(this).next('.preview');
    var _this = this;
    $.qiniuUpload($(this),function(data){
        if(data.status==1){
            obj.html('<img src="'+data.url+'">');
            if(obj.parent().find('.remove-img').size()==0){
                obj.parent().append('<a href="javascript:void(0)" class="fa fa-times-circle remove-img" style="font-size: 18px;"></a>');
                $(_this).siblings('input[type="hidden"]').val(data.url)/*.siblings('input[type="file"]').attr('disabled',true)*/;
                //$('.download-img').attr('href',data.url);
            }else{
                $(_this).siblings('input[type="hidden"]').val(data.url);
                //alert(data.msg);
                //$('.download-img').attr('href',data.url);
            }
        }
    });
}).on('click','a.remove-img',function(event){//点击叉叉删除已经上传的图片
    /* 阻止冒泡事件 */
    event.stopPropagation();
    if($(this).siblings('input[type="file"]').length != 0){
        $(this).siblings('input[type="file"]').attr('disabled',false).siblings('input[type="hidden"]').val('').siblings('.preview').empty().html('+');
        $(this).siblings('input[type="file"]')[0].outerHTML = $(this).siblings('input[type="file"]')[0].outerHTML;/*清空input[type='file']的上传域*/
    }else {
        $(this).siblings('.preview').html('+').parent('.upload-wrap').addClass('start');
    }
    $(this).detach();
    return false;
});



/*左右切换图片*/
$(document).on('click','.avatar',function(){
    if($('.avatars').length!=0) {
        $('#pop-modal-content').prepend('<div class="button-prev button-click"></div>').append('<div class="button-next button-click"></div>')
    }
});

/*上一张*/
$(document).on('click','.button-prev',function(){
    var j;
    for(var i=0;i<$('.avatars').length;i++){
        if($(this).parent('#pop-modal-content').find('img')[0].src ==$('.avatars')[i].src.split(/\?/)[0]){
            j=i;
        }
    }
    if(j==0){
        $(this).parent('#pop-modal-content').find('img').attr('src',$('.avatars').last().attr('src').split(/\?/)[0]);
    }else{
        $(this).parent('#pop-modal-content').find('img').attr('src',$('.avatars').eq(j-1).attr('src').split(/\?/)[0]);
    }
});
/*下一张*/
$(document).on('click','.button-next',function(){
    var j;
    for(var i=0;i<$('.avatars').length;i++){
        if($(this).parent('#pop-modal-content').find('img')[0].src ==$('.avatars')[i].src.split(/\?/)[0]){
            j=i;
        }
    }
    if(j==$('.avatars').length-1){
        $(this).parent('#pop-modal-content').find('img').attr('src',$('.avatars').first().attr('src').split(/\?/)[0]);
    }else{
        $(this).parent('#pop-modal-content').find('img').attr('src',$('.avatars').eq(j+1).attr('src').split(/\?/)[0]);
    }
});
