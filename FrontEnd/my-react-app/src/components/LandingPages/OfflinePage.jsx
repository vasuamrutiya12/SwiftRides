import { useState, useEffect } from 'react';
import { Car, WifiOff, RefreshCw, Zap, Signal } from 'lucide-react';

const OfflinePage = () => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [pulseActive, setPulseActive] = useState(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  // Animated pulse effect control
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseActive(prev => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    setConnectionAttempts(prev => prev + 1);
    
    // Simulate connection attempt delay
    setTimeout(() => {
      setIsRetrying(false);
      window.location.reload();
    }, 2000);
  };

  const getMotivationalMessage = () => {
    const messages = [
      "Keep Pushing!",
      "Stay Strong!",
      "Never Give Up!",
      "Power Through!",
      "Keep Going!"
    ];
    return messages[connectionAttempts % messages.length];
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center 
                    bg-gradient-to-br from-red-50 via-rose-100 to-red-100 
                    relative overflow-hidden p-4">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200/30 
                        rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200/30 
                        rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        w-96 h-96 bg-red-300/20 rounded-full blur-3xl animate-ping 
                        animation-duration-[4s]"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Main content card */}
      <div className="relative z-10 max-w-md w-full">
        {/* Glassmorphism card */}
        <div className={`backdrop-blur-xl bg-white/70 border border-red-200/50 
                        rounded-3xl p-8 shadow-2xl transform transition-all duration-700
                        hover:scale-105 hover:bg-white/80 hover:shadow-red-300/30
                        ${pulseActive ? 'shadow-red-300/25' : 'shadow-rose-300/25'}`}>
          
          {/* Header section */}
          <div className="text-center mb-8">
            {/* WiFi Off Icon with animated effects */}
            <div className="relative mb-6">
              <div className={`absolute inset-0 rounded-full bg-red-400/20 blur-xl 
                              transition-all duration-1000 ${pulseActive ? 'scale-150' : 'scale-100'}`}></div>
              <div className="relative bg-gradient-to-br from-red-100/80 to-rose-200/80 
                              backdrop-blur-sm rounded-full p-6 border border-red-300/40 
                              transform transition-transform duration-300 hover:rotate-12">
                <WifiOff 
                  className="w-12 h-12 text-red-600 mx-auto animate-bounce" 
                  aria-label="Offline icon" 
                />
              </div>
              
              {/* Signal waves animation */}
              <div className="absolute -inset-4 flex items-center justify-center">
                <div className="w-16 h-16 border-2 border-red-400/40 rounded-full 
                               animate-ping animation-duration-[3s]"></div>
                <div className="absolute w-20 h-20 border-2 border-red-300/30 rounded-full 
                               animate-ping animation-duration-[3s] animation-delay-500"></div>
              </div>
            </div>

            {/* Title with gradient text */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-rose-600 
                          bg-clip-text text-transparent mb-4 tracking-tight">
              Network Disconnected
            </h1>
            
            {/* Description */}
            <p className="text-red-700/80 text-lg leading-relaxed opacity-90">
              You seem to be offline. Please check your connection.
            </p>
          </div>

          {/* Content section with car */}
          <div className="text-center mb-8 p-6 rounded-2xl bg-gradient-to-r from-red-100/50 to-rose-100/50 
                          border border-red-200/40 backdrop-blur-sm">
            {/* Animated car */}
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-red-300/30 to-rose-300/30 
                              rounded-full blur-xl animate-pulse"></div>
              <Car 
                className="w-16 h-16 text-red-500 mx-auto relative z-10 
                          transform transition-transform duration-300 hover:scale-110 hover:rotate-12
                          drop-shadow-lg" 
                aria-label="car icon" 
              />
            </div>
            
            {/* Motivational message */}
            <p className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 
                          bg-clip-text text-transparent animate-pulse">
              {getMotivationalMessage()}
            </p>
            
          </div>

          {/* Connection attempts counter */}
          {connectionAttempts > 0 && (
            <div className="text-center mb-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full 
                              bg-red-100/60 border border-red-300/40 text-red-700">
                <Signal className="w-4 h-4" />
                <span className="text-sm">Attempts: {connectionAttempts}</span>
              </div>
            </div>
          )}

          {/* Footer with retry button */}
          <div className="text-center">
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="group relative w-full py-4 px-8 rounded-2xl font-semibold text-white 
                        bg-gradient-to-r from-red-500 via-rose-500 to-red-500 
                        bg-size-200 bg-pos-0 hover:bg-pos-100 
                        transform transition-all duration-300 hover:scale-105 
                        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                        shadow-lg hover:shadow-red-400/30 
                        border border-red-400/30 backdrop-blur-sm
                        before:absolute before:inset-0 before:rounded-2xl 
                        before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent
                        before:translate-x-[-100%] hover:before:translate-x-[100%] 
                        before:transition-transform before:duration-700 overflow-hidden"
            >
              <div className="relative flex items-center justify-center space-x-3">
                {isRetrying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 group-hover:animate-pulse" />
                    <span>Retry Connection</span>
                  </>
                )}
              </div>
              
              {/* Button glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/0 
                              via-red-500/30 to-red-500/0 opacity-0 group-hover:opacity-100 
                              transition-opacity duration-300 blur-xl"></div>
            </button>
          </div>

          {/* Loading bar for retry state */}
          {isRetrying && (
            <div className="mt-6">
              <div className="w-full bg-red-200/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-400 to-rose-400 
                               rounded-full animate-pulse"></div>
              </div>
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full 
                          bg-red-200/60 border border-red-300/50 text-red-700">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Offline Mode</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflinePage;