// ResultsDisplay.jsx - with fix for undefined property error
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, PiggyBank, Search, RefreshCw } from 'lucide-react';
import AnimatedBackground from '../AnimatedBackground';
import AnimatedLogo from '../AnimatedLogo';
import AnimatedMetrics from '../AnimatedMetrics';
import MetricItem from '../ui/MetricItem';
import { FadeIn, SlideIn } from '../ui/AnimationWrappers';

const ResultsDisplay = ({ result, onFollow, onReset, goBack }) => {
  // Extract data from analysis result with safe fallbacks
  const {
    smart_contract_risk = { rating: 0, comment: "No data available", error: null },
    token_performance = { rating: 0, comment: "No data available", error: null },
    on_chain_metrics = { rating: 0, comment: "No data available", error: null },
    social_sentiment = { rating: 0, comment: "No data available", error: null },
    risk_reward_ratio = 0,
    confidence_score = 0,
    final_recommendation = "No recommendation available"
  } = result || {};
  
  return (
    <div className="bg-gray-900 min-h-screen py-12 px-4 relative">
      <AnimatedBackground />
      <button
        className="absolute top-6 left-6 text-gray-400 hover:text-white z-10 transition-colors"
        onClick={goBack}
      >
        <div className="flex items-center">
          <ArrowRight className="w-5 h-5 transform rotate-180 mr-2" />
          <span>Back</span>
        </div>
      </button>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <FadeIn>
          <div className="flex items-center justify-center mb-6">
            <AnimatedLogo className="w-14 h-14" />
          </div>
          <div className="md:flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Solana Token Analysis</h1>
            <div className="flex space-x-3">
              <button
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm flex items-center transition-colors"
                onClick={onFollow}
              >
                <Search className="w-4 h-4 mr-2" />
                Ask Follow-up
              </button>
              <button
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm flex items-center transition-colors"
                onClick={onReset}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Analysis
              </button>
            </div>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Main metrics */}
          <SlideIn className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-300 mb-4 flex items-center">
              <PiggyBank className="w-5 h-5 mr-2 text-blue-400" />
              Investment Potential
            </h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-sm">Risk/Reward Ratio</span>
                <span className="text-white font-medium">{risk_reward_ratio?.toFixed(1) || '0.0'}/5</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((risk_reward_ratio || 0) / 5) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-400 text-sm">Confidence Score</span>
                <span className="text-white font-medium">{confidence_score?.toFixed(0) || '0'}%</span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence_score || 0}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                />
              </div>
            </div>
            
            <div className="p-4 rounded-lg bg-gray-900 border border-gray-700">
              <h4 className="text-lg font-medium text-white mb-2">Recommendation</h4>
              <p className="text-gray-300">{final_recommendation}</p>
            </div>
            
            {/* Add animated metrics visualization */}
            <div className="mt-6">
              <AnimatedMetrics data={result} />
            </div>
          </SlideIn>
          
          {/* Detail metrics */}
          <SlideIn direction="left" className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-300 mb-4">Analysis Metrics</h3>
            
            <MetricItem 
              title="On-Chain Metrics" 
              rating={on_chain_metrics?.rating || 0} 
              comment={on_chain_metrics?.comment || "No data available"}
              error={on_chain_metrics?.error}
              delay={0.1}
            />
            
            <MetricItem 
              title="Smart Contract Security" 
              rating={smart_contract_risk?.rating || 0} 
              comment={smart_contract_risk?.comment || "No data available"}
              error={smart_contract_risk?.error}
              delay={0.3}
            />
            
            <MetricItem 
              title="Token Performance" 
              rating={token_performance?.rating || 0} 
              comment={token_performance?.comment || "No data available"}
              error={token_performance?.error}
              delay={0.5}
            />
            
            <MetricItem 
              title="Social Sentiment" 
              rating={social_sentiment?.rating || 0} 
              comment={social_sentiment?.comment || "No data available"}
              error={social_sentiment?.error}
              delay={0.7}
            />
          </SlideIn>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;