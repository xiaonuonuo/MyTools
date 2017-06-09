$(function(){
    var box = document.getElementById('box');//box为要移动的父元素
    box.onmousedown = function(event){
        var e  = event || window.event,
            t = e.target || e.srcElement,
            //鼠标按下时的坐标x1,y1
            x1 = e.clientX,
            y1 = e.clientY,
            //鼠标按下时的左右偏移量
            dragLeft = this.offsetLeft,
            dragTop = this.offsetTop;
            document.onmousemove = function(event){
                var e = event || window.event,
                    t = e.target || e.srcElement,
                    //鼠标移动时的动态坐标
                    x2 = e.clientX,
                    y2 = e.clientY,
                    //鼠标移动时的坐标的变化量
                    x = x2-x1,
                    y = y2-y1;
                    box.style.left = (x + dragLeft)+'px',
                    box.style.top = (y + dragTop)+'px';

            };
            document.onmouseup = function(){
                this.onmousemove = null
            }
            
    }
})
