/**
 * Created by CC on 2017/7/11.
 */

/**
 * 倒计时控件
 * @param {} count 要计时的秒数
 * @param {} options 其它选项信息
 */
$.fn.jcountdown = function(count, options){
    var zCount = count;
    var defaults = {
        timeup : function(){}
    };
    var opts = $.extend(defaults, options);

    //this在这里是指的要计时的div
    var $timeDiv = $(this);

    //计时函数
    var timeOut = function(){
        $timeDiv.text(zCount);
        zCount--;
        if (zCount >= 0){//时间还没到
            setTimeout(timeOut,1000);
        } else {//时间到
            opts.timeup();
        }
    };

    timeOut();
};