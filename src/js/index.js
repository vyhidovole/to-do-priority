// src/js/index.js

// Функция добавления задачи — из task.js
import { addTask } from './task.js';


// Локальные переменные
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];


// === RENDER TASKS ===
export function render(tasks, targetList, sortOption = 'time') {
  if (!targetList) return;

  targetList.innerHTML = '';

  // Копируем массив, чтобы не мутировать оригинал
  let sortedTasks = [...tasks];

  // Сортировка по выбранному критерию
  if (sortOption === 'prior') {
    // Приоритет: high > medium > low
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    sortedTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
  } else {
    // По умолчанию — по времени создания (новые сверху)
    sortedTasks.sort((a, b) => b.createdAt - a.createdAt);
  }

  sortedTasks.forEach(task => {
    const li = document.createElement('li');
    li.dataset.id = task.id;
    li.className = `card card-priority-${task.priority}`;

    // Текст задачи
    const taskText = document.createElement('span');
    taskText.className = 'task-text';
    taskText.textContent = task.text;

    // Иконка редактирования
    const editIcon = document.createElement('span');
    editIcon.className = 'task-icon task-icon-edit';
    editIcon.textContent = '✏️';
    editIcon.setAttribute('aria-label', 'Редактировать задачу');//Позволяет пользователям с нарушениями зрения понять, что делает иконка  (a11y) 

    // Иконка удаления
    const deleteIcon = document.createElement('span');
    deleteIcon.className = 'task-icon task-icon-delete';
    deleteIcon.textContent = '🗑️';
    deleteIcon.setAttribute('aria-label', 'Удалить задачу');//Позволяет пользователям с нарушениями зрения понять, что делает иконка  (a11y) 

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
    const currentSort = sortSelect?.value || 'time'; // ← ДОБАВИЛИ ЭТО
    render(tasks, list, currentSort);
    showNotification('Задача добавлена!', 'success');
  });
  
}
// === Сортировка ===
const sortSelect = document.getElementById('sort');
if (sortSelect) {
  sortSelect.addEventListener('change', () => {
    render(tasks, list); // Перерисуем с текущей сортировкой
  });
}


// === Обработка удаления и редактирования ===
const list = document.getElementById('tasks-list');
if (list) {
  list.addEventListener("click", (event) => {
    // Ищем ближайший предок с классом иконки
    const deleteIcon = event.target.closest('.card .task-icon-delete');// значит: “внутри карточки найди кнопку”.(с пробелом!)
    const editIcon = event.target.closest('.card .task-icon-edit');

    if (deleteIcon) {
      const item = deleteIcon.closest('.card');
      item.classList.add('removing');
      setTimeout(() => {
        const idToRemove = item.dataset.id;
        tasks = tasks.filter(task => task.id !== idToRemove);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const currentSort = sortSelect?.value || 'time'; // ← ДОБАВИЛИ ЭТО
        render(tasks, list, currentSort);
        showNotification('Задача удалена!', 'error');
      }, 300);
    }

    if (editIcon) {
      const idToEdit = editIcon.closest('.card').dataset.id;
      const task = tasks.find(t => t.id === idToEdit);

      if (!task) return;

      const newText = prompt("Редактировать задачу:", task.text);

      if (newText === null || newText.trim() === "") return;

      tasks = tasks.map(t =>
        t.id === idToEdit ? { ...t, text: newText.trim() } : t
      );

      localStorage.setItem('tasks', JSON.stringify(tasks));
       const currentSort = sortSelect?.value || 'time'; // ← ДОБАВИЛИ ЭТО
      render(tasks, list, currentSort);
      showNotification('Задача обновлена!', 'success');
    }
  });
}
// === Уведомление ===
const notification = document.getElementById('notification');
const notificationText = document.querySelector('.notification-text');

function showNotification(message, type = 'info') {
  if (!notification || !notificationText) return;
  notification.classList.remove('success', 'error', 'info');
  notification.classList.add(type);
  notificationText.textContent = message;
  notification.classList.remove('hidden');
  notification.classList.add('visible');

  // Автоматически скрыть через 3 секунды
  setTimeout(() => {
    notification.classList.remove('visible');
    setTimeout(() => notification.classList.add('hidden'), 300);
  }, 3000);//?
}

// === Инициализация при загрузке ===
const initList = document.getElementById('tasks-list');
if (initList) {
   const currentSort = sortSelect?.value || 'time'; // ← ДОБАВИЛИ ЭТО
  render(tasks, initList, currentSort);
}
