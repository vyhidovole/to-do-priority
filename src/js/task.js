//task.js
import { nanoid } from 'nanoid'; 


/**
 * Добавляет задачу в массив и возвращает обновлённый массив с уникальным ID.
 * @param {Array<{id: string, text: string}>} tasks - Массив задач.
 * @param {string} task - Текст новой задачи.
 * @param {string} priority - Приоритет задачи: 'low', 'medium', 'high'. По умолчанию 'low'.
 * @returns {Array<{id: string, text: string,priority:string,createdAt:Date()}>} - Обновлённый массив задач.
 */
export function addTask(tasks, task, priority='low') {
  const newTask={
    id: nanoid(),
    text: task,
    priority:priority,
    createdAt:  Date.now(),
  }
  console.log('Добавлена задача:', newTask)
  return [...tasks, newTask];
}

/**
 * Экспортирует задачи в виде CSV строки в нижнем регистре.
 * @param {Array<{id: string, text: string, priority:string, createdAt: Date}>} tasks - Массив задач.
 * @returns {string} - CSV строка в нижнем регистре.
 */
export function exportLowerCasedCSV(tasks = []) {
  return tasks.map(task => 
    `${task.text.toLowerCase()},${task.priority},${task.createdAt.toISOString()}`).join("\n");
}
