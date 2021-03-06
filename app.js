let names = {
    descriptionInput : '#in-desc',
    deadlineInput : '#in-date',
    confirmInput : '#confirm',
    todoList: '#left',
    archiveList: '#right',
    listContainer: '#list',
    container: '#container',
    alert:'.alert',
    priorityInput: '#priority-select',
    sortByName: '.sort-name',
    sortByDate: '.sort-date',
    sortByPriority: '.sort-priority',
    restore: '.restore'
}

//Task class
class Task{
    constructor(description,deadline,id=0, priority=3){
        this.description = description;
        this.deadline = deadline;
        this.id = id;
        this.priority = priority;
        this.todoHTML = '<div class="task priority-%priority-number%" id="task-%id%"><div><input type="checkbox" name="" class="do-task"><p>%description%</p></div><div><p class="date-tag">%date%</p><input type="checkbox" name="" class="delete remove-task"></div></div>';
        this.archHTML = '<div class="task" id="task-%id%"><div><p>%description%</p></div><div><input type="checkbox" name="" class="delete remove-task"></div></div>';
        
        //add priority
    }
}

//UI class
class UI{
    static displayTasks(){
        const elements = document.getElementsByClassName("task");
        while (elements.length > 0) elements[0].remove();
        const tasks = StoreToDo.getTasks();
        tasks.forEach((task)=>UI.addTaskToList(task,'todo'));
        const tasks2 = StoreDone.getTasks();
        tasks2.forEach((task)=>UI.addTaskToList(task,'done'));

    }
    static addTaskToList(task, type){
        let html = 'todoHTML';
        let List = document.querySelector(names.todoList);
        if (type == 'todo'){
            List = document.querySelector(names.todoList);
            html = 'todoHTML';
            task[html] = task[html].replace('%date%', task.deadline)
            task[html] = task[html].replace('%priority-number%', task.priority)
        }
            
        else{
            List = document.querySelector(names.archiveList);
            html = 'archHTML';
        }
        task[html] = task[html].replace('%description%', task.description)
        task[html] = task[html].replace('%id%', task.id)

        List.insertAdjacentHTML('beforeend', task[html]);
    }
    static deleteTask(el) {
        if(el.classList.contains('delete')){
            console.log(el.parentElement.parentElement.parentElement)
            if(el.parentNode.classList.contains('task'))
                el.parentElement.remove();
            else
                el.parentElement.parentElement.remove();
            UI.showAlert('Task removed','info');
        }
        else if (el.className=='do-task'){
            console.log(el.parentElement.parentElement)
            el.parentElement.parentElement.remove();
            UI.showAlert('Task done','info');
        }
        
    }
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(names.container);
        const list = document.querySelector(names.listContainer);
        container.insertBefore(div, list);

        //Vanish in 3 sec
        setTimeout( ()=>{
            document.querySelector(names.alert).remove()
        },3000)

    }
}
//Store class
class Store {
    static getTasks() {
        let tasks;
        const name = this.prototype.constructor.name;
        if(localStorage.getItem(name) === null){
            tasks = [];
        }
        else{
            tasks = JSON.parse(localStorage.getItem(name));
        }
        return tasks;
    }
    static getSpecificTask(domID){
        const id = domID.split('-')[1];
        const tasks = this.getTasks();
        let out;
        tasks.forEach((task,index)=>{
            if(task.id == id){
                out = task;
            }
        });
        return out;
    }
    static addTask(task) {
        const tasks = this.getTasks();
        tasks.push(task);
        const name = this.prototype.constructor.name;
        localStorage.setItem(name,JSON.stringify(tasks));
    }

    static removeTask(domID) {
        let tasks = this.getTasks();
        const id = domID.split('-')[1];
        const name = this.prototype.constructor.name;
        tasks.forEach((task, index)=>{
            if(task.id == id){
                tasks.splice(index,1);
            }
        });

        localStorage.setItem(name, JSON.stringify(tasks));
    }
    
}
class StoreToDo extends Store{
    static sort_by(sort, desc){
        const tasks = this.getTasks();
        //const name = this.prototype.constructor.name;
        tasks.sort(function(a,b) {
            if(a[sort]<b[sort]) return -1;
            if(a[sort]>b[sort]) return 1;
            return 0;
        });
        if (desc) tasks.reverse();
        localStorage.setItem('StoreToDo', JSON.stringify(tasks));
    }
}
class StoreDone extends Store{
    
}

//Event: display tasks
//document.addEventListener('DOMContentLoaded', UI.displayTasks);
UI.displayTasks()
//Event: add a task
document.querySelector(names.confirmInput).addEventListener('click', e=>{
    //Prevent actual submit
    //e.preventDefault();

    //Get values
    const description = document.querySelector(names.descriptionInput).value;
    const deadline = document.querySelector(names.deadlineInput).value;
    const priority = document.querySelector(names.priorityInput).value; //TODO - dodac submenu do wyboru priorytetu

    //Validation
    if(description === ''){
        UI.showAlert('Please fill the field.','warning');
    }
    // Instantiate task
    let tasks = StoreToDo.getTasks()
    let ids=[];

    //Counting ID
    let id;
    tasks.forEach((el,id)=>{
        ids.push(el.id);
    })
    if(tasks.length>0){
        id = Math.max(...ids)+1;
    }
    else{
        id = 0;
    }
    
    //New Task
    const task = new Task(description, deadline, id, priority)  //TODO dodac tu priorytet 
    //Add task to UI
    UI.addTaskToList(task,'todo');
    //Add task to store
    StoreToDo.addTask(task);
    //Clear teh field
    document.querySelector(names.descriptionInput).value = null;
    
})
//Delete task from ToDO List
document.querySelector(names.todoList).addEventListener('click', (e)=>{

    //target doest have delete then 'do task' 
    if((e.target.className.includes('do-task'))){
        console.log(e.target)
        //Get accurate task
        const taskID = e.target.parentNode.parentNode.id
        
        const task = StoreToDo.getSpecificTask(taskID);
        console.log(task)
        //Add task to UI
        UI.addTaskToList(task,'done');
        //Add task to store
        StoreDone.addTask(task);
        //Remove task from UI
        console.log(e.target)
        UI.deleteTask(e.target);//dziala tylko dla krzyzyka
        //Remove task from the Store
        domID = e.target.parentNode.parentNode.id
        StoreToDo.removeTask(domID); 

    }
    else if(e.target.className.includes('delete')){
        //Remove task from UI
        UI.deleteTask(e.target);
        //Remove task from the Store
        domID = e.target.parentNode.parentNode.id;
        StoreToDo.removeTask(domID); 
    }
    
});
//Delete task from Archival List
document.querySelector(names.archiveList).addEventListener('click', (e)=>{

        //Remove task from UI
        UI.deleteTask(e.target);
        //Remove task from the Store
        domID = e.target.parentNode.parentNode.id
        StoreDone.removeTask(domID);
});
//SORTING
//Sort elements in to do list by name
const sort_name_btn = document.querySelector(names.sortByName);
const sort_date_btn = document.querySelector(names.sortByDate);
const sort_priority_btn = document.querySelector(names.sortByPriority);
const restore_btn = document.querySelector(names.restore);

let desc = false;
sort_name_btn.addEventListener('click', ()=>{
    StoreToDo.sort_by('description', desc);
    UI.displayTasks();
    desc = !desc;
});

sort_date_btn.addEventListener('click', ()=>{
    StoreToDo.sort_by('date', desc);
    UI.displayTasks();
    desc = !desc;
});

sort_priority_btn.addEventListener('click', ()=>{
    StoreToDo.sort_by('priority', desc);
    UI.displayTasks();
    desc = !desc;
});

restore_btn.addEventListener('click', ()=>{
    StoreToDo.sort_by('id', desc);
    UI.displayTasks();
    desc = !desc;
});

