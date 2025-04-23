document.addEventListener('DOMContentLoaded', function () {
  const taskInput = document.getElementById("taskInput");
  const taskTimer = document.getElementById("taskTimer"); 
  const addTaskButton = document.getElementById("addTaskButton");
  const taskList = document.getElementById("taskList");
  const notificationSound = document.getElementById("notificationSound");

 //load the tasks from localStorage when the page loads
  // and create the task elements
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(({ text, completed, subtasks, timer, running }) => {
      createTaskElement(text, completed, subtasks, timer, running);
    });
  }


  //save the tasks to localStorage when a task is added, deleted, or modified
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


  function createTaskElement(
    taskText,
    completed = false,
    subtasks = [],
    timer = "00:00",
    running = false
  ) {
    const taskItem = document.createElement("li");
    taskItem.classList.add("task"); // 👈 Ensures styling is applied
    taskItem.dataset.id = crypto.randomUUID();
  
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
  
    // Toggle completion
    taskItem.querySelector(".task-header span").addEventListener("click", function () {
      this.classList.toggle("completed");
      saveTasks();
    });
  
    // Delete task and stop timer
    taskItem.querySelector(".delete-task").addEventListener("click", function () {
      stopTimer(taskItem); // 👈 Stop timer if running
      taskList.removeChild(taskItem);
      saveTasks();
      showToast("Task deleted ✅"); // 👈 Toast notification
    });
  
    // Toggle subtasks
    taskItem.querySelector(".toggle-subtasks").addEventListener("click", function () {
      const isExpanded = subtaskList.style.maxHeight;
      subtaskList.style.maxHeight = isExpanded ? null : subtaskList.scrollHeight + "px";
      subtaskList.style.padding = isExpanded ? "0" : "10px 0";
      this.textContent = isExpanded ? "▼" : "▲";
    });
  
    // Add subtask
    taskItem.querySelector(".add-subtask").addEventListener("click", function () {
      const subtaskText = prompt("Enter Task:");
      if (subtaskText) {
        createSubtaskElement(subtaskText, taskItem);
        saveTasks();
      }
    });
  
    // Start/Stop timer
    taskItem.querySelector(".start-timer").addEventListener("click", function () {
      startTimer(taskItem);
    });
  
    taskItem.querySelector(".stop-timer").addEventListener("click", function () {
      stopTimer(taskItem);
    });
  
    taskList.appendChild(taskItem);
  
    if (running && timer !== "00:00") {
      startTimer(taskItem, true);
    }
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.style.background = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "10px 16px";
    toast.style.marginTop = "10px";
    toast.style.borderRadius = "8px";
    toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
  
    const container = document.getElementById("toast-container");
    container.appendChild(toast);
  
    
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });
  
    
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
  

 
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
        showToast("Task deleted ✅")
      });

    taskItem.querySelector(".subtask-list").appendChild(subtaskItem);
  }

 
  function addTask() {
  const taskText = taskInput.value.trim();
  const timerValue = taskTimer.value.trim();

  if (!taskText) {
    alert("Please enter a task.");
    return;
  }

  const timer = timerValue ? `${timerValue}:00` : "00:00";
  createTaskElement(taskText, false, [], timer);

  // Save tasks to localStorage after adding a new task
  saveTasks();

  // Clear input fields
  taskInput.value = "";
  taskTimer.value = "";
 
}



  
  let timers = {};

  // Start the timer countdown
  function startTimer(taskItem, resume = false) {
    const taskId = taskItem.dataset.id;
    const timerDisplay = taskItem.querySelector(".task-timer");
    let [minutes, seconds] = timerDisplay.textContent.split(":").map(Number);
    taskItem.classList.add("running");
  
    if (resume && timers[taskId]) return;
  
    timers[taskId] = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(timers[taskId]);
          delete timers[taskId];
          taskItem.classList.remove("running");
          timerDisplay.textContent = "00:00";
          timesUpMsg();
          return;
        }
        minutes--;
        seconds = 59;
      } else {
        seconds--;
      }
  
      timerDisplay.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, 1000);
    saveTasks();
  }


  function stopTimer(taskItem) {
    const taskId = taskItem.dataset.id;
    clearInterval(timers[taskId]);
    delete timers[taskId];
    taskItem.classList.remove("running");
    saveTasks();
  }
  
  function timesUpMsg() {
    const popup = document.getElementById("timesUpMsg");
    popup.style.display = "none";
    notificationSound.play();

    setTimeout(() => {
      popup.style.display = "block";
    }, 1000);

    setTimeout(() => {
      popup.style.display = "none";
    }, 10000);
  }

  addTaskButton.addEventListener("click", addTask);
  taskInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") addTask();
  });

  
  loadTasks();
});
