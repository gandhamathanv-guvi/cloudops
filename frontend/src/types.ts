export interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  imageUrl: string;
  objectives: string[];
  prerequisites: string[];
  methodology: string;
  technicalRequirements: string[];
}

export interface User {
  name: string;
  avatar: string;
}