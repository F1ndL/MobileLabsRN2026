import { createContext, useContext, useMemo, useState } from 'react';

const GameContext = createContext(null);

const initialStats = {
  score: 0,
  taps: 0,
  doubleTaps: 0,
  longPresses: 0,
  dragged: false,
  flingRight: false,
  flingLeft: false,
  resized: false,
  luckyFlings: 0,
};

const initialSettings = {
  theme: 'light',
  sound: true,
  vibration: true,
  multiplier: 1,
};

export function GameProvider({ children }) {
  const [stats, setStats] = useState(initialStats);
  const [settings, setSettings] = useState(initialSettings);
  const [lastAction, setLastAction] = useState('Зроби перший жест і збери очки');

  const addScore = (points, label) => {
    const normalizedPoints = Math.max(0, Math.round(points * settings.multiplier));

    setStats((current) => ({
      ...current,
      score: current.score + normalizedPoints,
    }));
    setLastAction(`${label}: +${normalizedPoints}`);
  };

  const registerTap = () => {
    setStats((current) => ({
      ...current,
      taps: current.taps + 1,
      score: current.score + 1 * settings.multiplier,
    }));
    setLastAction(`Коротке натискання: +${1 * settings.multiplier}`);
  };

  const registerDoubleTap = () => {
    setStats((current) => ({
      ...current,
      doubleTaps: current.doubleTaps + 1,
      score: current.score + 2 * settings.multiplier,
    }));
    setLastAction(`Подвійний клік: +${2 * settings.multiplier}`);
  };

  const registerLongPress = () => {
    setStats((current) => ({
      ...current,
      longPresses: current.longPresses + 1,
      score: current.score + 15 * settings.multiplier,
    }));
    setLastAction(`Довге натискання: +${15 * settings.multiplier}`);
  };

  const registerDrag = () => {
    setStats((current) => ({
      ...current,
      dragged: true,
    }));
    setLastAction('Об’єкт переміщено');
  };

  const registerFling = (direction) => {
    const bonus = Math.floor(Math.random() * 16) + 5;

    setStats((current) => ({
      ...current,
      flingRight: direction === 'right' ? true : current.flingRight,
      flingLeft: direction === 'left' ? true : current.flingLeft,
      luckyFlings: current.luckyFlings + (bonus >= 15 ? 1 : 0),
      score: current.score + bonus * settings.multiplier,
    }));
    setLastAction(`Свайп ${direction === 'right' ? 'вправо' : 'вліво'}: +${bonus * settings.multiplier}`);
  };

  const registerResize = () => {
    setStats((current) => ({
      ...current,
      resized: true,
      score: current.score + 8 * settings.multiplier,
    }));
    setLastAction(`Масштабування: +${8 * settings.multiplier}`);
  };

  const toggleTheme = () => {
    setSettings((current) => ({
      ...current,
      theme: current.theme === 'light' ? 'dark' : 'light',
    }));
  };

  const updateSetting = (key, value) => {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetGame = () => {
    setStats(initialStats);
    setLastAction('Прогрес скинуто');
  };

  const tasks = useMemo(
    () => [
      {
        id: 'taps',
        title: 'Зробити 10 кліків',
        description: 'Натиснути на об’єкт 10 разів.',
        progress: Math.min(stats.taps, 10),
        goal: 10,
        done: stats.taps >= 10,
      },
      {
        id: 'double-taps',
        title: 'Зробити подвійний клік 5 разів',
        description: 'Виконати 5 подвійних кліків по об’єкту.',
        progress: Math.min(stats.doubleTaps, 5),
        goal: 5,
        done: stats.doubleTaps >= 5,
      },
      {
        id: 'long-press',
        title: 'Утримувати об’єкт 3 секунди',
        description: 'Дочекатися бонусу за LongPressGestureHandler.',
        progress: Math.min(stats.longPresses, 1),
        goal: 1,
        done: stats.longPresses >= 1,
      },
      {
        id: 'drag',
        title: 'Перетягнути об’єкт',
        description: 'Перемістити фігуру по арені.',
        progress: stats.dragged ? 1 : 0,
        goal: 1,
        done: stats.dragged,
      },
      {
        id: 'fling-right',
        title: 'Зробити свайп вправо',
        description: 'Виконати швидкий свайп вправо.',
        progress: stats.flingRight ? 1 : 0,
        goal: 1,
        done: stats.flingRight,
      },
      {
        id: 'fling-left',
        title: 'Зробити свайп вліво',
        description: 'Виконати швидкий свайп вліво.',
        progress: stats.flingLeft ? 1 : 0,
        goal: 1,
        done: stats.flingLeft,
      },
      {
        id: 'resize',
        title: 'Змінити розмір об’єкта',
        description: 'Збільшити або зменшити елемент pinch-жестом.',
        progress: stats.resized ? 1 : 0,
        goal: 1,
        done: stats.resized,
      },
      {
        id: 'score',
        title: 'Отримати 100 очок',
        description: 'Набрати загалом 100 очок у лічильнику.',
        progress: Math.min(stats.score, 100),
        goal: 100,
        done: stats.score >= 100,
      },
      {
        id: 'lucky-fling',
        title: 'Власне завдання: зловити великий бонус',
        description: 'Отримати хоча б один випадковий бонус від 15 очок за свайп.',
        progress: Math.min(stats.luckyFlings, 1),
        goal: 1,
        done: stats.luckyFlings >= 1,
      },
    ],
    [stats],
  );

  const completedTasks = tasks.filter((task) => task.done).length;

  const value = useMemo(
    () => ({
      stats,
      settings,
      tasks,
      completedTasks,
      lastAction,
      addScore,
      registerTap,
      registerDoubleTap,
      registerLongPress,
      registerDrag,
      registerFling,
      registerResize,
      toggleTheme,
      updateSetting,
      resetGame,
    }),
    [stats, settings, tasks, completedTasks, lastAction],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);

  if (!context) {
    throw new Error('useGame must be used inside GameProvider');
  }

  return context;
}
