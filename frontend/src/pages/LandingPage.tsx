import { Server, Terminal, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0A0B1A] text-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#8B5CF6] rounded-full filter blur-[128px] opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#4C1D95] rounded-full filter blur-[128px] opacity-20"></div>
      </div>

      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Server className="w-8 h-8 text-[#8B5CF6]" />
          <span className="text-xl font-bold">DevOpsLearn</span>
        </div>
        <div className="flex items-center gap-6">
          <Link
            to="/login" 
            className="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg hover:bg-[#7C3AED] transition-colors flex items-center gap-2"
          >
            Get Started <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8">
            <Terminal className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-sm">Master DevOps with Hands-on Labs</span>
          </div>
          <h1 className="text-6xl font-bold leading-tight mb-6">
            Learn{' '}
            <span className="text-[#8B5CF6]">DevOps Skills</span> – Boost Your Career with{' '}
            <span className="bg-gradient-to-r from-[#8B5CF6] to-[#4C1D95] text-transparent bg-clip-text">Real-world Projects!</span>
          </h1>
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto">
            Enroll in our comprehensive DevOps course and gain expertise through interactive labs, live projects, 
            and hands-on experiences tailored for real-world applications.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to={'/login'} className="bg-[#8B5CF6] text-white px-8 py-4 rounded-lg hover:bg-[#7C3AED] transition-colors flex items-center gap-2 text-lg font-medium">
              Start Now
              <ChevronRight className="w-5 h-5" />
            </Link>
            {/* <button className="border border-[#8B5CF6] text-[#8B5CF6] px-8 py-4 rounded-lg hover:bg-[#8B5CF6] hover:text-white transition-colors text-lg font-medium">
              Watch Demo
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}
