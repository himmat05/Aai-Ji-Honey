import React from 'react';

const INDIAN_STATES = [
  'Rajasthan',
  'Gujarat',
  'Maharashtra',
  'Delhi',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Haryana',
  'Punjab',
  'Karnataka',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'West Bengal',
  'Bihar',
  'Odisha',
  'Kerala',
  'Assam',
  'Goa',
  'Other',
];

const AddressInputFields = ({
  values,
  onChange,
  required = true,
  showPreview = true,
  compact = false,
}) => {
  const handleChange = (field, val) => {
    onChange({
      ...values,
      [field]: val,
    });
  };

  const formattedPreview = [
    values.house?.trim(),
    values.street?.trim(),
    values.area?.trim(),
    values.city?.trim() && values.state?.trim()
      ? `${values.city.trim()}, ${values.state.trim()}${values.pin?.trim() ? ' - ' + values.pin.trim() : ''}`
      : values.city?.trim() || values.state?.trim() || (values.pin?.trim() ? `PIN: ${values.pin.trim()}` : ''),
    values.country?.trim() || 'India',
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-3">
      {/* Row 1: House Address & Street */}
      <div className={`grid ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'} gap-2.5`}>
        <div>
          <label className="block text-xs font-bold text-amber-900 mb-1">
            House / Flat / Building No. {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            required={required}
            placeholder="e.g. Flat 302, Royal Residency"
            value={values.house || ''}
            onChange={(e) => handleChange('house', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs sm:text-sm bg-amber-50/40"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-amber-900 mb-1">
            Street / Road Name {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            required={required}
            placeholder="e.g. MG Road, Near Jain Temple"
            value={values.street || ''}
            onChange={(e) => handleChange('street', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs sm:text-sm bg-amber-50/40"
          />
        </div>
      </div>

      {/* Row 2: Area / Colony & City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <div>
          <label className="block text-xs font-bold text-amber-900 mb-1">
            Area / Colony / Landmark
          </label>
          <input
            type="text"
            placeholder="e.g. Vaishali Nagar"
            value={values.area || ''}
            onChange={(e) => handleChange('area', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs sm:text-sm bg-amber-50/40"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-amber-900 mb-1">
            City / Town {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            required={required}
            placeholder="e.g. Jaipur"
            value={values.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs sm:text-sm bg-amber-50/40"
          />
        </div>
      </div>

      {/* Row 3: State, PIN Code & Country */}
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-xs font-bold text-amber-900 mb-1">
            State {required && <span className="text-red-500">*</span>}
          </label>
          <select
            required={required}
            value={values.state || 'Rajasthan'}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full px-2.5 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs sm:text-sm bg-amber-50/40"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-amber-900 mb-1">
            PIN Code {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            required={required}
            maxLength={6}
            placeholder="302001"
            value={values.pin || ''}
            onChange={(e) => handleChange('pin', e.target.value.replace(/\D/g, ''))}
            className="w-full px-2.5 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs sm:text-sm bg-amber-50/40 font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-amber-900 mb-1">Country</label>
          <input
            type="text"
            readOnly
            value={values.country || 'India'}
            className="w-full px-2.5 py-2 rounded-xl border border-amber-200 text-xs sm:text-sm bg-gray-100 text-gray-700 cursor-not-allowed"
          />
        </div>
      </div>

      {/* Live Formatted Address Preview */}
      {showPreview && formattedPreview && (
        <div className="bg-amber-100/70 p-2.5 rounded-xl border border-amber-300 text-xs">
          <span className="font-bold text-amber-900 block mb-0.5">
            📦 Combined Delivery Address:
          </span>
          <p className="text-amber-950 font-medium leading-relaxed break-words">
            {formattedPreview}
          </p>
        </div>
      )}
    </div>
  );
};

export default AddressInputFields;
