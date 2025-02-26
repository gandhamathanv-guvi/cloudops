import { useEffect, useState } from 'react';
import { Terminal, BookOpen, Award, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const {user} = useAuth()

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("user AUTH", user)
        const response = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`);
        const data = await response.json();
        setCourses(data.courses);
        setAchievements(data.achievements);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  if (!user) {
    return <div className="text-center text-white p-10">Loading Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a061e] text-white">
      <nav className="px-6 py-4 border-b border-purple-500/20 backdrop-blur-md bg-[#0a061e]/80 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Terminal className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">DevOpsLearn</span>
          </div>
          <div className="flex items-center space-x-6">
            {/* <button className="flex items-center space-x-2 hover:text-purple-400 transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button> */}
            <button className="flex items-center space-x-2 hover:text-purple-400 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="relative mb-12 rounded-2xl overflow-hidden w-full">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-blue-900/40"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=2000&q=80')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.4)'
            }}
          />

          <div className="relative px-8 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <img src={user.avatar} alt={user.name} className="w-28 h-28 rounded-full mx-auto border-4 border-purple-500" />
              <h1 className="text-4xl font-bold mt-4">Welcome {user.name}</h1>
              <p className="text-purple-200">Keep up the great work on your learning journey!</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold flex items-center mb-4">
            <BookOpen className="w-6 h-6 mr-2 text-purple-500" /> In Progress Learning Paths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => (
              <Link to={`/course/${course.courseId}`} key={course.id} className="bg-[#1a1533] p-6 rounded-xl border border-purple-500/20">
                <img src={course.image} alt={course.title} className="w-full h-40 object-cover rounded-md" />
                <h3 className="mt-4 text-lg font-semibold">{course.title}</h3>
                <p className="text-sm text-gray-400">{course.provider}</p>
                <div className="w-full bg-purple-500/20 rounded-full h-2 mt-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold flex items-center mb-4">
            <Award className="w-6 h-6 mr-2 text-purple-500" /> Recent Achievements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-[#1a1533] p-6 rounded-xl border border-purple-500/20 text-center">
                <Award className="w-10 h-10 text-purple-500 mx-auto mb-2" />
                <h3 className="font-semibold text-lg">{achievement.title}</h3>
                <p className="text-sm text-gray-400">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
