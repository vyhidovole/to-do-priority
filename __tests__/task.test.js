
import { addTask } from '../src/js/task.js';
import '@testing-library/jest-dom'; // 👈 ДОБАВЬ ЭТУ СТРОЧКУ!



jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mock-id-123'),
}));

describe('addTask', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return a new array with the added task', () => {
    const tasks = [{ id: 'old-1', text: 'Починить лампу', priority: 'high' }];
    const result = addTask(tasks, 'Купить молоко');

    expect(result).not.toBe(tasks);
    expect(result.length).toBe(2);
  });

  test('should add task with correct structure', () => {
    const tasks = [];
    const result = addTask(tasks, 'Сделать уроки', 'high');

    const addedTask = result[0];
    expect(addedTask.id).toBe('mock-id-123');
    expect(addedTask.text).toBe('Сделать уроки');
    expect(addedTask.priority).toBe('high');
    expect(addedTask.createdAt).toBeGreaterThan(0); 
  });
});
