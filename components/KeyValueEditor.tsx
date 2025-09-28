
import React from 'react';
import type { KeyValuePair } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface KeyValueEditorProps {
  items: KeyValuePair[];
  onChange: (items: KeyValuePair[]) => void;
}

export const KeyValueEditor: React.FC<KeyValueEditorProps> = ({ items, onChange }) => {

  const handleItemChange = <T extends keyof KeyValuePair>(index: number, field: T, value: KeyValuePair[T]) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const addItem = () => {
    onChange([...items, { id: crypto.randomUUID(), key: '', value: '', enabled: true }]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };
  
  return (
    <div className="p-4 space-y-2">
      {items.map((item, index) => (
        <div key={item.id} className="flex items-center space-x-2">
           <input
            type="checkbox"
            checked={item.enabled}
            onChange={(e) => handleItemChange(index, 'enabled', e.target.checked)}
            className="form-checkbox h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500"
          />
          <input
            type="text"
            placeholder="Key"
            value={item.key}
            onChange={(e) => handleItemChange(index, 'key', e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
          />
          <input
            type="text"
            placeholder="Value"
            value={item.value}
            onChange={(e) => handleItemChange(index, 'value', e.target.value)}
            className="flex-1 bg-gray-700 border border-gray-600 rounded-md px-3 py-1 focus:outline-none focus:ring-1 focus:ring-cyan-500 text-sm"
          />
          <button onClick={() => removeItem(index)} className="text-gray-500 hover:text-red-400">
            <TrashIcon className="w-5 h-5"/>
          </button>
        </div>
      ))}
      <button onClick={addItem} className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 text-sm font-semibold">
        <PlusIcon className="w-4 h-4"/>
        <span>Add</span>
      </button>
    </div>
  );
};
