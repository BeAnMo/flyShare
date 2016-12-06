// all js files operate through this file
//
// all working well ATM - 12/2/16
window.onload = main;

function main(){
    // DOM related operations
    var dom = new DomType();
    var $AJAX = AJAX();

    var domFileInfo = dom.fileInfo;
    var fileInfo = domFileInfo.bind(dom);
   
    var domDisplayShared = dom.displayShared;
    var shared = domDisplayShared.bind(dom);

    var domLoad = dom.loadScreen;
    var load = domLoad.bind(dom);

    var domUpload = dom.uploadScreen;
    var upload = domUpload.bind(dom);

    var domCreateData = dom.createFormData;
    var createData = domCreateData.bind(dom);
   
    $AJAX.get(shared); 
    dom.form.addEventListener('change', fileInfo, false);
    dom.form.addEventListener('submit', function(event){
        $AJAX.post(event, load, upload, createData, shared);
    }, false);
}
