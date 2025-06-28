
import React, { useState, useEffect } from 'react';
import { TaskCard } from '@/components/TaskCard';
import { AddTaskForm } from '@/components/AddTaskForm';
import { Check, ListTodo, Sparkles } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  createdAt: Date;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const savedTasks = localStorage.getItem('elegant-todos');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      setTasks(parsedTasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('elegant-todos', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text: string, priority: 'low' | 'medium' | 'high', category: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      priority,
      category,
      createdAt: new Date()
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const editTask = (id: string, newText: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full shadow-lg">
              <ListTodo className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Tasks
            </h1>
            <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
          </div>
          <p className="text-gray-600 text-lg font-medium">
            Stay organized and accomplish your goals, one task at a time
          </p>
        </div>

        {/* Progress Section */}
        {totalCount > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-white/20 animate-scale-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-700 font-medium">Progress Today</span>
              <span className="text-sm font-semibold text-purple-600">
                {completedCount} of {totalCount} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Add Task Form */}
        <AddTaskForm onAddTask={addTask} />

        {/* Filter Buttons */}
        {tasks.length > 0 && (
          <div className="flex justify-center gap-2 mb-6 animate-fade-in">
            {(['all', 'active', 'completed'] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 capitalize ${
                  filter === filterType
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white/60 text-gray-700 hover:bg-white/80 hover:shadow-md'
                }`}
              >
                {filterType}
                {filterType === 'completed' && completedCount > 0 && (
                  <span className="ml-2 px-2 py-1 text-xs bg-white/20 rounded-full">
                    {completedCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {filter === 'completed' ? 'No completed tasks yet' : 
                 filter === 'active' ? 'No active tasks' : 'No tasks yet'}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' ? 'Add your first task to get started!' : 
                 filter === 'active' ? 'All caught up! Great job!' : 
                 'Complete some tasks to see them here'}
              </p>
            </div>
          ) : (
            filteredTasks.map((task, index) => (
              <div 
                key={task.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <TaskCard
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onEdit={editTask}
                />
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Built with care for better productivity ✨</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
