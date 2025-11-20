import {useTheme} from '../hooks/useTheme';
import {useTranslation} from '../hooks/useTranslation';
import {useDispatch, useSelector} from 'react-redux';
import {setLanguage} from '../redux/reducers/appSettings';
import Moon from '../assets/icons/moon.svg?react';
import Sun from '../assets/icons/sun.svg?react';

const SettingsModal = ({isOpen, onClose}) => {
  const {theme, isDark, toggleTheme} = useTheme();
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector(state => state.appSettings.language);

  if (!isOpen) return null;

  const languages = [
    {code: 'en', name: t('language.en'), flag: '🇺🇸'},
    {code: 'ru', name: t('language.ru'), flag: '🇷🇺'}
  ];

  const themes = [
    {id: 'light', name: t('theme.light'), icon: Sun},
    {id: 'dark', name: t('theme.dark'), icon: Moon}
  ];

  const handleLanguageChange = (lang) => {
    dispatch(setLanguage(lang));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className={`rounded-xl max-w-md w-full max-h-[90vh] overflow-hidden ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        <div className={`p-6 border-b ${
          isDark ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className="text-xl font-bold">Settings</h2>
          <p className={isDark ? 'text-gray-300 mt-1' : 'text-gray-600 mt-1'}>
            Customize your experience
          </p>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-96">
          <div>
            <h3 className="text-lg font-semibold mb-3">Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((themeOption) => {
                const IconComponent = themeOption.icon;
                const isSelected = theme === themeOption.id;

                return (
                  <button
                    key={themeOption.id}
                    onClick={() => themeOption.id !== theme && toggleTheme()}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : isDark
                          ? 'border-gray-600 bg-gray-700 hover:border-gray-500'
                          : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      <IconComponent
                        className={`w-6 h-6 ${
                          isSelected
                            ? 'text-blue-600'
                            : isDark
                              ? 'text-white'
                              : 'text-gray-900'
                        }`}
                      />
                    </div>
                    <div className="font-medium text-center">{themeOption.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Language</h3>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    language === lang.code
                      ? 'bg-blue-100 text-blue-700 border border-blue-300'
                      : isDark
                        ? 'bg-gray-700 hover:bg-gray-600 border border-gray-600'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                    {language === lang.code && (
                      <span className="ml-auto text-blue-500">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`p-6 border-t ${
          isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'
        }`}>
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;