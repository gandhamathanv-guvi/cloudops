import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Hosting with Nginx',
    description: 'Learn how to set up and configure Nginx as a web server and reverse proxy.',
    difficulty: 'Intermediate',
    estimatedTime: '4 hours',
    imageUrl: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&q=80&w=500',
    objectives: [
      'Understand Nginx architecture',
      'Configure basic web server',
      'Set up reverse proxy',
      'Implement SSL/TLS'
    ],
    prerequisites: [
      'Basic Linux knowledge',
      'Command line familiarity'
    ],
    methodology: 'Hands-on learning with practical exercises and real-world scenarios',
    technicalRequirements: [
      'Linux environment',
      'Terminal access',
      'Root privileges'
    ]
  },
  {
    id: '2',
    title: 'Docker Fundamentals',
    description: 'Master containerization basics with Docker.',
    difficulty: 'Beginner',
    estimatedTime: '6 hours',
    imageUrl: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&q=80&w=500',
    objectives: [
      'Understand container concepts',
      'Build Docker images',
      'Manage containers',
      'Work with Docker Compose'
    ],
    prerequisites: [
      'Basic command line knowledge'
    ],
    methodology: 'Interactive learning with hands-on container management',
    technicalRequirements: [
      'Docker Desktop',
      'Terminal access'
    ]
  },
  {
    id: '3',
    title: 'Kubernetes for DevOps',
    description: 'Deploy and manage containerized applications at scale.',
    difficulty: 'Advanced',
    estimatedTime: '8 hours',
    imageUrl: 'https://images.unsplash.com/photo-1667372393913-84fb4f730e30?auto=format&fit=crop&q=80&w=500',
    objectives: [
      'Deploy applications to Kubernetes',
      'Manage clusters',
      'Implement scaling',
      'Handle service discovery'
    ],
    prerequisites: [
      'Docker experience',
      'Basic networking knowledge'
    ],
    methodology: 'Project-based learning with real-world cluster management',
    technicalRequirements: [
      'Minikube or similar local cluster',
      'kubectl CLI tool'
    ]
  }
];