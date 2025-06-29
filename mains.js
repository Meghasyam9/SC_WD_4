const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const addBtn = document.getElementById('addBtn');
const resetAllBtn = document.getElementById('resetAll');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

addBtn.addEventListener('click', addTask);
resetAllBtn.addEventListener('click', resetAllTasks);

// INITIAL RENDER
renderTasks();

// ADD NEW TASK
function addTask() {
  const taskText = taskInput.value.trim();
  const date = dateInput.value;
  const time = timeInput.value;

  if (!taskText) return;

  const task = {
    id: Date.now(),
    text: taskText,
    date: date,
    time: time,
    status: 'pending',
  };
  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
}

// RENDER TASKS
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="task-details">
        <span class="task-text">${task.text}</span> | 
        <span class="task-date">${task.date || 'No Date'}</span> | 
        <span class="task-time">${task.time || 'No Time'}</span>
      </div>
      <div>
        Status:
        <label><input type="radio" name="status-${task.id}" value="pending" ${task.status === 'pending' ? 'checked' : ''}> Pending</label>
        <label><input type="radio" name="status-${task.id}" value="completed" ${task.status === 'completed' ? 'checked' : ''}> Completed</label>
        <button class="edit">✏️</button>
        <button class="delete">❌</button>
      </div>
    `;
    taskList.appendChild(li);

    // Event Listeners
    li.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        task.status = e.target.value;
        saveTasks();
        renderTasks();
      });
    });

    li.querySelector('.edit').addEventListener('click', () => {
      const newText = prompt('Edit task:', task.text);
      const newDate = prompt('Edit date (YYYY-MM-DD):', task.date || '');
      const newTime = prompt('Edit time (HH:MM):', task.time || '');
      if (newText) {
        task.text = newText.trim();
        task.date = newDate.trim() || '';
        task.time = newTime.trim() || '';
        saveTasks();
        renderTasks();
      }
    });

    li.querySelector('.delete').addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    highlightOverdue(li, task.date, task.time);
    if (task.status === 'completed') {
      li.classList.add('completed');
    }
  });
}

// HIGHLIGHT OVERDUE TASKS
function highlightOverdue(li, dateStr, timeStr) {
  if (dateStr && timeStr) {
    const deadline = new Date(`${dateStr}T${timeStr}`);
    if (new Date() > deadline) {
      li.classList.add('overdue');
    } else {
      li.classList.remove('overdue');
    }
  }
}

// SAVE TO LOCAL STORAGE
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// RESET ALL TASKS
function resetAllTasks() {
  tasks = [];
  saveTasks();
  renderTasks();
  taskInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
}
