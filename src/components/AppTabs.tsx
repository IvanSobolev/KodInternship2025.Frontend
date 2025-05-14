import type { TabType } from '../types';

interface AppTabsProps {
  tab: TabType;
  setTab: (tab: TabType) => void;
}

export const AppTabs = ({ tab, setTab }: AppTabsProps) => {
  return (
    <div role="tablist" className="tabs tabs-boxed mb-6">
      <button
        role="tab"
        className={`tab ${tab === 'tasks' ? 'tab-active' : ''}`}
        onClick={() => setTab('tasks')}
      >
        Задачи
      </button>
      <button
        role="tab"
        className={`tab ${tab === 'workers' ? 'tab-active' : ''}`}
        onClick={() => setTab('workers')}
      >
        Работники
      </button>
    </div>
  );
}; 