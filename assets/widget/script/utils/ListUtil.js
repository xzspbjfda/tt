var listUtil = (function(imageArray, downloadList) {
    var image = function() {
        this.imageArray = imageArray;
        this.downloadList = downloadList;
        this.uploadFn
        this.delFn
        this.saveFn

        this.getListArray = function() {
            return this.imageArray;
        }

        this.setListArray = function(array) {
            return this.imageArray = array;
        }
        
         this.init = function(opt) {
//          $.extend(this.imageArray, opt.imageArray);
            $.extend(this, opt);
        }

    };
    return new image();
})([], []);
