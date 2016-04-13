# 纯CSS3实现的可旋转的社交网站分享按钮效果

<!DOCTYPE html>
<head>
    <title>纯CSS3实现的可旋转的社交网站分享按钮效果</title>
    <style>
        #container { width: 960px; margin: 0 auto; }
        ul { width: 145px; margin: 0 auto; list-style: none; font-size: 0px; }
        li a { background: url(images/sprite.png) no-repeat; background-position: -55px 0; display: block; text-indent: -9999px; margin-top: 15px; }
        li a span { background: url(images/sprite.png) no-repeat; display: block; width: 30px; height: 32px; position: relative; z-index: 10;
            -webkit-transition: -webkit-transform 0.4s ease-out;
            -moz-transition: -moz-transform 0.4s ease-out;
            transition: transform 0.4s ease-out;
        }
        li a:hover span {
            -webkit-transform: rotate(360deg);
            -moz-transform: rotate(360deg);
            transform: rotate(360deg);
        }
        li.twitter a { background-position: -55px 0; width: 127px; height: 32px; }
        li.twitter a span { background-position: 0 0; }
        li.dribbble a { background-position: -55px -50px; width: 113px; height: 32px; }
        li.dribbble a span { background-position: 0 -50px; }
        li.lastfm a { background-position: -55px -100px; width: 107px; height: 32px; }
        li.lastfm a span { background-position: 0 -100px; }
        li.spotify a { background-position: -55px -150px; width: 98px; height: 32px; }
        li.spotify a span { background-position: 0 -150px; }
        li.ember a { background-position: -55px -200px; width: 119px; height: 32px; }
        li.ember a span { background-position: 0 -200px; }
        li.inspectelement a { background-position: -55px -250px; width: 144px; height: 32px; }
        li.inspectelement a span { background-position: 0 -250px; }
    </style>
<body>
<div id="container">
    <h1>CSS3旋转图标</h1>
    <ul id="social" class="group">
        <li class="twitter"><a href="/"><span></span>twitter</a></li>
        <li class="dribbble"><a href="/"><span></span>dribbble</a></li>
        <li class="lastfm"><a href="/"><span></span>last.fm</a></li>
        <li class="spotify"><a href="/"><span></span>Spotify</a></li>
        <li class="ember"><a href="/"><span></span>ember</a></li>
        <li class="inspectelement"><a href="/"><span></span>Inspect Element</a></li>
    </ul>
</div>
</body>
</html>
