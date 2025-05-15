import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import type { Task } from '../types';

// Ensure this URL matches the same domain as the API
const API_URL = 'http://150.241.88.0:8080';
const HUB_URL = `${API_URL}/taskNotificationHub`;

// Set to false to enable SignalR connections
const DISABLE_SIGNALR = false;

export interface TaskUpdateMessage {
  task: Task;
  action: 'created' | 'updated' | 'deleted' | 'assigned' | 'completed' | 'reviewed';
  message: string;
}

export class SignalRService {
  private connection: HubConnection | null = null;
  private newTaskCreatedListeners: ((task: Task) => void)[] = [];
  private taskAcceptedListeners: ((task: Task, workerId: number) => void)[] = [];
  private taskStatusChangedListeners: ((data: { taskId: string; newStatus: string; assignedWorkerId?: number }) => void)[] = [];
  private connectionRetryCount = 0;
  private maxRetries = 5;
  
  // Initialize connection
  public async connect(): Promise<void> {
    if (DISABLE_SIGNALR) {
      console.log('SignalR соединения отключены в режиме разработки');
      return;
    }
    
    if (this.connection) return;
    
    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(HUB_URL)
        .withAutomaticReconnect([0, 1000, 5000, 10000, 30000]) // More aggressive reconnection strategy
        .configureLogging(LogLevel.Information)
        .build();
      
      // Register event handlers
      this.connection.on('NewTaskCreated', (task: Task) => {
        console.log('Получена новая задача:', task);
        this.newTaskCreatedListeners.forEach(listener => listener(task));
      });
      
      this.connection.on('TaskAccepted', (task: Task, workerId: number) => {
        console.log('Задача принята:', task, 'работником:', workerId);
        this.taskAcceptedListeners.forEach(listener => listener(task, workerId));
      });
      
      this.connection.on('TaskStatusChanged', (data: { taskId: string; newStatus: string; assignedWorkerId?: number }) => {
        console.log('Статус задачи изменен:', data);
        this.taskStatusChangedListeners.forEach(listener => listener(data));
      });
      
      // Add connection status change handlers
      this.connection.onreconnecting((error) => {
        console.warn('Переподключение к SignalR:', error);
      });
      
      this.connection.onreconnected((connectionId) => {
        console.log('SignalR успешно переподключен. ID соединения:', connectionId);
      });
      
      this.connection.onclose((error) => {
        console.error('SignalR соединение закрыто:', error);
        this.retryConnection();
      });
      
      // Start the connection
      await this.connection.start();
      console.log('SignalR соединение установлено');
      this.connectionRetryCount = 0;
      
    } catch (error) {
      console.error('Ошибка при установке SignalR соединения:', error);
      this.retryConnection();
    }
  }
  
  // Retry connection with exponential backoff
  private retryConnection(): void {
    if (this.connectionRetryCount < this.maxRetries) {
      this.connectionRetryCount++;
      const delay = Math.min(1000 * Math.pow(2, this.connectionRetryCount), 30000);
      
      console.log(`Повторная попытка подключения через ${delay}ms (попытка ${this.connectionRetryCount}/${this.maxRetries})`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    }
  }
  
  // Disconnect
  public async disconnect(): Promise<void> {
    if (DISABLE_SIGNALR) return;
    if (!this.connection) return;
    
    try {
      await this.connection.stop();
      this.connection = null;
      console.log('SignalR соединение разорвано');
    } catch (error) {
      console.error('Ошибка при отключении SignalR:', error);
    }
  }
  
  // Add new task created listener
  public addNewTaskCreatedListener(listener: (task: Task) => void): void {
    this.newTaskCreatedListeners.push(listener);
  }
  
  // Remove new task created listener
  public removeNewTaskCreatedListener(listener: (task: Task) => void): void {
    this.newTaskCreatedListeners = this.newTaskCreatedListeners.filter(l => l !== listener);
  }
  
  // Add task accepted listener
  public addTaskAcceptedListener(listener: (task: Task, workerId: number) => void): void {
    this.taskAcceptedListeners.push(listener);
  }
  
  // Remove task accepted listener
  public removeTaskAcceptedListener(listener: (task: Task, workerId: number) => void): void {
    this.taskAcceptedListeners = this.taskAcceptedListeners.filter(l => l !== listener);
  }
  
  // Add task status changed listener
  public addTaskStatusChangedListener(listener: (data: { taskId: string; newStatus: string; assignedWorkerId?: number }) => void): void {
    this.taskStatusChangedListeners.push(listener);
  }
  
  // Remove task status changed listener
  public removeTaskStatusChangedListener(listener: (data: { taskId: string; newStatus: string; assignedWorkerId?: number }) => void): void {
    this.taskStatusChangedListeners = this.taskStatusChangedListeners.filter(l => l !== listener);
  }
  
  // Check if connection is active
  public isConnected(): boolean {
    return this.connection?.state === 'Connected';
  }
}

// Export singleton
export const signalRService = new SignalRService();