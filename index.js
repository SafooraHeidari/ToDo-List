// Elements
const body = document.getElementsByTagName('body')[0];
const dark = document.getElementById('dark--mode--icon');
const light = document.getElementById('light--mode--icon');
const header = document.getElementById('todo-list--header');
const footer = document.getElementById('todo-list--footer');
const toDoList = document.getElementById('todo-list');
const input = document.getElementsByTagName('input')[0];
const filtAll = document.getElementById('filter-all');
const filtActive = document.getElementById('filter-active');
const filtComplete = document.getElementById('filter-completed');
const taskNum = document.getElementById('tasks-left');
const filterOptions = document.querySelector('.filters');
const clearComp = document.getElementById('tasks-complete');


// Classes
const check = "check-circle";
const uncheck = "uncheck-circle";
const lineThrough = "line-through";

let todoTasks = [];
let id = 0;
let count = 0;

let data = localStorage.getItem("TODO");
// let dataCntr = localStorage.getItem("cntr");


try{
    let tododata = JSON.parse(data);
    // let cntData = JSON.parse(dataCntr);
    id += tododata.length;
    // count += cntData;
    // typeTaskNum(count);

    tododata.forEach(function (item){
        todoTasks.push(item)
    })
    loadList(todoTasks);
}catch (e){
    console.log(e.message)
}

function loadList(array) {
    array.forEach(function (item) {
        addTask(item.name, item.id, item.done, item.trash)
    })
}

function changeMode() {
    if (light.style.display !== 'inline-block') {
        body.classList.remove('light--mode');
        body.classList.add('dark--mode');
        light.style.display = 'inline-block';
        dark.style.display = 'none';
        header.style.background = '#25273c';
        header.style.boxShadow = '0 35px 50px rgba(0,0,0,.501961)';
        footer.style.background = '#25273c';
        toDoList.style.background = '#25273c';
        toDoList.style.boxShadow = '0 35px 50px rgba(0,0,0,.501961)';
    } else {
        body.classList.remove('dark--mode');
        body.classList.add('light--mode');
        dark.style.display = 'inline-block';
        light.style.display = 'none';
        header.style.background = '#ffffff';
        footer.style.background = '#ffffff';
        toDoList.style.background = '#ffffff';
    }
}

function addTask(todo, id, done, trash) {
    if (trash) return;
    const DONE = done ? check : uncheck;
    const LINE = done ? lineThrough : "";
    const item = `<li class="item">
            <img class="todo-check--box ${DONE}" onclick="taskDone(this)" id = ${id} src="https://img.icons8.com/ios/24/000000/circled.png"/>
            <span class="todo-check--text ${LINE}"> ${todo} </span>
            <img class = "close--task" onclick="taskRemove(this)" id = ${id}  src="https://img.icons8.com/ios/24/000000/multiply.png"/>
            <div class="divider"></div>
            </li>`;
    const position = "beforeend";
    toDoList.insertAdjacentHTML(position, item);
}

document.addEventListener("keypress", function (event) {
    if (event.key === 'Enter') {
        const todo = input.value;
        if (todo === "" || todo === " ") return;
        todoTasks.push({
            name: todo,
            id: id,
            done: false,
            trash: false,
        })
        addTask(todo, id, false, false);
        localStorage.setItem("TODO", JSON.stringify(todoTasks));
        count++;
        // localStorage.setItem("cntr",JSON.stringify(count))
        typeTaskNum(count);
        id++;
        input.value = '';
    }
})

function taskDone(element) {
    element.classList.toggle(check);
    element.classList.toggle(uncheck);
    element.parentNode.querySelector(".todo-check--text").classList.toggle(lineThrough);
    todoTasks[element.id].done ? count++ : count--;
    // localStorage.setItem("cntr",JSON.stringify(count))
    typeTaskNum(count)
    todoTasks[element.id].done = !todoTasks[element.id].done;
    localStorage.setItem("TODO", JSON.stringify(todoTasks));
}

function taskRemove(element) {
    element.parentNode.parentNode.removeChild(element.parentNode);
    todoTasks[element.id].trash = true;
    if (!(todoTasks[element.id].done)) {
        count--;
        // localStorage.setItem("cntr",JSON.stringify(count))
        typeTaskNum(count);
    }
    localStorage.setItem("TODO", JSON.stringify(todoTasks));
}

filterOptions.addEventListener('click', function (e) {
    while (toDoList.hasChildNodes()) {
        toDoList.removeChild(toDoList.lastChild);
    }
    switch (e.target.value) {
        case "filter-all":
            filtAll.classList.add('active')
            filtComplete.classList.remove('active')
            filtActive.classList.remove('active')
            break;
        case "filter-completed":
            filtAll.classList.remove('active')
            filtComplete.classList.add('active')
            filtActive.classList.remove('active')
            break;
        case "filter-active":
            filtAll.classList.remove('active')
            filtComplete.classList.remove('active')
            filtActive.classList.add('active')
            break;
    }

    todoTasks.forEach(function (item) {
        switch (e.target.value) {
            case "filter-all":
                addTask(item.name, item.id, item.done, item.trash)
                break;

            case "filter-completed":
                if (item.done) {
                    addTask(item.name, item.id, item.done, item.trash)
                }

                break;
            case "filter-active":
                if (!item.done) {
                    addTask(item.name, item.id, item.done, item.trash)
                }
                break;
        }
    })
})

clearComp.addEventListener('click', function (e) {
    while (toDoList.hasChildNodes()) {
        toDoList.removeChild(toDoList.lastChild);
    }
    todoTasks.forEach(function (item) {
        if (item.done && !(item.trash)) {
            item.trash = true
            count--
            // localStorage.setItem("cntr",JSON.stringify(count))
            typeTaskNum(count)
        }
        addTask(item.name, item.id, item.done, item.trash)
    })
    localStorage.setItem("TODO", JSON.stringify(todoTasks));
})

function typeTaskNum(count) {
    taskNum.innerHTML = '';
    taskNum.innerHTML = `${count} items left`;
}


// drag and drop
new Sortable(toDoList, {
    animation: 150,
    group: 'shared',
    ghostClass: 'blue-background-class'
})








