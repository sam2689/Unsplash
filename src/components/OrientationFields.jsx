const OrientationFilters = ({ selectedOrientation, onChange, disabled }) => {
  const options = [
    { value: '', label: 'All' },
    { value: 'landscape', label: 'Landscape' },
    { value: 'portrait', label: 'Portrait' },
    { value: 'squarish', label: 'Square' },
  ];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Orientation</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => !disabled && onChange(opt.value)}
            disabled={disabled}
            className={`px-3 py-1 rounded-full text-xs font-medium transition
              ${!disabled && selectedOrientation === opt.value
              ? 'ring-2 ring-blue-500 ring-offset-2'
              : 'bg-gray-100 hover:bg-gray-200'
            }
              ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-gray-100' : ''}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrientationFilters;
