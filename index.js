$(document).ready(populateStoredToDos(retrieveStoredToDos()));
$('.populated-todos--container').on('click', '.up-vote--icon', upVote);
$('.populated-todos--container').on('click', '.down-vote--icon', downVote);
$('.populated-todos--container').on('click', '.delete-button--icon', deleteToDo);
$('.populated-todos--container').on('keydown', '.todo-title', updateEditedTitle);
$('.populated-todos--container').on('keydown', '.todo-body', updateEditedBody);
$('.title-input').on('keyup', toggleSaveButton);
$('.body-input').on('keyup', toggleSaveButton);
$('.save-btn').on('click', saveNewToDo)
$('.search-input').on('keyup', search);

function retrieveStoredToDos() {
  var toDoArr = [];
  var objKeys = Object.keys(localStorage);
  for (var i = 0; i < objKeys.length; i++) {
    toDoArr.push(getNParse(objKeys[i]));
  }
  return toDoArr;
}

function populateStoredToDos(toDoArr) {
  for (var i = 0; i < toDoArr.length; i++) {
    prepareToDoCard(toDoArr[i].id);
  }
}

function saveNewToDo(e) {
    e.preventDefault();
    var toDo = toDoObject();
    wipeHTMLCards();
    populateStoredToDos(retrieveStoredToDos());
    stringNStore(toDo);
    prepareToDoCard(toDo.id);
}

function prepareToDoCard(id) {
    var parsedObj = getNParse(id);
    $('.populated-todos--container').prepend(createHTMLToDo(parsedObj)); 
    clearInputFields();
    toggleSaveButton();
    $('.title-input').focus();
}

function toDoObject() {
    return {
        id: Date.now(),
        title: $('.title-input').val(),
        body: $('.body-input').val(),
        quality: 'swill',
    };
}

var qualityVariable = "swill";

function createHTMLToDo(toDo) {
    
    return `<article id="${toDo.id}" class="populated-todo">
                <div class="searchable">
                    <h2 contenteditable spellcheck="false" class="todo-title">${toDo.title}</h2>
                    <button class="delete-button--icon icon"></button>
                    <p contenteditable spellcheck="false" class="todo-body">${toDo.body}</p>
                </div>
                <button class="up-vote--icon icon"></button>
                <button class="down-vote--icon icon"></button> 
                <h3>Quality: <span class="quality">${toDo.quality}</span></p>
            </article>`
}

function upVote() {
  var clickedToDo = $(this).closest('.populated-todo');
  var parsedObj = getNParse(clickedToDo.attr('id'));
  qualityUpgrade(parsedObj);  
  stringNStore(parsedObj);
  clickedToDo.find('.quality').text(parsedObj.quality);
}

function downVote() {
  var clickedToDo = $(this).closest('.populated-todo');
  var parsedObj = getNParse(clickedToDo.attr('id'));
  qualityDowngrade(parsedObj);
  stringNStore(parsedObj);
  clickedToDo.find('.quality').text(parsedObj.quality);
}


function qualityUpgrade(obj) {
  if (obj.quality === 'swill') {
    obj.quality = 'plausible';
  }    
  else if (obj.quality === 'plausible') {
    obj.quality = 'genius';
  }
}

function qualityDowngrade(obj) {
  if (obj.quality === 'genius') {
    obj.quality = 'plausible';
  }    
  else if (obj.quality === 'plausible') {
    obj.quality = 'swill';
  }
}

function updateEditedTitle(e) {
  var editedTitle = $(this).closest('.todo-title').text();
  var clickedId = $(this).closest('.populated-todo').attr('id');
  var parsedObj = getNParse(clickedId);
  if (e.keyCode == 13 && !e.shiftKey) {
    $('.todo-title').blur();
  }
  parsedObj.title = editedTitle;
  stringNStore(parsedObj);
}

function updateEditedBody(e) {
  var editedBody = $(this).closest('.todo-body').text();
  var clickedId = $(this).closest('.populated-todo').attr('id');
  var parsedObj = getNParse(clickedId);
  if (e.keyCode == 13 && !e.shiftKey) {
    $('.todo-body').blur();
  }
  parsedObj.body = editedBody;
  stringNStore(parsedObj);
}

function getNParse(id) {
  return JSON.parse(localStorage.getItem(id));
}

function stringNStore(toDo) {
  var stringified = JSON.stringify(toDo);
  localStorage.setItem(toDo.id, stringified);
}

function toggleSaveButton() {
  if ($('.title-input').val() && $('.body-input').val()) {
    $('.save-btn').prop('disabled', false);
  } else {
    $('.save-btn').prop('disabled', true);
  }
}

function search() {
  var lowerCaseInput =  $('.search-input').val().toLowerCase();
  $('.searchable').each(function() {
    if($(this).text().toLowerCase().indexOf(lowerCaseInput) !== -1) {
      $(this).parent().fadeIn();
    } else {
      $(this).parent().fadeOut();
    }
  });
}

function deleteToDo(e) {
  var clickedToDo = $(this).closest('.populated-todo');
  clickedToDo.remove();
  localStorage.removeItem(JSON.parse(clickedToDo.attr('id')));
}

function clearInputFields() {
  $('.title-input').val('');
  $('.body-input').val('');
  $('.search-input').val('');
}

function wipeHTMLCards() {
  $('.populated-todos--container').html('');
}