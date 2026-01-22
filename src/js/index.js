// src/js/index.js

// Функция добавления задачи — из task.js
import { addTask } from './task.js';

// Локальные переменные
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 👇 Локальная функция — НЕ экспортируется!
export function render(tasks, targetList) {
  if (!targetList) return;

  targetList.innerHTML = '';

  // Сортируем по дате создания (старые — сверху)
  const sortedTasks = [...tasks].sort((a, b) => a.createdAt - b.createdAt);

  sortedTasks.forEach(task => {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = `card card-priority-${task.priority}`; // ✅ КЛАССЫ НА <li>!

    li.innerHTML = `
      <span>${task.text}</span>
      <small>${new Date(task.createdAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })}</small>
      <button class="delete-btn" data-id="${task.id}">Удалить</button>
    `;

    targetList.appendChild(li);
  });

  // Экспорт в CSV
  const exportedJson = document.getElementById('exported-json');
  if (exportedJson) {
    const csvRows = [
      'id,text,priority,createdAt',
      ...sortedTasks.map(t =>
        `"${t.id}","${t.text.replace(/"/g, '""')}","${t.priority}","${new Date(t.createdAt).toISOString()}"`
      )
    ];
    exportedJson.textContent = csvRows.join('\n');
  }
}

// === Инициализация формы ===
const form = document.querySelector("#tasks-list-form");
const itemName = document.querySelector("#item-name");

if (form && itemName) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskText = itemName.value.trim();
    if (!taskText) return;

    const selectedPriority = document.querySelector('input[name="priority"]:checked')?.value || 'low';

    tasks = addTask(tasks, taskText, selectedPriority);
    itemName.value = "";

    localStorage.setItem('tasks', JSON.stringify(tasks));
    const list = document.getElementById('tasks-list');
    render(tasks, list);
  });
}

// === Обработка удаления ===
const list = document.getElementById('tasks-list');
if (list) {
  list.addEventListener("click", (event) => {
    if (event.target.classList.contains("delete-btn")) {
      const idToRemove = event.target.dataset.id;
      tasks = tasks.filter(task => task.id !== idToRemove);

      localStorage.setItem('tasks', JSON.stringify(tasks));
      render(tasks, list);
    }
  });
}

// === Инициализация при загрузке ===
const initList = document.getElementById('tasks-list');
if (initList) {
  render(tasks, initList);
}
