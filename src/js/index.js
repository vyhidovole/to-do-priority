// src/js/index.js

// Функция добавления задачи — из task.js
import { addTask } from './task.js';


// Локальные переменные
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 👇 Локальная функция — НЕ экспортируется!
// === RENDER TASKS ===
export function render(tasks, targetList) {
  if (!targetList) return;

  targetList.innerHTML = '';

  // Сортируем по дате создания (новые — сверху)
  const sortedTasks = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

  sortedTasks.forEach(task => {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = `task-item card card-priority-${task.priority}`;

    // Текст задачи
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    // Иконка редактирования
    const editIcon = document.createElement('span');
    editIcon.className = 'task-icon task-icon-edit';
    editIcon.textContent = '✏️';
    editIcon.setAttribute('aria-label', 'Редактировать задачу');

    // Иконка удаления
    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'task-icon task-icon-delete';
    deleteIcon.textContent = '🗑️';
    deleteIcon.setAttribute('aria-label', 'Удалить задачу');

    // Дата создания
    const taskDate = document.createElement('small');
    taskDate.className = 'task-date';
    taskDate.textContent = new Date(task.createdAt).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Собираем всё в li
    li.appendChild(taskText);
    li.appendChild(editIcon);
    li.appendChild(deleteIcon);
    li.appendChild(taskDate);

    targetList.appendChild(li);
  });

  // Экспорт в CSV/JSON
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

// === Обработка удаления и редактирования ===
const list = document.getElementById('tasks-list');
if (list) {
  list.addEventListener("click", (event) => {
    // Ищем ближайший предок с классом иконки
    const deleteIcon = event.target.closest('.task-icon-delete');
    const editIcon = event.target.closest('.task-icon-edit');

   if (deleteIcon) {
  const item = deleteIcon.closest('.task-item');
  item.classList.add('removing');
  setTimeout(() => {
    const idToRemove = item.dataset.id;
    tasks = tasks.filter(task => task.id !== idToRemove);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    render(tasks, list);
  }, 300);
}

    if (editIcon) {
      const idToEdit = editIcon.closest('.task-item').dataset.id;
      const task = tasks.find(t => t.id === idToEdit);

      if (!task) return;

      const newText = prompt("Редактировать задачу:", task.text);

      if (newText === null || newText.trim() === "") return;

      tasks = tasks.map(t =>
        t.id === idToEdit ? { ...t, text: newText.trim() } : t
      );

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
