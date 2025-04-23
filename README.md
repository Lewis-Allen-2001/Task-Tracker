# Task Tracker

A simple task tracker application that allows you to create tasks, set timers, and manage subtasks. The app saves your tasks in `localStorage`, so they persist even after refreshing the page.

## Features

- **Add Tasks**: Create tasks with optional timers.
- **Start/Stop Timer**: Start and stop timers for each task.
- **Subtasks**: Add and mark subtasks as completed.
- **Task Deletion**: Remove tasks from the list.
- **Persistence**: Tasks are automatically saved and persist even after a page refresh.

## Key Updates

- **Instant Refresh**: When you add a task, it appears immediately without needing to refresh the page. This is done using localStorage and task loading functions.
- **Persistent Storage**: Tasks, subtasks, and timers are saved to `localStorage`, ensuring they persist across page reloads.
- **Timer Functionality**: Tasks have timers that you can start and stop, and the timer resets when it reaches 00:00.
- **Subtask Management**: Easily add, view, and complete subtasks within each task.

## How to Use

1. **Add a Task**: Enter a task name and an optional timer value, then click "Add Task."
2. **Start/Stop Timer**: Click the "Start" or "Stop" button next to a task to control its timer.
3. **Add Subtasks**: Click the "Add Task" button inside a task to add subtasks.
4. **Delete Task**: Click the "Delete" button to remove a task.

## Live Demo

You can try the app live here: [Task Tracker Demo](https://lewis-allen-2001.github.io/Task-Tracker/)

---

Enjoy tracking your tasks efficiently!

