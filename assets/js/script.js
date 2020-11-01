var taskIdCounter = 0;
var formE1 = document.querySelector("#task-form");
var tasksToDoE1 = document.querySelector("#tasks-to-do");
var pageContentE1 = document.querySelector("#page-content");
var tasksInProgressE1 = document.querySelector("#tasks-in-progress");
var tasksCompletedE1 = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    // check if input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }

    var isEdit = formE1.hasAttribute("data-task-id");

    // has data attribute, so get task id and call function to complete edit process
    if (isEdit) {
        var taskId = formE1.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);
    }
   // no data attribute, so create object as normal and pass to createTaskE1 function
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskE1(taskDataObj);
    }
    
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    formE1.reset();
};

var createTaskE1 = function(taskDataObj) {
     // create list item
     var listItemE1 = document.createElement("li");
     listItemE1.className = "task-item";

     // add task id as a custom attribute
     listItemE1.setAttribute("data-task-id", taskIdCounter);
     listItemE1.setAttribute("draggable", "true");
     
     // create div to hold task info and add to list item
     var taskInfoE1 = document.createElement("div");
     // give it a class naem
     taskInfoE1.className = "task-info";
     // add HTML content to div
     taskInfoE1.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span";
      
     listItemE1.appendChild(taskInfoE1);

     taskDataObj.id = taskIdCounter;

     tasks.push(taskDataObj);

     saveTasks();

     var taskActionsE1 = createTaskActions(taskIdCounter);
     listItemE1.appendChild(taskActionsE1);
 
     // add entire list item to list
     tasksToDoE1.appendChild(listItemE1);
     
     // increase task counter for next unique id
     taskIdCounter++;
};

var createTaskActions = function(taskId) {
    var actionContainerE1 = document.createElement("div");
    actionContainerE1.className = "task-actions";

    // create edit button
    var editButtonE1 = document.createElement("button");
    editButtonE1.textContent = "Edit";
    editButtonE1.className = "btn edit-btn";
    editButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(editButtonE1);

    //create delete button
    var deleteButtonE1 = document.createElement("button");
    deleteButtonE1.textContent = "Delete";
    deleteButtonE1.className = "btn delete-btn";
    deleteButtonE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild (deleteButtonE1);

    var statusSelectE1 = document.createElement("select");
    statusSelectE1.className = "select-status";
    statusSelectE1.setAttribute("name", "status-change");
    statusSelectE1.setAttribute("data-task-id", taskId);

    actionContainerE1.appendChild(statusSelectE1);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionE1 = document.createElement("option");
        statusOptionE1.textContent = statusChoices[i];
        statusOptionE1.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectE1.appendChild(statusOptionE1);
    }

    return actionContainerE1;
}

var deleteTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // create a new array to hold updated lists of tasks
    var updatedTaskArr = [];

    // loop through current tasks
    for (var i = 0; i < tasks.length; i++) {
        //if tasks[i].id doesnt match the value of taskId, let's keep that task and push it into a new array
        if (tasksp[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }

    //rassign tasks array to be the same as updatedTaskArr
    tasks = updatedTaskArr;

    saveTasks();
};

var editTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formE1.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array and task object with new content
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };

    saveTasks();

    alert("Task Updated!");

    formE1.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";
};

var taskStatusChangeHandler = function(event) {
    // get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected option's value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on the id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoE1.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressE1.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedE1.appendChild(taskSelected);
    }

    // update task's in tasks array
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

var taskButtonHandler = function(event) {
    // get target element from event
    var targetE1 = event.target;

    if (targetE1.matches(".edit-btn")) {
        // get the element's task id
        var taskId = targetE1.getAttribute("data-task-id");
        editTask(taskId);
    }

    else if (targetE1.matches(".delete-btn")) {
        // get the element's task id
        var taskId = targetE1.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
    var getId = event.dataTransfer.getData("text/plain");
};

var dropZoneDragHandler = function(event) {
    var taskListE1 = event.target.closest(".task-list");
    if (taskListE1) {
        event.preventDefault();
        taskListE1.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

var dropTaskHandler = function(event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']");
    var dropZoneE1 = event.target.closest(".task-list");
    var statusType = dropZoneE1.id;
    // set status of task based on dropZone id
    var statusSelectE1 = draggableElement.querySelector("select[name='status-change']");
    if (statusType === "tasks-to-do") {
        statusSelectE1.selectedIndex = 0;
    }
    else if (statusType === "tasks-in-progress") {
        statusSelectE1.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectE1.selectedIndex = 2;
    }
    dropZoneE1.removeAttribute("style");
    dropZoneE1.appendChild(draggableElement);

    // loop through tasks array to find and update the updated task's status
    for (var i = 0; i < tasks.length; i++) {
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectE1.value.toLowerCase();
        }
    }

    saveTasks();
};

var dragLeaveHandler = function(event) {
    var taskListE1 = event.target.closest(".task-list");
    if (taskListE1) {
        taskListE1.removeAttribute("style");
    }
}

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
    // Get task items from localStorage
    var savedTasks = localStorage.getItem("tasks");
 
    if (!savedTasks) {
        return false
    }
    // Converts tasks from the string format back into an array of objects
    savedTasks = JSON.parse(savedTasks);

    // loop through savedTasks array
    for (var i = 0; i < savedTasks.length; i++) {
        // pass each task object into the 'createTaskE1()' function
        createTaskE1(savedTasks[i]);    
    }
}

pageContentE1.addEventListener("change", taskStatusChangeHandler);

formE1.addEventListener("submit", taskFormHandler);

pageContentE1.addEventListener("click", taskButtonHandler);

pageContentE1.addEventListener("dragstart", dragTaskHandler);

pageContentE1.addEventListener("dragover", dropZoneDragHandler);

pageContentE1.addEventListener("drop", dropTaskHandler);

pageContentE1.addEventListener("dragleave", dragLeaveHandler);

pageContentE1.addEventListener("loadTasks", loadTasks);

loadTasks();