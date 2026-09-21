import React from 'react';
import { checkPasswordRequirements } from '../../utils/validators';

const PasswordChecklist = ({ password = '' }) => {
  if (!password) return null;

  const reqs = checkPasswordRequirements(password);

  const items = [
    { key: 'length', label: '8 to 16 characters', valid: reqs.length },
    { key: 'upper', label: 'One uppercase letter (A-Z)', valid: reqs.uppercase },
    { key: 'lower', label: 'One lowercase letter (a-z)', valid: reqs.lowercase },
    { key: 'num', label: 'One number (0-9)', valid: reqs.number },
    { key: 'special', label: 'One symbol (e.g. !@#$%^&*)', valid: reqs.special },
  ];

  return (
    <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200 mt-1.5 text-xs animate-[fadeIn_0.2s_ease-out]">
      <span className="font-bold text-amber-900 block mb-1">
        🔐 Password Security Requirements:
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
        {items.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-1.5 transition-colors ${
              item.valid ? 'text-emerald-700 font-semibold' : 'text-gray-500'
            }`}
          >
            <span className="text-sm leading-none font-bold">
              {item.valid ? '✓' : '○'}
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordChecklist;
