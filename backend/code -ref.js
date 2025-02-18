import { Terminal, Cloud, Database, Star, Clock, BookOpen, Award, Server, Settings, Lock, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const LabItem = ({ icon: Icon, title, description, commands }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4">
            <Icon className="w-4 h-4 text-purple-500" />
          </div>
          <span className="font-semibold">{title}</span>
        </div>
        <div className="flex items-center text-gray-400">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 text-gray-300">
          <p className="mb-2">{description}</p>
          <div className="py-3 rounded-md text-sm font-mono space-y-2">
            {commands.map((cmd, index) => (
              <div key={index}>
                <pre className="text-purple-400">{cmd.command}</pre>
                <p className="text-gray-400 text-sm mb-2">{cmd.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const CourseOverview = () => {
  const { id } = useParams();
  const [courseData, setCourseData] = useState(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(`/api/course/${id}`);
        setCourseData(response.data);
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    };

    fetchCourseData();
  }, [id]);

  if (!courseData) {
    return <div className="min-h-screen bg-[#0A0B14] text-white flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0B14] text-white">
      <nav className="border-b border-gray-800 bg-[#0A0B14]/95 backdrop-blur-sm fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Cloud className="w-8 h-8 text-purple-500" />
              <span className="ml-2 text-xl font-bold">DevOpsLearn</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-4xl md:text-5xl font-bold mb-6">
            {courseData.title}
          </h1>

          <div className="flex justify-center items-center space-x-8 mb-8 text-gray-400">
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-500 mr-2" />
              <span>{courseData.rating} ({courseData.reviews} reviews)</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-purple-500 mr-2" />
              <span>{courseData.duration}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="w-5 h-5 text-purple-500 mr-2" />
              <span>{courseData.level}</span>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-8">
            <h2 className="text-2xl font-bold mb-6">Hands-on Labs</h2>
            <div className="space-y-4">
              {courseData.labs.map((lab, index) => (
                <LabItem
                  key={index}
                  icon={Server}
                  title={lab.title}
                  description={lab.description}
                  commands={lab.commands}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseOverview;
