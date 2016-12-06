// handles requests/responses from the server
//
// req.response comes up as undefined in DomType.displayShared()
window.onload = AJAX;

function AJAX(){
    return {
        post(event, loadScreen, uploadScreen, formData, shared){
            event.preventDefault();
            var data = formData();
            var req = new XMLHttpRequest();
            var self = this;
    
            req.open('post', '/Downloads', true);

            // loading screen
            loadScreen();

            req.addEventListener('load', function(event){
                console.log('upload: complete');
                // reload list to include new file
                self.get(shared);
                // file upload screen
                uploadScreen();
            });

        req.addEventListener('error', function(event){
            console.log('upload: failed');
            // file upload screen again
            uploadScreen();
        });

        req.send(data);
    },
        get(display){
            console.log('inside AjaxType.get()');
            var req = new XMLHttpRequest();

            req.open('GET', '../shared.json', true);
            req.responseType = 'json';

            req.addEventListener('load', function(){
                console.log('status:', req.status);
                display(req.response);
            });

            req.send(null);
        }
    }
}
