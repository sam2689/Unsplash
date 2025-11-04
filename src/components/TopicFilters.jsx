import { useEffect, useState } from "react";
import UnsplashApi from "../API/api.js"

const TopicsFilters = ({ selectedTopic, onChange, disabled }) => {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    ( async () => {
      try {
        const data = await UnsplashApi.getTopics();
        setTopics(data.slice(0, 10)); // первые 10 тем
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Topics</h3>
      <div className="flex flex-wrap gap-2">
        {topics.map(topic => (
          <button
            key={topic.id}
            onClick={() => !disabled && onChange(topic.slug)}
            disabled={disabled}
            className={`px-3 py-1 rounded-full text-xs font-medium transition
              ${!disabled && selectedTopic === topic.slug
              ? 'ring-2 ring-blue-500 ring-offset-2'
              : 'bg-gray-100 hover:bg-gray-200'
            }
              ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-gray-100' : ''}`}
          >
            {topic.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopicsFilters;
