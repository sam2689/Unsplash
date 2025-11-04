const ColorFilters = ({selectedColor, onChange, disabled}) => {
  const colors = [
    {value: '', label: 'All', color: 'bg-gray-200'},
    {value: 'black', label: 'Black', color: 'bg-black'},
    {value: 'white', label: 'White', color: 'bg-white border border-gray-300'},
    {value: 'red', label: 'Red', color: 'bg-red-500'},
    {value: 'blue', label: 'Blue', color: 'bg-blue-500'},
    {value: 'green', label: 'Green', color: 'bg-green-500'},
    {value: 'yellow', label: 'Yellow', color: 'bg-yellow-400'},
    {value: 'purple', label: 'Purple', color: 'bg-purple-500'},
  ];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by color</h3>
      <div className="flex flex-wrap gap-2">
        {colors.map(c => (
          <button
            key={c.value}
            onClick={() => !disabled && onChange(c.value)}
            disabled={disabled}
            className={`flex items-center px-3 py-1 rounded-full text-xs font-medium transition
              ${!disabled && selectedColor === c.value
              ? 'ring-2 ring-blue-500 ring-offset-2'
              : 'bg-gray-100 hover:bg-gray-200'
            }
              ${disabled
              ? 'opacity-50 cursor-not-allowed hover:bg-gray-100'
              : ''
            }
            `}
          >
            <span className={`w-3 h-3 rounded-full mr-1 ${c.color}`}></span>
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorFilters;