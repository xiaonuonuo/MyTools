/**
 * Created by CC on 2017/7/31 0031.
 */
var Koa = require('koa');
var app = new Koa();
var router = require('koa-router');

var api = router();

api.get('/' ,function(ctx,next){
    console.log(ctx.query)
    return ctx.body = ctx.query
});

app
    .use(api.routes())
    .use(api.allowedMethods());

app.listen('3000',function(){
    console.log('listening in 3000 port')
})