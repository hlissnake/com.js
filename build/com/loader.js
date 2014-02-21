define("com/loader", [ "./observer", "./class" ], function(require, exports, module) {
    var Observer = require("./observer");
    var Loader = Observer.extend({
        initialize: function(map) {
            this._assetsNum = 0;
            this._loadedNum = 0;
            this._imgMap = {};
            for (var img in map) {
                this._assetsNum++;
            }
            for (var img in map) {
                var url = map[img];
                this._loadImag(img, url);
            }
        },
        get: function(key) {
            return this._imgMap[key];
        },
        _loadImag: function(key, url) {
            var me = this, img;
            img = me._imgMap[key] || new Image();
            // if(img.complete) {
            // me._complete(img);
            // } else {
            img.onload = function() {
                me._complete(this);
            };
            img.onerror = function() {
                if (!this.retry) {
                    this.retry = true;
                    this.onload = this.onerror = null;
                    me._loadImag(key, url);
                } else {
                    me.fire("error", key, url);
                }
            };
            img.src = url;
            me._imgMap[key] = img;
        },
        _complete: function(img) {
            this._loadedNum++;
            if (this._loadedNum == this._assetsNum) {
                this.fire("complete");
            } else {
                this.fire("load", this._loadedNum, img);
            }
        }
    });
    return Loader;
});