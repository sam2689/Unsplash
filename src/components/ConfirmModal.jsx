const ConfirmModal = ({
                        isOpen,
                        onConfirm,
                        onCancel,
                        message,
                        title = "Confirm Action",
                        type = "danger",
                        confirmText = "Confirm",
                        cancelText = "Cancel"
                      }) => {
  if (!isOpen) return null;

  const typeConfig = {
    danger: {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      ),
      iconColor: "text-red-500",
      iconBg: "bg-red-50",
      buttonColor: "bg-red-600 hover:bg-red-700",
      titleColor: "text-red-700"
    },
    warning: {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-50",
      buttonColor: "bg-yellow-600 hover:bg-yellow-700",
      titleColor: "text-yellow-700"
    },
    info: {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
      titleColor: "text-blue-700"
    },
    success: {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      ),
      iconColor: "text-green-500",
      iconBg: "bg-green-50",
      buttonColor: "bg-green-600 hover:bg-green-700",
      titleColor: "text-green-700"
    }
  };

  const config = typeConfig[type] || typeConfig.danger;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center p-6 border-b border-gray-100">
          <div className={`flex items-center justify-center w-10 h-10 ${config.iconBg} rounded-lg mr-4`}>
            <svg className={`w-5 h-5 ${config.iconColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {config.icon}
            </svg>
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${config.titleColor}`}>{title}</h3>
          </div>
        </div>

        <div className="p-6">
          <div className="text-gray-600 leading-relaxed">{message}</div>
        </div>

        <div className="flex space-x-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onCancel}
            className="flex-1 bg-white text-gray-700 py-3 px-4 rounded-xl font-medium border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 ${config.buttonColor} text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;