const topics = [
  'React Native',
  'Expo',
  'Навігація',
  'Продуктивність',
  'Мобільна розробка',
  'JavaScript',
  'UI компоненти',
  'Оптимізація',
];

const summaries = [
  'Практичний приклад роботи зі списками, станом екрана та передачею параметрів.',
  'Огляд підходів, які допомагають зберігати швидкість застосунку на великих наборах даних.',
  'Коротке пояснення архітектури екранів і зручної взаємодії користувача з меню.',
  'Матеріал демонструє, як будувати стабільні мобільні інтерфейси без зайвого навантаження.',
];

export function generateNewsPage(page = 1, pageSize = 12) {
  const start = (page - 1) * pageSize;

  return Array.from({ length: pageSize }, (_, index) => {
    const itemNumber = start + index + 1;
    const topic = topics[itemNumber % topics.length];

    return {
      id: `news-${itemNumber}`,
      title: `${topic}: новина ${itemNumber}`,
      description: summaries[itemNumber % summaries.length],
      image: `https://picsum.photos/seed/mobile-lab-${itemNumber}/320/220`,
      author: itemNumber % 2 === 0 ? 'Редакція Mobile Labs' : 'React Native Digest',
      publishedAt: `20.05.2026, ${String(8 + (itemNumber % 10)).padStart(2, '0')}:30`,
    };
  });
}
