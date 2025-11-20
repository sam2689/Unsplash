// components/DownloadModal.jsx
import {useState} from 'react';
import {useTheme} from '../hooks/useTheme';
import ConfirmModal from './ConfirmModal';
import DownloadService from "../API/download.js";

const DownloadModal = ({isOpen, onClose, photo}) => {
  const {isDark} = useTheme();
  const [selectedQuality, setSelectedQuality] = useState('regular');
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const qualityOptions = DownloadService.getQualityOptions();

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const result = await DownloadService.downloadImage(photo, selectedQuality);

      if (!result.success) {
        alert(`Download failed: ${result.error}`);
      }

    } catch (error) {
      console.error('Download process error:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
      setShowConfirm(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className={`rounded-xl max-w-md w-full ${isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className="text-xl font-bold">Download Photo</h3>
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose download quality
            </p>
          </div>

          <div className="p-6 space-y-4">
            {qualityOptions.map(option => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="quality"
                  value={option.value}
                  checked={selectedQuality === option.value}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="font-medium">{option.label}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {option.size} • {DownloadService.estimateFileSize(option.value)}
                  </div>
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className={`p-6 border-t ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                disabled={isDownloading}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                } ${isDownloading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isDownloading}
                className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors ${
                  isDownloading
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-blue-700'
                }`}
              >
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onConfirm={handleDownload}
        onCancel={() => setShowConfirm(false)}
        message={
          <div className="space-y-2">
            <div className="text-gray-600 leading-relaxed">
              Download photo in <strong>{qualityOptions.find(q => q.value === selectedQuality)?.label}</strong> quality?
            </div>
            <div className="text-sm text-gray-500">
              Estimated size: {DownloadService.estimateFileSize(selectedQuality)}
            </div>
          </div>
        }
        type="info"
        confirmText={isDownloading ? "Downloading..." : "Download"}
        cancelText="Cancel"
        isConfirmDisabled={isDownloading}
      />
    </>
  );
};

export default DownloadModal;