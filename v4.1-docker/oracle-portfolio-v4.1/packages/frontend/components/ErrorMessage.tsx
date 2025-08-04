import React from 'react';
import { motion } from 'framer-motion';

interface ErrorMessageProps {
  message: string;
  details?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, details }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-background-card border border-error rounded-lg p-6 shadow-card"
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-error rounded-full flex items-center justify-center">
          <span className="text-white text-lg">⚠️</span>
        </div>
        <h3 className="text-lg font-semibold text-text-primary">
          Erreur
        </h3>
      </div>
      
      <p className="text-text-primary mb-3">
        {message}
      </p>
      
      {details && (
        <div className="bg-background-secondary rounded-md p-3 border border-border">
          <p className="text-text-secondary text-sm font-mono">
            {details}
          </p>
        </div>
      )}
      
      <div className="mt-4 flex space-x-3">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary hover:bg-primary-600 text-white rounded-md font-medium transition-colors duration-200"
        >
          Réessayer
        </button>
        <button 
          onClick={() => window.history.back()}
          className="px-4 py-2 bg-background-secondary hover:bg-border text-text-primary rounded-md font-medium transition-colors duration-200"
        >
          Retour
        </button>
      </div>
    </motion.div>
  );
}; 