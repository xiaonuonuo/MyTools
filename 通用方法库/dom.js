//获取class
let getByClass = function (oParent, sClass){   
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

let hasClass = function ( elements,cName ){
    return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") )
}
let addClass = function ( elements,cName ){
    if( !hasClass( elements,cName ) ){
        elements.className += " " + cName
    };
}
let removeClass = function ( elements,cName ){
    if( hasClass( elements,cName ) ){
        elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" ), " " ).trim()
    };
}
