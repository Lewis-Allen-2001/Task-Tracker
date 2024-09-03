document.addEventListener("DOMContentLoaded", function () {
  const taskInput = document.getElementById("taskInput");
  const taskTimer = document.getElementById("taskTimer"); // New timer input
  const addTaskButton = document.getElementById("addTaskButton");
  const taskList = document.getElementById("taskList");
  const notificationSound = document.getElementById("notificationSound");

  // Load tasks from localStorage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(({ text, completed, subtasks, timer, running }) => {
      createTaskElement(text, completed, subtasks, timer, running);
    });
  }

  // Save tasks to localStorage
  function saveTasks() {
    const tasks = Array.from(taskList.querySelectorAll(".task")).map(
      (taskItem) => {
        const taskContent = taskItem.querySelector(".task-header span");
        const subtasks = Array.from(
          taskItem.querySelectorAll(".subtask-item")
        ).map((subtaskItem) => {
          const subtaskContent = subtaskItem.querySelector("span");
          return {
            text: subtaskContent.textContent,
            completed: subtaskContent.classList.contains("completed"),
          };
        });
        const timer = taskItem.querySelector(".task-timer").textContent;
        const running = taskItem.classList.contains("running");
        return {
          text: taskContent.textContent,
          completed: taskContent.classList.contains("completed"),
          subtasks: subtasks,
          timer: timer,
          running: running,
        };
      }
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Create a new task element
  function createTaskElement(
    taskText,
    completed = false,
    subtasks = [],
    timer = "00:00",
    running = false
  ) {
    const taskItem = document.createElement("li");
    taskItem.className = `task ${running ? "running" : ""}`;
    taskItem.innerHTML = `
      <div class="task-header">
        <span class="${completed ? "completed" : ""}">${taskText}</span>
        <span class="task-timer">${timer}</span>
        <button class="start-timer">Start</button>
        <button class="stop-timer">Stop</button>
        <button class="toggle-subtasks">▼</button>
        <button class="add-subtask">Add Task</button>
        <button class="delete-task" style="color: #ff0000; background: none; border: none; cursor: pointer;">Delete</button>
      </div>
      <ul class="subtask-list" style="max-height: 0; overflow: hidden; transition: max-height 0.3s ease-out, padding 0.3s ease-out;"></ul>
    `;

    const subtaskList = taskItem.querySelector(".subtask-list");
    subtasks.forEach(({ text, completed }) =>
      createSubtaskElement(text, taskItem, completed)
    );

    taskItem
      .querySelector(".task-header span")
      .addEventListener("click", function () {
        this.classList.toggle("completed");
        saveTasks();
      });

    taskItem
      .querySelector(".delete-task")
      .addEventListener("click", function () {
        taskList.removeChild(taskItem);
        saveTasks();
      });

    taskItem
      .querySelector(".toggle-subtasks")
      .addEventListener("click", function () {
        const isExpanded = subtaskList.style.maxHeight;
        subtaskList.style.maxHeight = isExpanded
          ? null
          : subtaskList.scrollHeight + "px";
        subtaskList.style.padding = isExpanded ? "0" : "10px 0";
        this.textContent = isExpanded ? "▼" : "▲";
      });

    taskItem
      .querySelector(".add-subtask")
      .addEventListener("click", function () {
        const subtaskText = prompt("Enter Task:");
        if (subtaskText) {
          createSubtaskElement(subtaskText, taskItem);
          saveTasks();
        }
      });

    taskItem
      .querySelector(".start-timer")
      .addEventListener("click", function () {
        startTimer(taskItem);
      });

    taskItem
      .querySelector(".stop-timer")
      .addEventListener("click", function () {
        stopTimer(taskItem);
      });

    taskList.appendChild(taskItem);

    if (running && timer !== "00:00") {
      startTimer(taskItem, true);
    }
  }

  // Function to create a new subtask element
  function createSubtaskElement(subtaskText, taskItem, completed = false) {
    const subtaskItem = document.createElement("li");
    subtaskItem.className = "subtask-item";
    subtaskItem.innerHTML = `
      <span class="${completed ? "completed" : ""}">${subtaskText}</span>
      <button class="delete-subtask" style="color: #ff0000; background: none; border: none; cursor: pointer;">Delete</button>
    `;

    subtaskItem.querySelector("span").addEventListener("click", function () {
      this.classList.toggle("completed");
      saveTasks();
    });

    subtaskItem
      .querySelector(".delete-subtask")
      .addEventListener("click", function () {
        subtaskItem.remove();
        saveTasks();
      });

    taskItem.querySelector(".subtask-list").appendChild(subtaskItem);
  }

  // Add a new task
  function addTask() {
    const taskText = taskInput.value.trim();
    const timerValue = taskTimer.value.trim();

    if (!taskText) {
      alert("Please enter a task.");
      return;
    }

    const timer = timerValue ? `${timerValue}:00` : "00:00";
    createTaskElement(taskText, false, [], timer);

    saveTasks();
    taskInput.value = ""; // Clear input field
    taskTimer.value = ""; // Clear timer field
  }

  // Timer variables
  let timers = {};

  // Start the timer countdown
  function startTimer(taskItem, resume = false) {
    const timerDisplay = taskItem.querySelector(".task-timer");
    let [minutes, seconds] = timerDisplay.textContent.split(":").map(Number);
    taskItem.classList.add("running");

    if (resume && timers[taskItem]) {
      return; // Timer is already running
    }

    timers[taskItem] = setInterval(function () {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timers[taskItem]);
          delete timers[taskItem];
          taskItem.classList.remove("running");
          timerDisplay.textContent = "00:00";
          showAlert("Time's up! You have earned yourself a break!");
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }

      timerDisplay.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);

    saveTasks();
  }

  // Stop the timer countdown
  function stopTimer(taskItem) {
    clearInterval(timers[taskItem]);
    delete timers[taskItem];
    taskItem.classList.remove("running");
    saveTasks();
  }

  // Show alert and play sound
  function showAlert(message) {
    alert(message);
    notificationSound.play();
  }

  // Event listeners
  addTaskButton.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") addTask();
  });

  // Initial load of tasks
  loadTasks();
});
