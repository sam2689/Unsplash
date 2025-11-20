import { useTheme } from "../hooks/useTheme";

export default function ColorFilter({ value, onChange }) {
  const { isDark } = useTheme();

  const colors = [
    { name: "Any", value: "", hex: isDark ? "#bbb" : "#333" },
    { name: "B&W", value: "black_and_white", hex: "linear-gradient(45deg, #000, #fff)" },
    { name: "Black", value: "black", hex: "#000000" },
    { name: "White", value: "white", hex: "#ffffff" },
    { name: "Yellow", value: "yellow", hex: "#f9d71c" },
    { name: "Orange", value: "orange", hex: "#f39c12" },
    { name: "Red", value: "red", hex: "#e74c3c" },
    { name: "Purple", value: "purple", hex: "#8e44ad" },
    { name: "Magenta", value: "magenta", hex: "#ff00ff" },
    { name: "Green", value: "green", hex: "#2ecc71" },
    { name: "Teal", value: "teal", hex: "#1abc9c" },
    { name: "Blue", value: "blue", hex: "#3498db" },
  ];

  return (
    <div className="mb-8">
      <h3 className={`mb-6 font-semibold text-xl ${isDark ? "text-gray-100" : "text-gray-900"}`}>
        Color
      </h3>

      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isActive = value === color.value;
          return (
            <button
              key={color.value}
              onClick={() => onChange(color.value)}
              className={`
                relative flex flex-col items-center p-3 rounded-2xl transition-all duration-200
                border-2 ${isActive
                ? 'border-blue-500 shadow-md scale-105'
                : 'border-transparent hover:border-gray-300 hover:scale-102'
              }
                ${isDark
                ? 'bg-gray-800 hover:bg-gray-700'
                : 'bg-white hover:bg-gray-50'
              }
                min-w-[80px]
              `}
            >
              {/* Индикатор выбора */}
              {isActive && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
              )}

              {/* Цветной круг */}
              <div
                className="w-12 h-12 rounded-full mb-2 shadow-sm"
                style={{
                  background: color.hex,
                  border: color.hex === "#ffffff" ? "1px solid #e5e5e5" : "none",
                }}
              ></div>

              {/* Название */}
              <span className={`text-sm font-medium ${
                isActive
                  ? 'text-blue-600'
                  : isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}