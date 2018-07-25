$(document).ready(populateStoredToDos());
$('.populated-todos--container').on('click', '.up-vote--icon', voteBtnClick);
$('.populated-todos--container').on('click', '.down-vote--icon', voteBtnClick);
$('.populated-todos--container').on('click', '.delete-button--icon', deleteToDo);
$('.populated-todos--container').on('keydown', '.todo-title', updateEditedTitle);
$('.populated-todos--container').on('keydown', '.todo-body', updateEditedBody);
$('.title-input').on('keyup', toggleSaveButton);
$('.body-input').on('keyup', toggleSaveButton);
$('.save-btn').on('click', saveNewToDo)
$('.filter-input').on('keyup', filterToDos);

// function retrieveStoredToDos() {
//   wipeHTMLCards();
//   var toDoArr = [];
//   var objKeys = Object.keys(localStorage);
//   for (var i = 0; i < objKeys.length; i++) {
//     toDoArr.push(getNParse(objKeys[i]));
//   }
//   return toDoArr;
// }

// function populateStoredToDos(toDoArr) {
//   for (var i = 0; i < toDoArr.length; i++) {
//     prepareToDoCard(toDoArr[i].id);
//   }
// }

function populateStoredToDos() {
  var storageArr = getNParse();
  wipeHTMLCards();
  storageArr.forEach(function(toDo) {
    prepareToDoCard(toDo);
  }); 
}


function saveNewToDo(e) {
    e.preventDefault();
    var toDo = toDoObject();
    populateStoredToDos(retrieveStoredToDos());
    stringNStore(toDo);
    prepareToDoCard(toDo.id);
    // cardCounter();
}

function prepareToDoCard(toDo) {
    $('.populated-todos--container').prepend(createHTMLToDo(parsedObj)); 
    clearInputFields();
    toggleSaveButton();
    $('.title-input').focus();
}

// function cardCounter(toDoArr) {
//   var visible = [], hidden = [];

//   for (var i = 0; i < toDoArr.length; i++)

//   hideCards(overTen);
// }

// function hideCards(overTen) {
//   for (var i = 0; i < overTen.length; i++) {
//     if (!$(`#${overTen[i]}`).hasClass('hidden')) {
//       $(`#${overTen[i]}`).addClass('hidden');
//     console.log(overTen)
//     }
//   }
// }

function toDoObject() {
    return {
        id: Date.now(),
        title: $('.title-input').val(),
        body: $('.body-input').val(),
        importance: 'Normal',
    };
}

function createHTMLToDo(toDo) {
    
    return `<article id="${toDo.id}" class="populated-todo">
                <div class="searchable">
                    <h2 contenteditable spellcheck="false" class="todo-title">${toDo.title}</h2>
                    <button class="delete-button--icon icon"></button>
                    <p contenteditable spellcheck="false" class="todo-body">${toDo.body}</p>
                </div>
                <footer>
                  <button class="up-vote--icon icon"></button>
                  <button class="down-vote--icon icon"></button> 
                  <h3>Importance: <span class="importance">${toDo.importance}</span></h3>
                </footer>
            </article>`
}

function voteBtnClick() {
  var clickedToDo = $(this).closest('.populated-todo');
  var parsedObj = getNParse(clickedToDo.attr('id'));
  $(this).hasClass('up-vote--icon') ? importanceChange(parsedObj, 1) : importanceChange(parsedObj, -1);  
  stringNStore(parsedObj);
  clickedToDo.find('.importance').text(parsedObj.importance);
}

function importanceChange(obj, num) {
  var impArr = ['None', 'Low', 'Normal', 'High', 'Critical']
  var index = impArr.indexOf(obj.importance) + num;
  if (index > 4 || index < 0 ) {
    index = Math.abs(index) - 1;
  }
  obj.importance = impArr[index];
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

// function getNParse(id) {
//   return JSON.parse(localStorage.getItem(id));
// }

// function stringNStore(toDo) {
//   var stringified = JSON.stringify(toDo);
//   localStorage.setItem(toDo.id, stringified);
// }

function getNParse() {
  return JSON.parse(localStorage.getItem('toDoBox')) || [];
}

function stringNStore(toDo) {
  var storageArr = JSON.stringify(toDo);
  localStorage.setItem('toDoBox', stringifiedArr);
}

function toggleSaveButton() {
  if ($('.title-input').val() && $('.body-input').val()) {
    $('.save-btn').prop('disabled', false);
  } else {
    $('.save-btn').prop('disabled', true);
  }
}

function filterToDos() {
  var lowerCaseInput =  $('.filter-input').val().toLowerCase();
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
  $('.filter-input').val('');
}

function wipeHTMLCards() {
  $('.populated-todos--container').html('');
}