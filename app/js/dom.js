// prototype for manipulating dom elements

/*
   TODOS:
   - reload entire list when page is first loaded and
     maybe automatic reload every few minute
   - separate DOM creation functions from other
     - prototype for create HTML elements but 'class' for other?s
*/
window.onload = DomType;

function DomType(){
    // add event listeners in app.js, be sure to bind to DomType

    // form elements
    this.input = document.getElementById('input');
    this.inputLabel = document.getElementById('inputLabel');
    this.submitBtn = document.getElementById('submitBtn');
    this.fileList = document.getElementById('list');
    this.nameDisplay = document.getElementById('name');
    this.typeDisplay = document.getElementById('type');
    this.sizeDisplay = document.getElementById('size');
    this.form = document.getElementById('form');
    
    this.topSect = document.getElementsByClassName('top')[0];
    this.loader = document.getElementById('loader');
    this.sortBtn = Array.from(document.getElementsByClassName('sortBtn'));

    // selected file
    this.file = input.files[0];
}

DomType.prototype.fileInfo = function(event){
    console.log('change event: DomType.fileInfo() called');
    var name;
    // reassign file to new selection
    this.file = this.input.files[0];

    if(this.file.name.length > 16){
        name = this.file.name.substring(0, 13) + '...';
    } else {
        name = this.file.name;
    }

    this.inputLabel.textContent = name;
    this.typeDisplay.textContent = this.shortenType(this.file);
    this.sizeDisplay.textContent = this.adjustSize(this.file);
}

DomType.prototype.createFormData = function(){
    var data = new FormData();
    data.append('filename', this.file.name);
    data.append('filetype', this.file.type);
    data.append('filesize', this.file.size);
    data.append('file', this.file);
    return data;
}

DomType.prototype.displayShared = function(res){
    // res is shared.json
    var list = this.fileList;
    if(res === null){
        return list.textContent = 'shared directory is empty';
    } else if(res === undefined){
        throw new Error;
    } else if(list.children.length > 0){
        // if list exists, add to top
        return list.insertBefore(this.createEntry(res[res.length - 1]), list.firstChild);
    } else {
        var self = this;
        return res.forEach(function(entry){
            if(list.children.length === 0){
                // create list with first item
                list.appendChild(self.createEntry(entry));
            } else {
                // load entire list
                list.insertBefore(self.createEntry(entry), list.firstChild);
            }
        });
    }
}

DomType.prototype.createEntry = function(file){
    var name;

    var cell = document.createElement('div');
    var a = document.createElement('a');
    var group = document.createElement('div');
    var type = document.createElement('div');
    var size = document.createElement('div');
    var date = document.createElement('div');

    if(file.name.length > 20){
        name = file.name.substring(0, 18);
    } else {
        name = file.name;
    }
     
    cell.className = 'tableHead';

    a.href = file.path;
    a.download = file.name;
    a.className = 'cellHead';
    a.textContent = name;

    group.className = 'cellGroup';
    type.className = 'cell left type';
    size.className = 'cell size';
    date.className = 'cell right date';

    type.textContent = this.shortenType(file);
    size.textContent = this.adjustSize(file);
    date.textContent = this.formatDate(file);

    group.append(type);
    group.append(size);
    group.append(date);

    cell.append(a);
    cell.append(group);

    return cell;
}

DomType.prototype.shortenType = function(file){
    var type = file.type;
    var div = type.indexOf('/');

    if(type === ''){
        return 'N/A';
    } else {
        return type.slice(div + 1, type.length);
    }
}

DomType.prototype.adjustSize = function(file){
    var size = file.size;

    if(size < 1024){
        return size + ' bytes';
    } else if(size >= 1024 && size < 1048576){
        return (size / 1024).toFixed(2) + ' KB';
    } else {
        return (size / 1048576).toFixed(1) + ' MB';
    }
}

DomType.prototype.formatDate = function(file){
    if(!file.date || file.date === ''){
        return 'N/A';
    }

    var date = new Date(file.date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if(day < 10){ day = '0' + day; }
    if(month < 10){ month = '0' + month }

    return year + '-' + month + '-' + day;
}

DomType.prototype.loadScreen = function(){
    this.form.style.display = 'none';
    this.topSect.className = 'loader top';
}

DomType.prototype.uploadScreen = function(){
    this.topSect.className = 'card top';
    this.form.style.display = '';

    this.inputLabel.textContent = 'Choose a file...';
    this.typeDisplay.textContent = '';
    this.sizeDisplay.textContent = '';

    this.file = '';
}
