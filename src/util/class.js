window.Util = window.Util || {};

Util.Class = (function(){

    var exports = {};

    function extend(d, b){
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        __.prototype = b.prototype;
        d.prototype = new __();
    }

    function mixin(d, m){
        for (var p in m) if (m.hasOwnProperty(p)) d.prototype[p] = m[p];
    }

    exports.extend = function (d, b, methods) {
        if( typeof b == 'function' ) {
            extend(d, b);
            if(methods) mixin(d, methods);
            d._super = b;
        } else if ( typeof b == 'object' ) {
            mixin(d, b);
            d._super = function(){};
        }
    }

    return exports;

})();