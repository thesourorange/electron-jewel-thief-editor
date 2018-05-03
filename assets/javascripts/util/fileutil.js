module.exports = function(document, data, fileName) {

    return new FileUtil(document, data, fileName);

}

function FileUtil(document) {

    this._document = document;
 
};

FileUtil.prototype.saveAs = function(data, fileName) {
    var saveLink = this._document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    var canUseSaveLink = "download" in saveLink;
    var getURL = function() {
        return view.URL || view.webkitURL || view;
    }

    var click = function(node) {
        var event = new MouseEvent("click");
        node.dispatchEvent(event);
    }

    file = new File(data, fileName, {type: 'text/plain'});

    var fileURL = URL.createObjectURL(file);

    saveLink.href = fileURL;
    saveLink.download = fileName;
    
    click(saveLink);

};

FileUtil.prototype.load = function(callback) {
    var loadButton = this._document.createElementNS("http://www.w3.org/1999/xhtml", "input");
    
    loadButton.setAttribute("type", "file");
 
    loadButton.addEventListener('change', function() {
        var files = $(this)[0].files;
    
        callback(files);
    
        return false;
    
    }, false);

    loadButton.click();

};

