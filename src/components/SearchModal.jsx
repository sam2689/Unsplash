import React, {useState, useEffect} from 'react';

const SearchModal = ({isOpen, onClose, onSearch, currentQuery}) => {
  const [searchTerm, setSearchTerm] = useState(currentQuery || '');

  const recentSearches = [
    'car',
    'white image of people in facebook',
    'default image of stickman',
    'default image'
  ];

  const trendingSearches = [
    'christmas background',
    'clothe',
    'halloween',
    'haunted house',
    'pattaya'
  ];

  const trendingTopics = [
    {name: 'Line Art', count: '30'},
    {name: 'Wallpapers', count: '1.2M'},
    {name: 'Flat', count: '45K'}
  ];

  const trendingCollections = [
    {name: 'Red Light', count: '428 images'},
    {name: 'Indoors', count: '183 images'},
    {name: 'Through a Rainy Window', count: '95 images'},
    {name: 'Autumn Watch Wallpapers', count: '45 images'},
    {name: 'Ghouls & Ghosts', count: '32 images'}
  ];

  useEffect(() => {
    if (isOpen) {
      setSearchTerm(currentQuery || '');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentQuery]);

  const handleSearch = (term) => {
    if (term.trim()) {
      const updatedRecent = [term, ...recentSearches.filter(item => item !== term)].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updatedRecent));

      onSearch(term);
    }
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      handleSearch(searchTerm);
    }
  };

  const clearRecentSearches = () => {
    localStorage.removeItem('recentSearches');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-start justify-center pt-16"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl w-full max-w-4xl mx-4 shadow-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search photos and illustrations"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full pl-10 pr-4 py-4 text-lg border-0 focus:ring-0 focus:outline-none placeholder-gray-400"
              autoFocus
            />
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-medium text-gray-900">Recent Searches</h3>
              <button
                onClick={clearRecentSearches}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2">
              {recentSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors group"
                >
                  <svg className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24"
                       stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span className="flex-1 truncate">{term}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Trending Searches</h3>
            <div className="space-y-2">
              {trendingSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(term)}
                  className="w-full flex items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="flex-1">{term}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Trending Topics</h3>
            <div className="space-y-2">
              {trendingTopics.map((topic, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(topic.name)}
                  className="w-full flex justify-between items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>{topic.name}</span>
                  <span className="text-sm text-gray-500">{topic.count}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Trending Collections</h3>
            <div className="space-y-2">
              {trendingCollections.map((collection, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(collection.name)}
                  className="w-full flex justify-between items-center px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span>{collection.name}</span>
                  <span className="text-sm text-gray-500">{collection.count}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;