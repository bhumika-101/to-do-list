const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMessage = document.getElementById("emptyMessage");

const filterButtons = document.querySelectorAll(".filter-btn");


// Get saved tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


// Current filter
let currentFilter = "all";


// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// Display tasks
function displayTasks() {

    taskList.innerHTML = "";

    let visibleTasks = 0;


    tasks.forEach(function(task, index) {

        // Apply filters
        if (currentFilter === "pending" && task.completed) {
            return;
        }

        if (currentFilter === "completed" && !task.completed) {
            return;
        }


        visibleTasks++;


        // Create list item
        const li = document.createElement("li");


        // Checkbox
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";

        checkbox.checked = task.completed;


        // Task text
        const span = document.createElement("span");

        span.textContent = task.text;


        if (task.completed) {
            span.classList.add("completed");
        }


        // Edit button
        const editBtn = document.createElement("button");

        editBtn.textContent = "✏️";

        editBtn.classList.add("icon-btn");

        editBtn.title = "Edit task";


        // Delete button
        const deleteBtn = document.createElement("button");

        deleteBtn.textContent = "🗑️";

        deleteBtn.classList.add("icon-btn");

        deleteBtn.title = "Delete task";


        // Add elements
        li.appendChild(checkbox);

        li.appendChild(span);

        li.appendChild(editBtn);

        li.appendChild(deleteBtn);

        taskList.appendChild(li);


        // Complete task
        checkbox.addEventListener("change", function() {

            task.completed = checkbox.checked;

            saveTasks();

            displayTasks();
        });


        // Edit task
        editBtn.addEventListener("click", function() {

            const newTask = prompt(
                "Edit your task:",
                task.text
            );


            if (newTask !== null && newTask.trim() !== "") {

                task.text = newTask.trim();

                saveTasks();

                displayTasks();
            }
        });


        // Delete task
        deleteBtn.addEventListener("click", function() {

            tasks.splice(index, 1);

            saveTasks();

            displayTasks();
        });

    });


    // Count pending tasks
    const remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    }).length;


    taskCount.textContent =
        remainingTasks +
        (remainingTasks === 1 ? " task remaining" : " tasks remaining");


    // Show empty message
    if (visibleTasks === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

}


// Add task
function addTask() {

    const taskText = taskInput.value.trim();


    if (taskText === "") {
        return;
    }


    const newTask = {
        text: taskText,
        completed: false
    };


    tasks.push(newTask);

    saveTasks();


    taskInput.value = "";

    taskInput.focus();


    displayTasks();
}


// Add button
addTaskBtn.addEventListener("click", addTask);


// Press Enter to add task
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// Filter buttons
filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;


        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });


        button.classList.add("active");


        displayTasks();
    });

});


// Initial display
displayTasks();