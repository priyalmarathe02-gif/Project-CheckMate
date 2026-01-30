// Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

// Theme handling
function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    if (themeToggle) themeToggle.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    if (themeToggle) themeToggle.textContent = '🌙';
  }
  localStorage.setItem('checkmate_theme', theme);
  if (window.updateBlobColors) window.updateBlobColors();
}

themeToggle?.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  applyTheme(isDark ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('checkmate_theme');
if (savedTheme) applyTheme(savedTheme);
else applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

// Add task on button click or Enter key
addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

// Add task function
function addTask(taskText, completed = false) {
  if (typeof taskText !== 'string') taskText = taskInput.value.trim();
  if (!taskText) return;

  const li = document.createElement('li');
  if (completed) li.classList.add('completed');

  // Task Text
  const span = document.createElement('span');
  span.textContent = taskText;
  span.style.cursor = 'pointer';

  // Edit Button
  const editBtn = document.createElement('button');
  editBtn.textContent = '✎';
  editBtn.classList.add('edit-btn');
  editBtn.onclick = () => {
    const newTask = prompt('Edit your task:', span.textContent);
    if (newTask !== null && newTask.trim() !== '') {
      span.textContent = newTask.trim();
      saveTasks();
      updateCounter();
    }
  };

  // Buttons container
  const buttons = document.createElement('div');
  buttons.classList.add('buttons');

  // Complete Button
  const completeBtn = document.createElement('button');
  completeBtn.textContent = '✓';
  completeBtn.classList.add('complete-btn');
  completeBtn.onclick = () => {
    li.classList.toggle('completed');
    saveTasks();
    updateCounter();
  };

  // Delete Button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '🗑';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.onclick = () => {
    li.remove();
    saveTasks();
    updateCounter();
  };

  buttons.appendChild(completeBtn);
  buttons.appendChild(editBtn);
  buttons.appendChild(deleteBtn);

  li.appendChild(span);
  li.appendChild(buttons);

  taskList.appendChild(li);
  taskInput.value = '';
  saveTasks();
  updateCounter();
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = [];
  document.querySelectorAll('#taskList li').forEach(li => {
    tasks.push({
      text: li.querySelector('span').textContent,
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('checkmate_tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem('checkmate_tasks') || '[]');
  tasks.forEach(task => addTask(task.text, task.completed));
}

// Update task counter
function updateCounter() {
  const total = document.querySelectorAll('#taskList li').length;
  const completed = document.querySelectorAll('#taskList li.completed').length;
  const counter = document.getElementById('taskCounter');
  counter.textContent = `Tasks: ${total} | Completed: ${completed}`;
}

// Initial load
window.onload = function() {
  loadTasks();
  updateCounter();
};
