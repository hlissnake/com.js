window.Matrix = window.Matrix || {};

Matrix.AudioLoader = (function(Util, Howler){

    var Class = Util.Class
    ,   Observer = Util.Observer   
    ;

    function Audio(audioMap){
        this._assetsNum =  0;
        this._loadedNum = 0;
        this._assetMap = audioMap;
        this._retryMap = {};
        this._audioList = {};

        for(var audio in audioMap) {
            this._assetsNum++;
        }
    }

    Class.extend(Audio, Observer, {

        get : function(key){
            return this._audioList[key];
        },

        add : function(src, op){
            var me = this
            ,   audio
            ,   url = this._assetMap[src]
            ,   options = op || {}
            ;
            options['urls'] = (typeof url == 'array' ? url : [url]);

            audio = new Howler(options);

            audio.on('load', function(){
                me._complete(src, this);
            })

            audio.on('loaderror', function(){
                if(!me._retryMap[src]) {
                    me._retryMap[src] = true;
                    me.add(src, options);
                    audio = null;
                }
            })

            return audio;
        },

        _complete : function(src, audio){
            this._audioList[src] = audio;
            this._loadedNum++;
            if(this._loadedNum == this._assetsNum) {
                this.fire('complete');
            } else {
                this.fire('load', this._loadedNum / this._assetsNum)
            }
        }
    });

    return Audio;

})(Util, Howl);