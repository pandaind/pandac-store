import React, { useState, useEffect } from 'react';
import { ENV, API_ENDPOINTS } from '../../config/index.js';
import apiClient from '../../api/apiClient.js';

/**
 * API Connectivity Test Component
 * Tests various API endpoints to diagnose connectivity issues
 */
const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const apiTests = [
    {
      name: 'Base URL Test',
      url: '/actuator/info',
      method: 'GET',
      description: 'Test if backend is responding'
    },
    {
      name: 'Login Endpoint',
      url: API_ENDPOINTS.AUTH.LOGIN,
      method: 'POST',
      description: 'Test login API with test credentials',
      data: { 
        username: 'admin@pandac.in',
        password: 'M@lk@ng1r1'
      }
    },
    {
      name: 'Products Endpoint',
      url: API_ENDPOINTS.PRODUCTS,
      method: 'GET',
      description: 'Test products API'
    },
    // {
    //   name: 'Contact Endpoint',
    //   url: API_ENDPOINTS.CONTACT,
    //   method: 'POST',
    //   description: 'Test contact message API',
    //   data: {
    //     name: 'Test User',
    //     email: 'test@example.com',
    //     mobileNumber: '1234567890',
    //     message: 'Test message content'
    //   }
    // }
  ];

  const runApiTests = async () => {
    setIsTestingApi(true);
    const results = [];

    for (const test of apiTests) {
      try {
        let fullUrl;
        if (test.name === 'Base URL Test') {
          // Actuator endpoints are at the root level, not under /api/v1
          fullUrl = `http://localhost:8080${test.url}`;
          console.log(`Testing ${test.name}: ${fullUrl}`);
        } else {
          fullUrl = `${ENV.API_BASE_URL}${test.url}`;
          console.log(`Testing ${test.name}: ${fullUrl}`);
        }
        
        let response;
        if (test.method === 'POST') {
          if (test.name === 'Base URL Test') {
            // Direct axios call for actuator
            response = await fetch(fullUrl);
            response = { status: response.status, data: await response.json() };
          } else {
            response = await apiClient.post(test.url, test.data || {});
          }
        } else {
          if (test.name === 'Base URL Test') {
            // Direct axios call for actuator
            response = await fetch(fullUrl);
            response = { status: response.status, data: await response.json() };
          } else {
            response = await apiClient.get(test.url);
          }
        }

        results.push({
          ...test,
          status: 'SUCCESS',
          statusCode: response.status,
          message: `✅ Success (${response.status})`,
          responseSize: JSON.stringify(response.data).length
        });
      } catch (error) {
        console.error(`Test ${test.name} failed:`, error);
        
        results.push({
          ...test,
          status: 'FAILED',
          statusCode: error.response?.status || 'Network Error',
          message: `❌ ${error.response?.data?.message || error.message || 'Network Error'}`,
          error: error.response?.data || error.message
        });
      }
    }

    setTestResults(results);
    setIsTestingApi(false);
  };

  useEffect(() => {
    // Auto-run tests on component mount
    runApiTests();
  }, []);

  if (!ENV.ENABLE_DEBUG_MODE) return null;

  return (
    <div className="fixed top-4 left-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-4 text-xs shadow-lg max-w-md z-50">
      <div className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
        API Connectivity Test
      </div>
      
      <div className="mb-3 text-gray-600 dark:text-gray-400">
        <div>Base URL: <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">{ENV.API_BASE_URL}</code></div>
        <div>Stripe Enabled: {ENV.ENABLE_STRIPE_PAYMENT ? '✅' : '❌'}</div>
      </div>

      <button 
        onClick={runApiTests}
        disabled={isTestingApi}
        className="mb-3 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 disabled:opacity-50"
      >
        {isTestingApi ? 'Testing...' : 'Retest APIs'}
      </button>

      <div className="space-y-2">
        {testResults.map((result, index) => (
          <div key={index} className="border-l-2 pl-2 py-1" style={{
            borderColor: result.status === 'SUCCESS' ? '#10B981' : '#EF4444'
          }}>
            <div className="font-medium text-xs text-gray-800 dark:text-gray-200">
              {result.name} 
              <span className="ml-1 text-gray-500">({result.method})</span>
            </div>
            <div className={`text-xs ${result.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600'}`}>
              Status: {result.statusCode}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              {result.message}
            </div>
            {result.error && (
              <div className="text-xs text-red-500 mt-1 bg-red-50 dark:bg-red-900/20 p-1 rounded">
                Error: {JSON.stringify(result.error, null, 2)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApiTest;
