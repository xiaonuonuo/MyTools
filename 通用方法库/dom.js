//获取class
function getByClass(oParent, sClass){   
    if(oParent.getElementsByClassName){
        return oParent.getElementsByClassName(sClass);
    }else{
        var res = [];
        var re = new RegExp(' ' + sClass + ' ', 'i')
        var aEle = oParent.getElementsByTagName('*');
        for(var i = 0; i < aEle.length; i++){
            if(re.test(' ' + aEle[i].className + ' ')){
                res.push(aEle[i]);
            }
       }
    return res;
    }
}

//增加class
function addClass(obj,cls) {
    var obj_class=obj.className,//获取class的内容；
    blank = ( obj_class != '' ) ? ' ' : '';//判断获取的class是否为空，如果不为空，则添加空格；
    added = obj_class + blank + cls;//组合原来的class和需要添加的class，中间加上空格；
    obj.className = added;//替换原来的class；
}

//移除class
function removeClass(obj,cls){
    var obj_class = '' + obj.className + '';//获取class的内容，并在首尾各加一个空格；'abc    bcd' -> ' abc    bcd '
    obj_class = obj_class.replace(/(\s+)/gi,' ');//将多余的空字符替换成一个空格；' abc    bcd ' -> ' abc bcd '
    removed = obj_class.replace(' '+cls+' ',' ');//在原来的class，替换掉首尾加了空格的class  ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g,'');//去掉首尾空格；'bcd ' -> 'bcd'
    obj.className = removed;//替换原来的class；
}

//判断是否存在class
function hasClass(obj,cls){
    var obj_class = obj.className,//获取class的内容；
    obj_class_lst = obj_class.split(/\s+/);//通过split空字符将cls转换成数组
    x = 0;
    for(x in obj_class_lst){
        if ( obj_class_lst[x] == cls ) {
            return true;
        }
    }
    return false;
}
