let names = {
    descriptionInput : '#in-desc',
    deadlineInput : '#in-date',
    confirmInput : '#confirm',
    todoList: '#left',
    archiveList: '#right',
    listContainer: '#list',
    container: '#container',
    alert:'.alert'
}

//Task class
class Task{
    constructor(description,deadline,id=0, priority=1){
        this.description = description;
        this.deadline = deadline;
        this.id = id;
        this.priority = priority;
        this.todoHTML = '<div class="task" id="task-%id%"><div><input type="checkbox" name="" id="do-task"><p>%description%</p></div><div><p class="date-tag">%date%</p><div class="check-div"><input type="checkbox" name="" class="delete remove-task"><i class="fas fa-times checkbox-icon"></i></div></div></div>';
        this.archHTML = '<div class="task" id="task-%id%"><div><p>%description%</p></div><div><div class="check-div"><input type="checkbox" name="" class="delete remove-task"><i class="fas fa-times checkbox-icon"></i></div></div></div>';
        
        //add priority
    }
}

//UI class
class UI{
    static displayTasks(){
        const tasks = Store.getTasks();
        tasks.forEach((task)=>UI.addTaskToList(task));

    }
    static addTaskToList(task){
        const toDoList = document.querySelector(names.todoList);
        
        //archivalList = document.querySelector(DOMnames.archiveList);c
        task.todoHTML = task.todoHTML.replace('%description%', task.description)
        task.todoHTML = task.todoHTML.replace('%id%', task.id)
        
        task.todoHTML = task.todoHTML.replace('%date%', task.deadline)

        toDoList.insertAdjacentHTML('beforeend', task.todoHTML);
    }
    static deleteTask(el) {
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.parentElement.remove();
        }
        UI.showAlert('Task removed','info');
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

    static getTasks(type) {
        let tasks;
        if(localStorage.getItem('tasks') === null){
            tasks = [];
        }
        else{
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        return tasks;
    }

    static addTask(task) {
        const tasks = Store.getTasks();
        tasks.push(task);
        localStorage.setItem('tasks',JSON.stringify(tasks))
    }

    static removeTask(task) {
        const tasks = Store.getTasks();

        tasks.forEach((task, id)=>{
            if(task.id === id){
                tasks.splice(id,1);
            }
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
}


//Event: display tasks
document.addEventListener('DOMContentLoaded', UI.displayTasks);

//Event: add a task
document.querySelector(names.confirmInput).addEventListener('click', e=>{
    //Prevent actual submit
    //e.preventDefault();

    //Get values
    const description = document.querySelector(names.descriptionInput).value;
    const deadline = document.querySelector(names.deadlineInput).value;
    const priority = document.querySelector(names.deadlineInput).value; //TODO - dodac submenu do wyboru priorytetu

    //Validation
    if(description === ''){
        UI.showAlert('Please fill the field.','warning');
    }
    // Instantiate task
    let tasks = Store.getTasks()
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
    const task = new Task(description, deadline, id)  //TODO dodac tu priorytet 

    //Add task to UI
    UI.addTaskToList(task);

    //Add task to store
    Store.addTask(task);

    //Clear teh field
    document.querySelector(names.descriptionInput).value = null;
    
})
//Event: remove a task
document.querySelector(names.listContainer).addEventListener('click', (e)=>{

    //Remove task from UI
    UI.deleteTask(e.target);

    //Remove task from the Store
    id = e.target.parentNode.parentNode.parentNode.id
    Store.removeTask(id); 
    //console.log(e.target.parentNode.parentNode.parentNode.id);
}
)