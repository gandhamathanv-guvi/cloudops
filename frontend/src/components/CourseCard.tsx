import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, BarChart } from 'lucide-react';
import { Course } from '../types';
import { Button } from './Button';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img 
        src={course.imageUrl} 
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{course.estimatedTime}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <BarChart className="w-4 h-4 mr-1" />
            <span className="text-sm">{course.difficulty}</span>
          </div>
        </div>
        <Button 
          onClick={() => navigate(`/course/${course.id}`)}
          className="w-full"
        >
          Take Course
        </Button>
      </div>
    </div>
  );
};