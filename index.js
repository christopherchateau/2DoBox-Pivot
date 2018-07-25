$(document).ready(populateStoredToDos());
$('.populated-todos--container').on('click', '.up-vote--icon', voteBtnClick);
$('.populated-todos--container').on('click', '.down-vote--icon', voteBtnClick);
$('.populated-todos--container').on('click', '.delete-button--icon', deleteToDo);
$('.populated-todos--container').on('keyup', '.todo-title', updateEditedTitle);
$('.populated-todos--container').on('keyup', '.todo-body', updateEditedBody);
$('.populated-todos--container').on('keydown', disableSoftReturn);
$('.title-input').on('keyup', toggleSaveButton);
$('.body-input').on('keyup', toggleSaveButton);
$('.save-btn').on('click', saveNewToDo)
$('.filter-input').on('keyup', filterToDos);

function populateStoredToDos() {
  var storageArr = getNParse();
  wipeHTMLCards();
  storageArr.forEach(function(toDo) {
    prepareToDoCard(toDo);
  }); 
  onlyDisplayTen();
}

function saveNewToDo(e) {
    e.preventDefault();
    var toDo = toDoObject();
    populateStoredToDos();
    var storageArr = getNParse();
    storageArr.push(toDo);
    stringNStore(storageArr);
    prepareToDoCard(toDo);
    onlyDisplayTen();
}

function prepareToDoCard(toDo) {
    $('.populated-todos--container').prepend(createHTMLToDo(toDo)); 
    clearInputFields();
    toggleSaveButton();
}

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
  var toDoId = $(this).closest('.populated-todo').attr('id');
  var storageArr = getNParse(), inc;
  $(this).hasClass('up-vote--icon') ? inc = 1 : inc = -1;
  storageArr.forEach(function(toDo) {
    if (toDo.id == toDoId) {
      importanceChange(toDo, inc)
    }
  });
  stringNStore(storageArr);
  populateStoredToDos();
}

function importanceChange(toDo, inc) {
  var importanceLevels = ['None', 'Low', 'Normal', 'High', 'Critical']
  var index = importanceLevels.indexOf(toDo.importance) + inc;
  if (index > 4 || index < 0 ) {
    index = Math.abs(index) - 1;
  }
  toDo.importance = importanceLevels[index];
}

function deleteToDo() {
  var toDoId = $(this).closest('.populated-todo').attr('id');
  var storageArr = getNParse();
  var filteredStorageArr = storageArr.filter(function(toDo) {
    return toDo.id != toDoId;
  });
  stringNStore(filteredStorageArr);
  populateStoredToDos();
}

function updateEditedTitle(e) {
  var toDoId = $(this).closest('.populated-todo').attr('id');
  var editedTitle = $(this).text();
  var storageArr = getNParse();
  storageArr.forEach(function(toDo) {
    toDo.id == toDoId ? toDo.title = editedTitle : toDo.title;
  });
  stringNStore(storageArr);
}

function updateEditedBody(e) {
  var toDoId = $(this).closest('.populated-todo').attr('id');
  var editedTitle = $(this).text();
  var storageArr = getNParse();
  storageArr.forEach(function(toDo) {
    toDo.id == toDoId ? toDo.body = editedTitle : toDo.body;
  });
  stringNStore(storageArr);
}

function getNParse() {
  return JSON.parse(localStorage.getItem('toDoBox')) || [];
}

function stringNStore(toDoArr) {
  var stringifiedArr = JSON.stringify(toDoArr);
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

// function toggleShowButton () {
//   if ($('.bottom-box').children().length > 9) {
//     $('.show-more-btn').show();
//   } else {
//     $('.show-more-btn').hide();
//   }
// }

// function showMoreTasks() {
//   $('.bottom-box').children().show();
//   $('.show-more-btn').hide();
// }

function onlyDisplayTen() {
  $('.populated-todos--container').children(":gt(9)").hide();
  // toggleShowButton();
}

function clearInputFields() {
  $('.title-input').val('');
  $('.body-input').val('');
  $('.filter-input').val('');
}

function wipeHTMLCards() {
  $('.populated-todos--container').html('');
}

function disableSoftReturn(e) {
  if (e.keyCode == 13 && !e.shiftKey) {
    e.target.blur();
    e.preventDefault();
  }
}