// src/CryptoSentinel.jsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

// Import layout components
import Hero from '../components/layouts/Hero';
import AnalysisForm from '../components/layouts/AnalysisForm';
import ResultsDisplay from '../components/layouts/ResultsDisplay';

// Import modal components
import FollowUpQuestion from '../components/modals/FollowUpModal';
import ResponseDisplay from '../components/modals/ResponseModal';

// Import API service
import ApiService from '../services/ApiService';

// Main App
const CryptoSentinel = () => {
  const [view, setView] = useState('hero');
  const [_query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [showResponse, setShowResponse] = useState(false);
  const [error, setError] = useState(null);
  
  // Generate a random session ID on component mount
  useEffect(() => {
    setSessionId(`session_${Math.random().toString(36).substring(2, 15)}`);
  }, []);
  
  // API functions
  const analyzeProject = async (queryText) => {
    setLoading(true);
    setError(null);
    
    try {
      // Make actual API call
      const response = await ApiService.analyzeProject(queryText, sessionId);
      
      // Check if response contains result property according to the expected format
      if (!response || !response.result) {
        throw new Error('Invalid response format from server');
      }
      
      // Set the analysis result
      setAnalysisResult(response.result);
      setLoading(false);
      setView('results');
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during analysis');
      setLoading(false);
    }
  };
  
  const processFollowUp = async (question) => {
    setFollowUpLoading(true);
    setError(null);
    
    try {
      // Make actual API call
      const response = await ApiService.submitFollowupQuestion(question, sessionId);
      
      // Handle follow-up response format
      if (!response || typeof response.result !== 'string') {
        throw new Error('Invalid response format from server');
      }
      
      // Set the response text
      setResponseText(response.result);
      setFollowUpLoading(false);
      setShowFollowUp(false);
      setShowResponse(true);
    } catch (err) {
      console.error('Follow-up error:', err);
      setError(err.message || 'An error occurred processing your question');
      setFollowUpLoading(false);
      setShowFollowUp(false);
    }
  };
  
  const resetSession = async () => {
    try {
      // Make actual API call
      await ApiService.resetSession(sessionId);
      
      // Generate new session ID
      const newSessionId = `session_${Math.random().toString(36).substring(2, 15)}`;
      setSessionId(newSessionId);
      setView('form');
      setQuery('');
      setAnalysisResult(null);
      setError(null);
    } catch (err) {
      console.error('Reset error:', err);
      setError(err.message || 'An error occurred resetting the session');
    }
  };
  
  // Handlers
  const handleStartAnalysis = () => {
    setView('form');
  };
  
  const handleSubmitAnalysis = (queryText) => {
    setQuery(queryText);
    analyzeProject(queryText);
  };
  
  const handleFollowUp = () => {
    setShowFollowUp(true);
  };
  
  const handleSubmitFollowUp = (question) => {
    processFollowUp(question);
  };
  
  const handleCloseResponse = () => {
    setShowResponse(false);
  };
  
  // Add a fallback handler for API errors
  const handleApiError = (errorMessage) => {
    // If the server is unreachable or returns a 5xx error
    if (errorMessage.includes('Failed to fetch') || 
        errorMessage.includes('NetworkError')) {
      return 'Server is currently unreachable. Please check your internet connection or try again later.';
    }
    // If the session has expired
    if (errorMessage.includes('session')) {
      resetSession();
      return 'Your session has expired. Starting a new session...';
    }
    // Solana-specific errors
    if (errorMessage.includes('token') && errorMessage.includes('not found')) {
      return 'This Solana token address could not be found. Please verify the address and try again.';
    }
    // Return the original error if no special cases
    return errorMessage;
  };
  
  return (
    <div className="bg-gray-900 min-h-screen text-white pb-[2rem]">
      <AnimatePresence mode="wait">
        {view === 'hero' && (
          <motion.div
            key="hero"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Hero startAnalysis={handleStartAnalysis} />
          </motion.div>
        )}
        
        {view === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AnalysisForm 
              onSubmit={handleSubmitAnalysis} 
              isLoading={loading} 
              goBack={() => setView('hero')}
            />
          </motion.div>
        )}
        
        {view === 'results' && analysisResult && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ResultsDisplay 
              result={analysisResult} 
              onFollow={handleFollowUp}
              onReset={resetSession}
              goBack={() => setView('form')}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showFollowUp && (
          <FollowUpQuestion
            onSubmit={handleSubmitFollowUp}
            isLoading={followUpLoading}
            onCancel={() => setShowFollowUp(false)}
          />
        )}
        
        {showResponse && (
          <ResponseDisplay 
            response={responseText}
            onClose={handleCloseResponse}
          />
        )}
      </AnimatePresence>
      
      {/* Error display */}
      {error && (
        <motion.div 
          className="fixed bottom-4 right-4 bg-red-600 text-white rounded-lg p-4 shadow-lg max-w-md z-50"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="flex items-start">
            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold mb-1">Error</h4>
              <p className="text-sm">{handleApiError(error)}</p>
            </div>
            <button 
              className="ml-4 text-white/80 hover:text-white"
              onClick={() => setError(null)}
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CryptoSentinel;