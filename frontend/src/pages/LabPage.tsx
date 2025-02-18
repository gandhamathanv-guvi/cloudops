import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Terminal, CheckCircle2, XCircle, Clock, Activity, ArrowRight, Copy, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

export const LabPage = () => {
  const { labId } = useParams(); // Assuming labId is passed via URL
  const [labData, setLabData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1]);
  const [verificationStatus, setVerificationStatus] = useState<Record<number, 'pending' | 'success' | 'failed'>>({});

  useEffect(() => {
    const fetchLabData = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/labs/${labId}`);
        setLabData(response.data);
      } catch (error) {
        console.error('Error fetching lab data:', error);
      }
    };

    if (labId) {
      fetchLabData();
    }
  }, [labId]);

  useEffect(() => {
    let interval: number;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const toggleStep = (stepId: number) => {
    setExpandedSteps((prev) =>
      prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]
    );
  };

  const verifyStep = (stepId: number) => {
    setVerificationStatus((prev) => ({
      ...prev,
      [stepId]: Math.random() > 0.5 ? 'success' : 'failed',
    }));
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  if (!labData) {
    return <div className="text-white text-center mt-20">Loading Lab Details...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0B14] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{labData.title}</h1>
        {labData.steps.map((step: any) => (
          <div key={step.id} className="bg-gray-800 p-4 rounded-lg mb-4">
            <div onClick={() => toggleStep(step.id)} className="cursor-pointer flex justify-between">
              <h2 className="text-xl font-semibold">{step.title}</h2>
              {expandedSteps.includes(step.id) ? <ChevronUp /> : <ChevronDown />}
            </div>

            {expandedSteps.includes(step.id) && (
              <div className="mt-2">
                {step.commands.map((cmd: any, index: number) => (
                  <div key={index} className="mb-2">
                    <p className="text-sm text-gray-400">{cmd.description}</p>
                    <div className="bg-gray-900 p-2 rounded flex justify-between">
                      <code className="text-purple-400">{cmd.command}</code>
                      <button onClick={() => copyCommand(cmd.command)}>
                        <Copy className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => verifyStep(step.id)}
                  className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                  Verify Step
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
