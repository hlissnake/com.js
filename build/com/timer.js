define("com/timer", [ "./observer", "./class" ], function(require, exports, module) {
    var Observer = require("./observer");
    var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(callback) {
        setTimeout(callback, 1 / 60);
    };
    var Timer = Observer.extend({
        _loop: function() {
            if (!this._run) return false;
            var me = this, now = +new Date(), lastTime = me.lastTime;
            RAF(function() {
                me._loop();
            });
            var dt = (now - lastTime) / 1e3;
            // if dt time is larger than 2 seconds, We can believe this is cause by debug or other operation
            if (dt > 2) {
                dt = 1 / 60;
            }
            me.fire("run", dt);
            me.lastTime = now;
        },
        start: function() {
            this._run = true;
            this.lastTime = +new Date();
            this._loop();
            return this;
        },
        pause: function() {
            this._run = false;
            return this;
        }
    });
    return Timer;
});