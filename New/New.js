/**
 * Created by CC on 2017/7/28 0028.
 */

Function.prototype.new = function () {
    function functor() { return constructor.apply(this, args); }
    var args = Array.prototype.slice.call(arguments);
    functor.prototype = this.prototype;
    var constructor = this;
    return new functor;
};
