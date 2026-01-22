import '@testing-library/jest-dom';
import { render } from '../src/js/index.js';


describe('render', () => {
  let list;

  beforeEach(() => {
    list = document.createElement('ul');
    document.body.appendChild(list);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('should clear the list and render tasks with correct HTML structure', () => {
    const tasks = [
      {
        id: 'task1',
        text: 'Протестировать приложение',
        priority: 'high',
        createdAt: new Date('2026-01-20T06:46:36.128Z').getTime(),
      },
    ];

    render(tasks, list);

    const card = list.firstElementChild;
    expect(card).toBeInTheDocument();
    expect(card.classList.contains('card')).toBe(true);
    expect(card.classList.contains('card-priority-high')).toBe(true);
    expect(card.querySelector('span').textContent).toBe('Протестировать приложение');
    expect(card.querySelector('small').textContent).toContain('20.01.2026');
  });

  test('should clear list when tasks is empty', () => {
    list.innerHTML = '<li>Старая задача</li>';
    render([], list);
    expect(list.innerHTML).toBe('');
  });

  test('should render tasks sorted by createdAt (oldest first)', () => {
    const tasks = [
      {
        id: 'task1',
        text: 'Задача 1',
        priority: 'low',
        createdAt: 1768893000000, // 2026-01-19 21:30:00
      },
      {
        id: 'task2',
        text: 'Задача 2',
        priority: 'high',
        createdAt: 1768893600000, // 2026-01-19 21:40:00
      },
    ];

    render(tasks, list);

    const firstTask = list.firstElementChild.querySelector('span').textContent;
    const secondTask = list.lastElementChild.querySelector('span').textContent;

    expect(firstTask).toBe('Задача 1'); // ✅ старая задача первой
    expect(secondTask).toBe('Задача 2');
  });
});
