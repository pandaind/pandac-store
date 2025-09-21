import React from 'react';
import { ENV } from '../../config/index.js';

/**
 * Component to display Stripe configuration status
 * Useful for debugging Stripe integration issues
 */
const StripeStatus = () => {
  const hasStripeKey = !!ENV.STRIPE_PUBLISHABLE_KEY;
  const isStripeEnabled = ENV.ENABLE_STRIPE_PAYMENT;
  const isDebugMode = ENV.ENABLE_DEBUG_MODE;

  // Only show in debug mode
  if (!isDebugMode) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-xs shadow-lg max-w-xs">
      <div className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
        Stripe Status (Debug Mode)
      </div>
      <div className="space-y-1">
        <div className={`flex items-center ${hasStripeKey ? 'text-green-600' : 'text-red-600'}`}>
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${hasStripeKey ? 'bg-green-500' : 'bg-red-500'}`}></span>
          Publishable Key: {hasStripeKey ? 'Configured' : 'Missing'}
        </div>
        <div className={`flex items-center ${isStripeEnabled ? 'text-green-600' : 'text-orange-600'}`}>
          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isStripeEnabled ? 'bg-green-500' : 'bg-orange-500'}`}></span>
          Feature Flag: {isStripeEnabled ? 'Enabled' : 'Disabled'}
        </div>
        {hasStripeKey && (
          <div className="text-gray-500 text-xs mt-1">
            Key: {ENV.STRIPE_PUBLISHABLE_KEY.substring(0, 15)}...
          </div>
        )}
      </div>
    </div>
  );
};

export default StripeStatus;
