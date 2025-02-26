import React, { useState, useEffect } from 'react';
import { Terminal, CheckCircle2, XCircle, Clock, ArrowRight, Copy, ChevronDown, ChevronUp, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { labApi, testApi } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

export const  CoursePage = () =>  {
  const { labId } = useParams(); // Assuming labId is passed via URL
  const [labData, setLabData] = useState(null);
  const [isTestStarted, setisTestStarted] = useState(undefined);
  const [testId, setTestid] = useState('');
  const [time, setTime] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [testDetails, setTestDetails] = useState({});
  const [expandedSteps, setExpandedSteps] = useState<number[]>([1]);
  const [verificationStatus, setVerificationStatus] = useState<Record<number, 'pending' | 'success' | 'failed' | 'loading'>>({});
  const {user} = useAuth()
  useEffect(() => {
    let interval: number;
    if (isTestStarted) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTestStarted]);


  useEffect(() => {
    const localstorageTestId = localStorage.getItem('testId');

    const fetchLabData = async () => {
      try {
        const data = await labApi.getById(labId || "");
        setLabData(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching lab data:', error);
      }
    };
    
    const checkCurrentUserLabStatus = async () => {
      try {

        const data = await labApi.getLabStatus(labId || "");
        if (data) {
          setTestDetails(data)
          setisTestStarted(true)
        } else {
          setisTestStarted(false)
        }
      } catch (error) {
        setisTestStarted(false)
      }
    };

    if (labId) {
      fetchLabData();
      checkCurrentUserLabStatus()
    }
    if (localstorageTestId) {
      setTestid(localstorageTestId)
      setisTestStarted(true)
    }
  }, [labId]);

  useEffect(() => {
    const estimatedTime = testDetails.estimatedTime
    if (!estimatedTime) return 
    const estimatedDate = new Date(estimatedTime+"z");
    const currentDate = new Date();
    

    const differenceInMilliseconds = estimatedDate - currentDate;
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    setTime(differenceInSeconds)
  }, [testDetails])
  

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };



  const toggleTestStatus = async () => {
    setisTestStarted(undefined)
    if (isTestStarted) {
      if (testId) {
        try {
          console.log(testDetails)
          setisTestStarted(undefined)
          await testApi.endLab(testDetails.test_id);
          localStorage.removeItem('testId');
          setisTestStarted(false);
        } catch (error) {
          console.error('Error ending lab:', error);
        }
      } else {
        console.warn('No testId found in localStorage.');
      }
    } else {
      try {
        const response = await testApi.startLab(labId || "");
        localStorage.setItem('testId', response.test_id);
        setTestid(response.test_id)
        setTestDetails(response)
        window.open(response.link, "_blank");
        setisTestStarted(true);
      } catch (error) {
        console.error('Error starting lab:', error);
      }
    }
  };

  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
  };

  const toggleStep = (stepId: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const verifyStep = async (stepId: number, verifyId:string) => {
    try {
      setVerificationStatus(prev => ({
        ...prev,
        [stepId]: 'loading'
      }));
      const response = await labApi.verifyStep(testId, verifyId);
      setVerificationStatus(prev => ({
        ...prev,
        [stepId]: response.status
      }));
    } catch (error) {
      console.error('Error verifying step:', error);
      setVerificationStatus(prev => ({
        ...prev,
        [stepId]: 'failed'
      }));
    }
  };


  const getVerificationStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'success':
        return 'text-green-500';
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B14] text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-[#0A0B14]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Terminal className="w-6 h-6 text-purple-500" />
              <h1 className="text-xl font-bold">{labData?.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              {testDetails?.link && <a href={testDetails?.link} target='_blank' className={`flex items-center space-x-2 text-green-500`}>  
                
                <span className="text-sm capitalize">Terminal </span>
                <ExternalLink className='w-4 h-4'/> 
              </a>}
              {isTestStarted ===undefined ? (
        <div className="flex items-center justify-center w-full h-16">
          <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
        </div>
      ) : (
        <>
          <div className="bg-gray-800 rounded-lg px-4 py-2 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span className="font-mono">{formatTime(time)}</span>
          </div>
          <button
            onClick={toggleTestStatus}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isTestStarted ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isTestStarted ? 'End Lab' : 'Start Lab'}
          </button>
        </>
      )}
            </div>
          </div>
        </div>
      </div>


      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-3 gap-8">
          {/* Steps and Commands */}
          <div className="col-span-2 space-y-6">
            {labData?.steps.map((step) => (
              <div
                key={step.id}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700"
              >
                <div 
                  className="p-6 cursor-pointer"
                  onClick={() => toggleStep(step.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        verificationStatus[step.id] === 'success'
                          ? 'bg-green-500/20 text-green-500'
                          : verificationStatus[step.id] === 'failed'
                          ? 'bg-red-500/20 text-red-500'
                          : 'bg-gray-700'
                      }`}>
                        {step.id}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold flex items-center space-x-2">
                          <span>{step.title}</span>
                          {verificationStatus[step.id] === 'success' && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                          {verificationStatus[step.id] === 'failed' && (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </h3>
                        <p className="text-gray-400 mt-1">{step.description}</p>
                      </div>
                    </div>
                    <button className="text-gray-400">
                      {expandedSteps.includes(step.id) ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
                {expandedSteps.includes(step.id) && (
                  <div className="border-t border-gray-700">
                    <div className="p-6 space-y-4">
                      {step.commands.map((cmd, index) => (
                        <div key={index} className="space-y-2">
                          <p className="text-sm text-gray-400">{cmd.description}</p>
                          <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                            <div className="flex items-center justify-between group">
                              <code className="text-purple-400">{cmd.command}</code>
                              <button
                                onClick={() => copyCommand(cmd.command)}
                                className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                            {cmd.output && (
                              <div className="mt-2 pt-2 border-t border-gray-800 text-gray-400">
                                {cmd.output}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {step.verifyId!==false && <div className="pt-4 flex justify-end">
                        <button
                          onClick={() => verifyStep(step.id, step.verifyId)}
                          className={`px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 ${
                            verificationStatus[step.id] === 'success'
                              ? 'bg-green-500/20 text-green-500'
                              : verificationStatus[step.id] === 'failed'
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-purple-500/20 text-purple-500'
                          }`}
                        >
                          <span>Verify Step</span>
                          {verificationStatus[step.id] === 'success' && <CheckCircle2 className="w-4 h-4" />}
                          {verificationStatus[step.id] === 'failed' && <AlertCircle className="w-4 h-4" />}
                          {verificationStatus[step.id] === 'loading' && <Loader2 className="w-4 h-4 animate-spin" />}
                          {!verificationStatus[step.id] && <ArrowRight className="w-4 h-4" />}
                        </button>
                      </div>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>


          {/* Progress and Reference */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700 p-6 sticky top-28">
            <div className="flex justify-center mb-6">
          </div>
              <h3 className="text-lg font-semibold mb-4">Lab Progress</h3>
              <div className="space-y-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(Object.values(verificationStatus).filter(status => status === 'success').length / labData?.steps.filter(el=>el.verifyId!==false).length) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-center text-gray-400">
                  {Object.values(verificationStatus).filter(status => status === 'success').length} of {labData?.steps.filter(el=>el.verifyId!==false).length} sections completed
                </div>
                
                {/* Step Status Overview */}
                <div className="mt-6 space-y-3">
                  {labData?.steps.filter(el=>el.verifyId!==false).map(step => (
                    <div key={step.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Section {step.id}</span>
                      <span className={getVerificationStatusColor(verificationStatus[step.id])}>
                        {verificationStatus[step.id]?.toUpperCase() || 'PENDING'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
