/*
TODOS:
- ability to sort based on type, size, and date
- find some way to separate app.js into different files:
  - possibly one for AJAX, one for DOM manipulation, and one to initialize
  - also reorganize CSS
- need for legitimate database? considering MongoDB
- need to delete alternative file once uploaded, leave file with real filename
- when file is upload, update list with only the new file, not re-upload entire
  shared.json
- automatically reload list to add recent files every few minutes?
*/
window.onload = main;

function main(){
  console.log('app.js loaded');
  
  var input = document.getElementById('input');
  var inputLabel = document.getElementById('inputLabel');
  var submit = document.getElementById('submitBtn');
  var progBar = document.getElementById('progBar');
  var fileList = document.getElementById('list');
  var nameDisplay = document.getElementById('name');
  var sizeDisplay = document.getElementById('size'); 
  var typeDisplay = document.getElementById('type');
  var fileForm = document.getElementById('form');

  var top = document.getElementsByClassName('top')[0];
  var loader = document.getElementById('loader');
  var sortBtn = Array.from(document.getElementsByClassName('sortBtn'));

  var file = input.files[0];

  fileForm.addEventListener('change', file_info, false);
  fileForm.addEventListener('submit', post_in_dir, false);

  sortBtn.forEach(function(btn){
    btn.addEventListener('click', sortList, false);
  });

  get_shared_dir();

  function file_info(event){
    var name;
    console.log('change event'); // fires every time new file is selected
    file = input.files[0];
    if(file.name.length > 16){
      name = file.name.substring(0, 13) + '...';
    } else {
      name = file.name
    }
    console.log(file);
    console.log(window.location.host);
    inputLabel.textContent = name;
    sizeDisplay.textContent = adjustSizeDisplay(file);
    typeDisplay.textContent = shortenFileType(file);
  }

  function createFormData(){
    var data = new FormData();
    data.append('filename', file.name);
    data.append('filesize', file.size);
    data.append('filetype', file.type);
    data.append('file', file);
    return data;
  }

  function post_in_dir(event){
    event.preventDefault();
    var data = createFormData();
    var req = new XMLHttpRequest();
    // must use default submit function from html form
    // need to figure out how to override submit AND
    // get it to upload files successfully
    req.open('POST', '/Downloads', true);
    console.log('loading');
    // add loading animation here

    loadingScreen();

    req.addEventListener('load', function(event){
      console.log('upload: complete');
      // reloads the list to include new file
      get_shared_dir();
      uploadScreen();
    });
    req.addEventListener('error', function(event){
      console.log('upload: failed');
    });

    req.send(data);
  }

// getting shared files from host
  function get_shared_dir(){
    // replace file list once updated
    //clearRows();
    var req = new XMLHttpRequest();
    req.open('GET', 'shared.json', true);
    req.responseType = 'json';
    req.addEventListener('load', function(){
      console.log('status: ' + req.status);
      display_dir(req.response);
    });
    req.send(null);
  }

  function display_dir(content){
    if(content === null){
      fileList.textContent = 'shared directory is empty'
    } else {
      return content.forEach(function(entry){
        // need to add to top of list instead of bottom
        //fileList.appendChild(create_tr(entry));
        console.log(fileList.children.length);
        if(fileList.children.length === 0){
          fileList.appendChild(create_tr(entry));
        } else {
          fileList.insertBefore(create_tr(entry), fileList.firstChild);
        }
      });
    }
  }

  function create_tr(file){
    var name;
    
    var cell = document.createElement('div');
    var a = document.createElement('a');
    var group = document.createElement('div');
    var type = document.createElement('div');
    var size = document.createElement('div');
    var date = document.createElement('div');
    
    cell.className = 'tableHead';

    a.href = file.path;
    a.download = file.name;
    a.className = 'cellHead';

    group.className = 'cellGroup';
    type.className = 'cell left type';
    size.className = 'cell size';
    date.className = 'cell right date';

    if(file.name.length > 20){
      name = file.name.substring(0, 18);
    } else {
      name = file.name;
    }
    a.textContent = name;


    size.textContent = adjustSizeDisplay(file);
    type.textContent = shortenFileType(file);
    date.textContent = formatDate(file);

    group.append(type);
    group.append(size);
    group.append(date);

    cell.append(a);
    cell.append(group);

    return cell;
  }

  function shortenFileType(file){
    var type = file.type;
    var div = type.indexOf('/');
    if(type === ''){
      return 'N/A';
    } else {
      return type.slice(div + 1, type.length);
    }
  }

  function adjustSizeDisplay(file){
    var size = file.size;
    if(size < 1024){
      return size + ' bytes';
    } else if(size >= 1024 && size < 1048576){
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / 1048576).toFixed(1) + ' MB';
    }
  }

  function formatDate(file){
    if(!file.date || file.date === ''){
        return 'N/A';
    }
    var date = new Date(file.date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if(day < 10){
        day = '0' + day;
    }

    if(month < 10){
        month = '0' + month;
    }

    return year + '-' + month + '-' + day;
  }

  function loadingScreen(){
    fileForm.style.display = 'none';
    top.className = 'loader top';
  }

  function uploadScreen(){
    top.className = 'card top';
    fileForm.style.display = '';
    inputLabel.textContent = 'Choose a file...';
    sizeDisplay.textContent = '';
    typeDisplay.textContent = '';
    file = '';
  }

  function sortList(event){
    if(this.textContent === 'Type'){
      console.log('type sort');
    } else if(this.textContent === 'Size'){
      console.log('size sort');
    } else {
      console.log('date sort');
    }
  }

  function clearRows(){
    console.log(fileList.children[0]);
    var list = fileList.children;
    return list.forEach(function(current){
      list.splice(list.indexOf(current), list.length);
    });
  }

}
