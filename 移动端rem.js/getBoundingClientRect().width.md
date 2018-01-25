`getBoundingClientRect().width`获取到的其实是父级的右边距离浏览器原点`(0,0)`左边距离浏览器原点`(0,0)`的距离,即父级的宽度`+2padding+2border`。
此时的`clientWidth`等于父级的宽度`+2*padding`,不包括边框的宽度。
当不隐藏子级内容,即`overflow`为`auto`时，前者的宽度依然为这个数字,因为父级并没有改编盒模型。后者的宽度为上述得到的宽度-滚动条的宽度`(17px)`;例子如下:

```
<div id="divParent" style="background-color: #aaa; padding:8px; border:solid 7px #000; height:200px; width:500px; overflow:hidden;">
        <div id="divDisplay" style="background-color: #0f0; margin: 30px; padding: 10px;
            height: 400px; width: 600px; border: solid 3px #f00;">
        </div>
    </div>
    
    <script>
        var divP = document.getElementById('divParent');
        var divD = document.getElementById('divDisplay');

        var clientWidth = divP.clientWidth;
        var getWidth = divP.getBoundingClientRect().width;
        divD.innerHTML += 'clientWidth: ' + clientWidth + '<br/>';
        divD.innerHTML += 'getWidth: ' + getWidth + '<br/>';
    </script>
    ```
