$(document).ready(populateStoredToDos());
$('.populated-todos--container').on('click', '.up-vote--icon', voteBtnClick);
$('.populated-todos--container').on('click', '.down-vote--icon', voteBtnClick);
$('.populated-todos--container').on('click', '.delete-button--icon', deleteToDo);
$('.populated-todos--container').on('keyup', '.todo-title', updateEditedTitle);
$('.populated-todos--container').on('keyup', '.todo-task', updateEditedTask);
$('.populated-todos--container').on('keydown', disableSoftReturn);
$('.title-input').on('keyup', toggleSaveButton);
$('.task-input').on('keyup', toggleSaveButton);
$('.save-btn').on('click', saveNewToDo);
$('.filter-input').on('keyup', filterToDos);
$('.completed-task-btn').on('click', completedTask);
$('.show-more-btn').on('click', showAll);
$('.none').on('click', importanceFilter);
$('.low').on('click', importanceFilter);
$('.normal').on('click', importanceFilter);
$('.high').on('click', importanceFilter);
$('.critical').on('click', importanceFilter);
$('.show-all').on('click', showAllToDos);


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
        task: $('.task-input').val(),
        importance: 'Normal',
        completed: '',
    };
}

function createHTMLToDo(toDo) {
    
    return `<article id="${toDo.id}" class="populated-todo ${toDo.completed}">
                <div class="searchable">
                    <h2 contenteditable spellcheck="false" class="todo-title">${toDo.title}</h2>
                    <button class="delete-button--icon icon"></button>
                    <p contenteditable spellcheck="false" class="todo-task">${toDo.task}</p>
                </div>
                <footer>
                  <button class="up-vote--icon icon"></button>
                  <button class="down-vote--icon icon"></button>
                  <h3>Importance: <span class="importance">${toDo.importance}</span></h3>
                  <button class="completed-task-btn btn">Completed Task</button> 
                </footer>
            </article>`
}

function voteBtnClick() {
  var toDoId = $(this).closest('.populated-todo').attr('id');
  var storageArr = getNParse(), inc;
  $(this).hasClass('up-vote--icon') ? inc = 1 : inc = -1;
  storageArr.find(function(toDo) {
    if (toDo.id == toDoId) {
      importanceChange(toDo, inc);
    }
  });
  stringNStore(storageArr);
  populateStoredToDos();
}

function completedTask() {
  var toDoId = $(this).closest('.populated-todo').attr('id');
  var storageArr = getNParse();
  storageArr.find(function(toDo) {
    if (toDo.id == toDoId) {
      completedTaskChecker(toDo, toDoId);
    }
  });
  stringNStore(storageArr);
}

function completedTaskChecker(toDo, toDoId) {
  if (toDo.completed === '') {
    toDo.completed = 'completed-task';
    $(`#${toDoId}`).addClass('completed-task');
  } else {
    toDo.completed = '';
    $(`#${toDoId}`).removeClass('completed-task');
  }
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

function updateEditedTitle() {
  var toDoId = $(this).closest('.populated-todo').attr('id');
  var editedTitle = $(this).text();
  var storageArr = getNParse();
  storageArr.find(function(toDo) {
    toDo.id == toDoId ? toDo.title = editedTitle : toDo.title;
  });
  stringNStore(storageArr);
}

function updateEditedTask() {
  var toDoId = $(this).closest('.populated-todo').attr('id');
  var editedTitle = $(this).text();
  var storageArr = getNParse();
  storageArr.forEach(function(toDo) {
    toDo.id == toDoId ? toDo.task = editedTitle : toDo.task;
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
  if ($('.title-input').val() && $('.task-input').val()) {
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

function importanceFilter() {
  var clickedImportance = $(this).attr('class').split(' ')[0];
  $('.importance').each(function() {
    if($(this).text().toLowerCase() === clickedImportance) {
      $(this).closest('.populated-todo').fadeIn();
    } else {
      $(this).closest('.populated-todo').fadeOut();
    }
  });
}

function showAllToDos() {
  populateStoredToDos();
}

function toggleShowButton() {
  if ($('.populated-todos--container').children().length >= 10) {
    $('.show-more-btn').show();
  } else {
    $('.show-more-btn').hide();
  }
}

function showAll() {
  $('.populated-todos--container').children().show();
  $('.show-more-btn').slideUp(500);
}

function onlyDisplayTen() {
  $('.populated-todos--container').children(":gt(9)").hide();
  toggleShowButton();
}

function clearInputFields() {
  $('.title-input').val('');
  $('.task-input').val('');
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