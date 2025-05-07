
/**
 * Tests for network status utilities
 * 
 * @jest
 */
// Import directly since we've now installed the @jest/globals package
import { 
  jest, 
  describe, 
  it, 
  expect, 
  beforeAll, 
  afterAll, 
  beforeEach 
} from '@jest/globals';
import { 
  isNetworkError, 
  isOnline,
  subscribeToNetworkStatus,
  offlineQueue
} from '../../utils/network-status';

// Mock window properties and events
const mockWindowEvents: Record<string, Function[]> = {};
const originalAddEventListener = window.addEventListener;
const originalRemoveEventListener = window.removeEventListener;

describe('Network Status Utilities', () => {
  // Setup mocks before tests
  beforeAll(() => {
    // Mock navigator.onLine
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: jest.fn(() => true),
    });

    // Mock addEventListener
    window.addEventListener = jest.fn((event, callback) => {
      if (!mockWindowEvents[event]) {
        mockWindowEvents[event] = [];
      }
      mockWindowEvents[event].push(callback);
    });

    // Mock removeEventListener
    window.removeEventListener = jest.fn((event, callback) => {
      if (mockWindowEvents[event]) {
        mockWindowEvents[event] = mockWindowEvents[event].filter(cb => cb !== callback);
      }
    });
  });

  // Restore original functions after tests
  afterAll(() => {
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
  });

  // Reset mocks between tests
  beforeEach(() => {
    Object.keys(mockWindowEvents).forEach(key => {
      mockWindowEvents[key] = [];
    });
    jest.clearAllMocks();
  });

  describe('isNetworkError', () => {
    it('should identify network errors based on error message', () => {
      expect(isNetworkError(new Error('Failed to fetch'))).toBe(true);
      expect(isNetworkError(new Error('Network error'))).toBe(true);
      expect(isNetworkError(new Error('Timeout exceeded'))).toBe(true);
      expect(isNetworkError(new Error('User validation failed'))).toBe(false);
      expect(isNetworkError(null)).toBe(false);
    });

    it('should handle non-Error objects', () => {
      expect(isNetworkError('network connection lost')).toBe(true);
      expect(isNetworkError({ message: 'internet connection issue' })).toBe(true);
      expect(isNetworkError('invalid form data')).toBe(false);
    });
  });

  describe('isOnline', () => {
    it('should return navigator.onLine value when available', () => {
      // Mock navigator.onLine as true
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        get: jest.fn(() => true),
      });
      expect(isOnline()).toBe(true);

      // Mock navigator.onLine as false
      Object.defineProperty(navigator, 'onLine', {
        configurable: true,
        get: jest.fn(() => false),
      });
      expect(isOnline()).toBe(false);
    });
  });

  describe('subscribeToNetworkStatus', () => {
    it('should notify subscribers when online/offline events occur', () => {
      const callback = jest.fn();
      const unsubscribe = subscribeToNetworkStatus(callback);
      
      // Callback should be called immediately with current status
      expect(callback).toHaveBeenCalledTimes(1);
      
      // Simulate online event
      if (mockWindowEvents['online']) {
        mockWindowEvents['online'].forEach(cb => cb());
      }
      expect(callback).toHaveBeenCalledWith(true);

      // Simulate offline event
      if (mockWindowEvents['offline']) {
        mockWindowEvents['offline'].forEach(cb => cb());
      }
      expect(callback).toHaveBeenCalledWith(false);
      
      // Unsubscribe should work
      unsubscribe();
      const currentCallCount = callback.mock.calls.length;
      
      // Simulate another event
      if (mockWindowEvents['online']) {
        mockWindowEvents['online'].forEach(cb => cb());
      }
      
      // Should not be called again after unsubscribe
      expect(callback).toHaveBeenCalledTimes(currentCallCount);
    });
  });

  describe('offlineQueue', () => {
    beforeEach(() => {
      // Mock localStorage
      Storage.prototype.getItem = jest.fn(() => null);
      Storage.prototype.setItem = jest.fn();
    });

    it('should have the correct methods', () => {
      expect(typeof offlineQueue.addToQueue).toBe('function');
      expect(typeof offlineQueue.processQueue).toBe('function');
      expect(typeof offlineQueue.getQueueSize).toBe('function');
    });

    it('should add items to queue and get queue size', () => {
      // Mock empty queue
      Storage.prototype.getItem = jest.fn(() => null);
      
      expect(offlineQueue.getQueueSize()).toBe(0);
      
      // Add an item
      offlineQueue.addToQueue({
        url: 'https://api.example.com/data',
        method: 'POST',
        body: { test: 'data' },
        headers: { 'Content-Type': 'application/json' },
        maxRetries: 3
      });
      
      // Queue size should now be 1
      expect(offlineQueue.getQueueSize()).toBe(1);
      expect(localStorage.setItem).toHaveBeenCalled();
    });
  });
});
