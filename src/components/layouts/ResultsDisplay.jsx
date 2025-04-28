// ResultsDisplay.jsx - Updated for the new result structure
import React from 'react';
import { ArrowRight, PiggyBank, Search, RefreshCw, DollarSign, Layers, TrendingUp, PieChart, AlertCircle, Twitter, Globe, MessageCircle } from 'lucide-react';
import AnimatedBackground from '../AnimatedBackground';
import AnimatedLogo from '../AnimatedLogo';
import AnimatedMetrics from '../AnimatedMetrics';
import MetricItem from '../ui/MetricItem';
import { FadeIn, SlideIn } from '../ui/AnimationWrappers';
import { motion } from 'framer-motion';

// Format large numbers with commas and abbreviate if needed
const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  
  if (num >= 1000000000) {
    return `$${(num / 1000000000).toFixed(2)}B`;
  } else if (num >= 1000000) {
    return `$${(num / 1000000).toFixed(2)}M`;
  } else if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)}K`;
  } else {
    return `$${num.toFixed(2)}`;
  }
};

// Format price with appropriate decimals based on value
const formatPrice = (price) => {
  if (price === undefined || price === null) return '$0.00';
  
  if (price < 0.0001) {
    return `$${price.toFixed(8)}`;
  } else if (price < 0.01) {
    return `$${price.toFixed(6)}`;
  } else if (price < 1) {
    return `$${price.toFixed(4)}`;
  } else {
    return `$${price.toFixed(2)}`;
  }
};

const ResultsDisplay = ({ result, goBack }) => {
  // Extract data from analysis result with safe fallbacks
  const {
    token_info = { 
      name: "Unknown Token", 
      symbol: "???", 
      price_usd: 0, 
      market_cap: 0, 
      fdv: 0, 
      price_change_24h: 0 
    },
    smart_contract_risk = { rating: 0, comment: "No data available", error: null },
    token_performance = { rating: 0, comment: "No data available", error: null },
    on_chain_metrics = { rating: 0, comment: "No data available", error: null },
    social_sentiment = { rating: 0, comment: "No data available", error: null },
    risk_reward_ratio = 0,
    confidence_score = 0,
    final_recommendation = "No recommendation available",
    socials = [],
    website = ""
  } = result?.result || result || {};

  // Format social links data
  const socialLinks = [];
  
  // Check if we have socials array directly in the result
  if (socials && Array.isArray(socials)) {
    socials.forEach(link => {
      if (link.type === 'twitter') {
        socialLinks.push({
          type: 'twitter',
          url: link.url,
          icon: <Twitter className="w-4 h-4" />
        });
      } else if (link.type === 'telegram') {
        socialLinks.push({
          type: 'telegram',
          url: link.url,
          icon: <MessageCircle className="w-4 h-4" />
        });
      }
    });
  }
  
  // Add website if available
  if (website) {
    socialLinks.push({
      type: 'website',
      url: website,
      icon: <Globe className="w-4 h-4" />
    });
  }
  
  
  
  // Check for liquidity and volume data that might be in on_chain_metrics
  let liquidityUsd = null;
  let volume24h = null;
  let buySellRatio = null;
  
  if (on_chain_metrics?.liquidity_metrics) {
    liquidityUsd = on_chain_metrics.liquidity_metrics.liquidity_usd;
    volume24h = on_chain_metrics.liquidity_metrics.volume_24h;
    buySellRatio = on_chain_metrics.liquidity_metrics.buy_sell_ratio;
  }
  
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
            <div>
              <h1 className="text-3xl font-bold text-white">{token_info.name} ({token_info.symbol})</h1>
              <div className="flex items-center mt-2">
                <span className="text-2xl font-medium text-white mr-2">
                  {formatPrice(token_info.price_usd)}
                </span>
                <span className={`text-sm font-medium px-2 py-1 rounded ${token_info.price_change_24h >= 0 ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                  {token_info.price_change_24h >= 0 ? '+' : ''}{token_info.price_change_24h?.toFixed(2)}%
                </span>
                {socialLinks.length > 0 && (
                  <div className="ml-4 flex space-x-2">
                    {socialLinks.map((link, index) => (
                      <a 
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                        title={link.type}
                      >
                        {link.icon}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {/* <div className="flex space-x-3 mt-4 md:mt-0">
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
            </div> */}
          </div>
        </FadeIn>
        
        {/* Market Data Section */}
        <SlideIn className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-300 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-400" />
            Market Analytics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <PieChart className="w-4 h-4 text-blue-400 mr-2" />
                <span className="text-gray-400 text-sm">Market Cap</span>
              </div>
              <div className="text-xl font-medium text-white">
                {formatNumber(token_info.market_cap)}
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <Layers className="w-4 h-4 text-purple-400 mr-2" />
                <span className="text-gray-400 text-sm">Fully Diluted Valuation</span>
              </div>
              <div className="text-xl font-medium text-white">
                {formatNumber(token_info.fdv)}
              </div>
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                <span className="text-gray-400 text-sm">24h Change</span>
              </div>
              <div className={`text-xl font-medium ${token_info.price_change_24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {token_info.price_change_24h >= 0 ? '+' : ''}{token_info.price_change_24h?.toFixed(2)}%
              </div>
            </div>
          </div>
          
          {/* Additional metrics if available */}
          {(liquidityUsd || volume24h || buySellRatio) && (
            <div className="mt-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                <span className="text-gray-400 text-sm">Additional Metrics</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {volume24h && (
                  <div>
                    <span className="text-gray-400 text-sm">24h Volume</span>
                    <div className="text-lg font-medium text-white">
                      {formatNumber(volume24h)}
                    </div>
                  </div>
                )}
                {liquidityUsd && (
                  <div>
                    <span className="text-gray-400 text-sm">Liquidity</span>
                    <div className="text-lg font-medium text-white">
                      {formatNumber(liquidityUsd)}
                    </div>
                  </div>
                )}
                {buySellRatio && (
                  <div>
                    <span className="text-gray-400 text-sm">Buy/Sell Ratio</span>
                    <div className="text-lg font-medium text-white">
                      {buySellRatio.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </SlideIn>
        
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
              <AnimatedMetrics data={result?.result || result} />
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