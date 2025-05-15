import type { TabType } from '../types';
import { MdTask, MdPeople } from 'react-icons/md';

interface AppTabsProps {
  tab: TabType;
  setTab: (tab: TabType) => void;
}

export const AppTabs = ({ tab, setTab }: AppTabsProps) => {
  return (
    <div className="flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-primary">Управление системой</h2>
      <div className="flex gap-4 mb-4">
        <button
          role="tab"
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
            tab === 'tasks' 
              ? 'bg-primary text-primary-content shadow-lg' 
              : 'bg-base-200/50 backdrop-blur-sm hover:bg-base-200'
          }`}
          onClick={() => setTab('tasks')}
        >
          <MdTask className={`text-xl ${tab === 'tasks' ? 'animate-pulse' : ''}`} />
          <span className="font-medium">Задачи</span>
        </button>
        <button
          role="tab"
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
            tab === 'workers' 
              ? 'bg-primary text-primary-content shadow-lg' 
              : 'bg-base-200/50 backdrop-blur-sm hover:bg-base-200'
          }`}
          onClick={() => setTab('workers')}
        >
          <MdPeople className={`text-xl ${tab === 'workers' ? 'animate-pulse' : ''}`} />
          <span className="font-medium">Работники</span>
        </button>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-base-300 to-transparent w-full"></div>
    </div>
  );
}; 