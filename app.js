document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const addTaskButton = document.getElementById("addTaskButton");
  const taskList = document.getElementById("taskList");

  // Load tasks from localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(function (task) {
      createTaskElement(task.text, task.completed, task.subtasks);
    });
  }

  // Save tasks to localStorage
  function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll(".task").forEach(function (taskItem) {
      const taskContent = taskItem.querySelector(".task-header span");
      const subtasks = [];
      taskItem
        .querySelectorAll(".subtask-item")
        .forEach(function (subtaskItem) {
          const subtaskContent = subtaskItem.querySelector("span");
          subtasks.push({
            text: subtaskContent.textContent,
            completed: subtaskContent.classList.contains("completed"),
          });
        });
      tasks.push({
        text: taskContent.textContent,
        completed: taskContent.classList.contains("completed"),
        subtasks: subtasks,
      });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Function to create a new task element
  function createTaskElement(taskText, completed = false, subtasks = []) {
    const taskItem = document.createElement("li");
    taskItem.className = "task";

    const taskHeader = document.createElement("div");
    taskHeader.className = "task-header";

    const taskContent = document.createElement("span");
    taskContent.textContent = taskText;
    if (completed) {
      taskContent.classList.add("completed");
    }

    const toggleSubtaskButton = document.createElement("button");
    toggleSubtaskButton.textContent = "▼"; // Toggle icon
    toggleSubtaskButton.style.marginLeft = "10px";
    toggleSubtaskButton.style.cursor = "pointer";

    const addSubtaskButton = document.createElement("button");
    addSubtaskButton.textContent = "Add Task";
    addSubtaskButton.style.marginLeft = "10px";
    addSubtaskButton.style.cursor = "pointer";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.color = "#ff0000";
    deleteButton.style.border = "none";
    deleteButton.style.background = "none";
    deleteButton.style.cursor = "pointer";

    // Mark task as completed when clicked
    taskContent.addEventListener("click", function () {
      taskContent.classList.toggle("completed");
      saveTasks(); // Save tasks to localStorage
    });

    // Delete task when delete button is clicked
    deleteButton.addEventListener("click", function () {
      taskList.removeChild(taskItem);
      saveTasks(); // Save tasks to localStorage
    });

    // Function to toggle subtasks visibility
    function toggleSubtasks() {
      const subtaskList = taskItem.querySelector(".subtask-list");
      if (subtaskList.style.display === "none") {
        subtaskList.style.display = "block";
        toggleSubtaskButton.textContent = "▲"; // Change icon
      } else {
        subtaskList.style.display = "none";
        toggleSubtaskButton.textContent = "▼"; // Change icon
      }
    }

    // Function to add a new subtask
    function addSubtask() {
      const subtaskText = prompt("Enter Task:");
      if (subtaskText) {
        createSubtaskElement(subtaskText, taskItem);
        saveTasks();
      }
    }

    // Add subtask when button is clicked
    addSubtaskButton.addEventListener("click", addSubtask);

    // Toggle subtasks when toggle button is clicked
    toggleSubtaskButton.addEventListener("click", toggleSubtasks);

    taskHeader.appendChild(taskContent);
    taskHeader.appendChild(toggleSubtaskButton);
    taskHeader.appendChild(addSubtaskButton);
    taskHeader.appendChild(deleteButton);
    taskItem.appendChild(taskHeader);

    const subtaskList = document.createElement("ul");
    subtaskList.className = "subtask-list";

    // Load existing subtasks
    subtasks.forEach(function (subtask) {
      createSubtaskElement(subtask.text, taskItem, subtask.completed);
    });

    taskItem.appendChild(subtaskList);
    taskList.appendChild(taskItem);
  }

  // Function to create a new subtask element
  function createSubtaskElement(subtaskText, taskItem, completed = false) {
    const subtaskItem = document.createElement("li");
    subtaskItem.className = "subtask-item";

    const subtaskContent = document.createElement("span");
    subtaskContent.textContent = subtaskText;
    if (completed) {
      subtaskContent.classList.add("completed");
    }

    const deleteSubtaskButton = document.createElement("button");
    deleteSubtaskButton.textContent = "Delete";
    deleteSubtaskButton.style.color = "#ff0000";
    deleteSubtaskButton.style.border = "none";
    deleteSubtaskButton.style.background = "none";
    deleteSubtaskButton.style.cursor = "pointer";

    // Mark subtask as completed when clicked
    subtaskContent.addEventListener("click", function () {
      subtaskContent.classList.toggle("completed");
      saveTasks(); // Save tasks to localStorage
    });

    // Delete subtask when delete button is clicked
    deleteSubtaskButton.addEventListener("click", function () {
      taskItem.querySelector(".subtask-list").removeChild(subtaskItem);
      saveTasks(); // Save tasks to localStorage
    });

    subtaskItem.appendChild(subtaskContent);
    subtaskItem.appendChild(deleteSubtaskButton);
    taskItem.querySelector(".subtask-list").appendChild(subtaskItem);
  }

  // Function to add a new task
  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") {
      alert("Please enter a task.");
      return;
    }

    createTaskElement(taskText);
    saveTasks(); // Save tasks to localStorage
    taskInput.value = ""; // Clear input field
  }

  // Add task when button is clicked
  addTaskButton.addEventListener("click", addTask);

  // Optionally, add task when Enter key is pressed
  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTask();
    }
  });

  // Load tasks when the app is loaded
  loadTasks();
});
