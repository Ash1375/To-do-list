
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AddTaskFormProps {
  onAddTask: (text: string, priority: 'low' | 'medium' | 'high', category: string) => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text.trim(), priority, category.trim());
      setText('');
      setCategory('');
      setPriority('medium');
      setIsExpanded(false);
    }
  };

  const categories = ['Work', 'Personal', 'Health', 'Learning', 'Shopping', 'Other'];

  return (
    <Card className="mb-6 bg-white/70 backdrop-blur-sm border-white/20 shadow-sm animate-scale-in">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder="What would you like to accomplish today?"
              className="flex-1 px-4 py-3 text-lg border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-white/80"
            />
            <Button
              type="submit"
              disabled={!text.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
          </div>

          {isExpanded && (
            <div className="flex gap-4 pt-2 animate-fade-in">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${
                        priority === level
                          ? level === 'high' ? 'bg-red-500 text-white shadow-md' :
                            level === 'medium' ? 'bg-yellow-500 text-white shadow-md' :
                            'bg-green-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category (Optional)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none bg-white/80"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
