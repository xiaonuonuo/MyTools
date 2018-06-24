//获取地址参数
function $G(){
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}


//手机验证码倒计时方法
function ResendCode(box){
    var time = 60;
    var interval = setInterval(function(){
        time--;
        box.html("剩余"+ time +"S").addClass("sent-waiting").attr({"disabled":"disabled"});
        if(time <= 0){
            box.html("发送验证码").removeClass("sent-waiting").removeAttr("disabled");
            clearInterval(interval);
        }
    },1000)
}


//check按钮
function checkHandle(bigBox,checkAllBtn,checkBtn,class_name,Event){
    var $checkBtn = $(checkBtn);
    var $bidBox= $(bigBox);
    $checkBtn.addClass(class_name).parents("li").addClass(class_name);
    $checkBtn.on(Event,function(){
        if($(this).hasClass(class_name)){
            $(this).removeClass(class_name).parents("li").removeClass(class_name);
        }else{
            $(this).addClass(class_name).parents("li").addClass(class_name);
        }
//        判断全选
        if(checkAllBtn != ""){
            if($bidBox.find("li").length == $bidBox.find("li.on").length){
                $(checkAllBtn).addClass(class_name);
            }else{
                $(checkAllBtn).removeClass(class_name);
            }
        }
    })
    if(checkAllBtn != ""){
        $(checkAllBtn).addClass(class_name);
        $(checkAllBtn).on(Event,function(){
            if($(checkAllBtn).hasClass(class_name)){
                $(checkAllBtn).removeClass(class_name);
                $checkBtn.removeClass(class_name).parents("li").removeClass(class_name);
            }else{
                $(checkAllBtn).addClass(class_name);
                $checkBtn.addClass(class_name).parents("li").addClass(class_name);
            }
        })
    }
}
