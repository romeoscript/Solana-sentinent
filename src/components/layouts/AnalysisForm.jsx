// AnalysisForm.jsx
import React, { useState } from 'react';
import { Search, ArrowRight, RefreshCw, Brain } from 'lucide-react';
import AnimatedBackground from '../AnimatedBackground';
import AnimatedLogo from '../AnimatedLogo';
import LoadingAnimation from '../ui/LoadingAnimation';

const AnalysisForm = ({ onSubmit, isLoading, goBack }) => {
  const [query, setQuery] = useState('');
  const [validationError, setValidationError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate the input for Solana token address format
    // Solana addresses are base58 encoded and typically 32-44 characters
    if (query.trim()) {
      // Check if it looks like a Solana address
      if (query.startsWith('0x')) {
        setValidationError('Please enter a Solana token address. Solana addresses do not start with 0x.');
        return;
      }
      
      // Basic validation for Solana address format
      const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
      if (!solanaAddressRegex.test(query) && query.length >= 32) {
        setValidationError('This doesn\'t appear to be a valid Solana token address format.');
        return;
      }
      
      // Clear any validation errors and submit
      setValidationError('');
      onSubmit(query);
    } else {
      setValidationError('Please enter a Solana token address or project name');
    }
  };
  
  return (
    <div className="bg-gray-900 min-h-screen flex flex-col items-center justify-center p-4">
      <AnimatedBackground />
      <button
        className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
        onClick={goBack}
      >
        <div className="flex items-center">
          <ArrowRight className="w-5 h-5 transform rotate-180 mr-2" />
          <span>Back</span>
        </div>
      </button>
      
      <div className="max-w-2xl w-full z-10">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <AnimatedLogo className="w-16 h-16 mb-4" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Solana Token Analysis</h2>
          <p className="text-gray-400 mb-8">Enter a Solana token address or project name</p>
        </div>
        
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="w-5 h-5 text-gray-500" />
            </div>
            <input
              type="text"
              className={`w-full bg-gray-800 border ${validationError ? 'border-red-500' : 'border-gray-700'} text-white rounded-lg pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              placeholder="Solana token address (e.g. EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v)"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (validationError) setValidationError('');
              }}
              disabled={isLoading}
              autoFocus
            />
          </div>
          
          {validationError && (
            <div className="text-red-500 text-sm mb-4 pl-2">{validationError}</div>
          )}
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 px-8 rounded-lg shadow-lg flex items-center justify-center transition-all hover:bg-blue-700 hover:shadow-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Analyze
              </>
            )}
          </button>
        </form>
        
        {isLoading && (
          <div className="mt-12">
            <LoadingAnimation />
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisForm;