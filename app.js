let $ = (selector) => document.querySelector(selector);
let $$ = (selector) => document.querySelectorAll(selector);

let input = $('input');
let todos = JSON.parse(localStorage.getItem('todo-list'));

let taskBox = $('.task-box');

let filters = $$('.filters span');

let clearAll = $('.clear-btn');

//Edit
let editId;
let isEdited = false;

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        $('span.active').classList.remove('active')
        btn.classList.add('active');
        createTodo(btn.id);
    });
});

clearAll.addEventListener('click', () => {
    todos.splice(0, todos.length);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    createTodo('all');
});

function createTodo(filters) {
    let li = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status === "completed" ? "checked" : "";
            if (filters === todo.status || filters === 'all' ) {
                li += `<li class="task">
            <label for="${id}">
                <input onclick="updateStatus(this);" ${completed} type="checkbox" id="${id}">
                <p class="${completed}">${todo.name}</p>
            </label>
            <div class="settings">
                <p onclick="showMenu(this)">...</p>
                <ul class="task-menu">
                    <li onclick="editTask(${id}, '${todo.name}')">Edit</li>
                    <li onclick="deleteTask(${id})">Delete</li>
                </ul>
            </div>
        </li>`;
            }
        });
    }
    taskBox.innerHTML = li || `<span>you do not have any task</span>`;
}
createTodo('all');

function deleteTask(selectedId) {
    todos.splice(selectedId, 1);
    localStorage.setItem('todo-list', JSON.stringify(todos));
    createTodo('all');
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEdited = true;
    input.value = taskName;
}

function showMenu(selectedList) {
    let taskMenu = selectedList.parentElement.lastElementChild;
    taskMenu.classList.add('show');
    document.addEventListener('click', e => {
        if (e.target !== selectedList) {
            taskMenu.classList.remove('show');
        }
    });
}

function updateStatus(selectedTask) {
//    add class to task

    let taskName = selectedTask.parentElement.lastElementChild;

    if (selectedTask.checked) {
        taskName.classList.add('checked');
        todos[selectedTask.id].status = 'completed';
    } else {
        taskName.classList.remove('checked');
        todos[selectedTask.id].status = 'pending';
    }
    localStorage.setItem('todo-list', JSON.stringify(todos));
}

input.addEventListener('keyup', e => {
    let inputVal = input.value.trim();
    if (e.key === "Enter") {
        if (!isEdited) {
            if (!todos) {
                todos = [];
            }
            let todoTaskList = {name: inputVal, status: 'pending'};
            todos.push(todoTaskList);
        } else {
            isEdited = false;
            todos[editId].name = inputVal;
        }
        input.value = "";
        localStorage.setItem('todo-list', JSON.stringify(todos));
        createTodo('all');
    }

});

