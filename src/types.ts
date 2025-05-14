export interface Task {
    id: number;
    name: string;
    text: string;
    department: string;
    assignee: string;
    status: TaskStatus;
    createdAt: Date;
    updatedAt: Date | null;
  }
  
  export interface Worker {
    id: number;
    name: string;
    telegram: string;
    department: string;
  }
  
  export type TaskStatus = 'Нужно сделать' | 'В процессе' | 'На проверке' | 'Сделано';
  export type TabType = 'tasks' | 'workers';
  
  export interface NewTask {
    name: string;
    text: string;
    department: string;
    assignee: string;
    status: TaskStatus;
  }
  
  export interface NewWorker {
    name: string;
    telegram: string;
    department: string;
  }