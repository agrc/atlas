import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getUrlParameter, setUrlParameter } from './UrlParameters';

/**
 * Tests for UrlParameters module
 *
 * This module manages URL search parameters for the application.
 * - Supports string, number, boolean, and number array parameter types
 * - Uses dot (.) as separator for number arrays
 * - Does not support decimal numbers in arrays (dots are treated as separators)
 */

// Mock window.location and window.history
const mockReplaceState = vi.fn();
const mockLocation = {
  href: 'https://example.com/',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

Object.defineProperty(window, 'history', {
  value: {
    replaceState: mockReplaceState,
  },
  writable: true,
});

describe('UrlParameters', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    mockLocation.href = 'https://example.com/';
  });

  describe('setUrlParameter', () => {
    it('should set a string parameter', () => {
      setUrlParameter('basemap', 'satellite');

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', 'https://example.com/?basemap=satellite');
    });

    it('should set a number parameter', () => {
      setUrlParameter('scale', 1000);

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', 'https://example.com/?scale=1000');
    });

    it('should set a boolean parameter', () => {
      setUrlParameter('center', true);

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', 'https://example.com/?center=true');
    });

    it('should set an array parameter with dot separator', () => {
      setUrlParameter('center', [40, -111]);

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', 'https://example.com/?center=40.-111');
    });

    it('should replace existing parameter', () => {
      mockLocation.href = 'https://example.com/?basemap=streets';

      setUrlParameter('basemap', 'satellite');

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', 'https://example.com/?basemap=satellite');
    });

    it('should preserve existing parameters when adding new ones', () => {
      mockLocation.href = 'https://example.com/?existing=value';

      setUrlParameter('basemap', 'satellite');

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', 'https://example.com/?existing=value&basemap=satellite');
    });

    it('should handle empty array parameter', () => {
      setUrlParameter('center', []);

      expect(mockReplaceState).toHaveBeenCalledWith({}, '', 'https://example.com/?center=');
    });
  });

  describe('getUrlParameter', () => {
    describe('string parameters', () => {
      it('should get a string parameter', () => {
        mockLocation.href = 'https://example.com/?basemap=satellite';

        const result = getUrlParameter('basemap', 'string');

        expect(result).toBe('satellite');
      });

      it('should return null for missing string parameter', () => {
        mockLocation.href = 'https://example.com/';

        const result = getUrlParameter('basemap', 'string');

        expect(result).toBeNull();
      });

      it('should return default value for missing string parameter', () => {
        mockLocation.href = 'https://example.com/';

        const result = getUrlParameter('basemap', 'string', 'streets');

        expect(result).toBe('streets');
      });
    });

    describe('boolean parameters', () => {
      it('should get true boolean parameter', () => {
        mockLocation.href = 'https://example.com/?center=true';

        const result = getUrlParameter('center', 'boolean');

        expect(result).toBe(true);
      });

      it('should get false boolean parameter', () => {
        mockLocation.href = 'https://example.com/?center=false';

        const result = getUrlParameter('center', 'boolean');

        expect(result).toBe(false);
      });

      it('should return false for non-true string', () => {
        mockLocation.href = 'https://example.com/?center=maybe';

        const result = getUrlParameter('center', 'boolean');

        expect(result).toBe(false);
      });

      it('should return false for missing boolean parameter', () => {
        mockLocation.href = 'https://example.com/';

        const result = getUrlParameter('center', 'boolean');

        expect(result).toBe(false);
      });

      it('should return default value for missing boolean parameter', () => {
        mockLocation.href = 'https://example.com/';

        const result = getUrlParameter('center', 'boolean', true);

        expect(result).toBe(true);
      });
    });

    describe('number parameters', () => {
      it('should get a number parameter', () => {
        mockLocation.href = 'https://example.com/?scale=1000';

        const result = getUrlParameter('scale', 'number');

        expect(result).toBe(1000);
      });

      it('should get a decimal number parameter', () => {
        mockLocation.href = 'https://example.com/?scale=1000.5';

        const result = getUrlParameter('scale', 'number');

        expect(result).toBe(1000.5);
      });

      it('should return null for missing number parameter', () => {
        mockLocation.href = 'https://example.com/';

        const result = getUrlParameter('scale', 'number');

        expect(result).toBeNull();
      });

      it('should return default value for missing number parameter', () => {
        mockLocation.href = 'https://example.com/';

        const result = getUrlParameter('scale', 'number', 5000);

        expect(result).toBe(5000);
      });

      it('should handle NaN for invalid number string', () => {
        mockLocation.href = 'https://example.com/?scale=invalid';

        const result = getUrlParameter('scale', 'number');

        expect(result).toBeNaN();
      });
    });

    describe('number array parameters', () => {
      it('should get a number array parameter', () => {
        mockLocation.href = 'https://example.com/?center=40.-111';

        const result = getUrlParameter('center', 'number[]');

        expect(result).toEqual([40, -111]);
      });

      it('should get a single number array parameter', () => {
        mockLocation.href = 'https://example.com/?center=1000';

        const result = getUrlParameter('center', 'number[]');

        expect(result).toEqual([1000]);
      });

      it('should return null for missing number array parameter', () => {
        mockLocation.href = 'https://example.com/';

        const result = getUrlParameter('center', 'number[]');

        expect(result).toBeNull();
      });

      it('should return default value for missing number array parameter', () => {
        mockLocation.href = 'https://example.com/';

        const result = getUrlParameter('center', 'number[]', [0, 0]);

        expect(result).toEqual([0, 0]);
      });

      it('should handle empty string as null', () => {
        mockLocation.href = 'https://example.com/?center=';

        const result = getUrlParameter('center', 'number[]');

        expect(result).toBeNull();
      });

      it('should handle mixed valid and invalid numbers', () => {
        mockLocation.href = 'https://example.com/?center=40.invalid.-111';

        const result = getUrlParameter('center', 'number[]');

        expect(result).toEqual([40, NaN, -111]);
      });

      it('should handle three or more numbers', () => {
        mockLocation.href = 'https://example.com/?center=1.2.3.4.5';

        const result = getUrlParameter('center', 'number[]');

        expect(result).toEqual([1, 2, 3, 4, 5]);
      });

      it('should not support decimal numbers in arrays (dots are separators)', () => {
        // This demonstrates that decimal numbers are not supported in arrays
        // because dots are used as separators
        mockLocation.href = 'https://example.com/?center=40.5';

        const result = getUrlParameter('center', 'number[]');

        expect(result).toEqual([40, 5]); // 40.5 becomes [40, 5]
      });
    });

    describe('edge cases', () => {
      it('should handle URL with fragment', () => {
        mockLocation.href = 'https://example.com/?basemap=satellite#section';

        const result = getUrlParameter('basemap', 'string');

        expect(result).toBe('satellite');
      });

      it('should handle URL with multiple parameters', () => {
        mockLocation.href = 'https://example.com/?basemap=satellite&scale=1000&center=40.-111';

        expect(getUrlParameter('basemap', 'string')).toBe('satellite');
        expect(getUrlParameter('scale', 'number')).toBe(1000);
        expect(getUrlParameter('center', 'number[]')).toEqual([40, -111]);
      });

      it('should handle encoded URL parameters', () => {
        mockLocation.href = 'https://example.com/?basemap=my%20map';

        const result = getUrlParameter('basemap', 'string');

        expect(result).toBe('my map');
      });

      it('should handle parameter with no value', () => {
        mockLocation.href = 'https://example.com/?basemap';

        const result = getUrlParameter('basemap', 'string');

        expect(result).toBe('');
      });
    });
  });

  describe('integration scenarios', () => {
    it('should work with set then get string parameter', () => {
      setUrlParameter('basemap', 'satellite');

      // Mock the URL that would result from setUrlParameter
      mockLocation.href = 'https://example.com/?basemap=satellite';

      const result = getUrlParameter('basemap', 'string');

      expect(result).toBe('satellite');
    });

    it('should work with set then get number array parameter', () => {
      const coordinates = [40, -111];
      setUrlParameter('center', coordinates);

      // Mock the URL that would result from setUrlParameter
      mockLocation.href = 'https://example.com/?center=40.-111';

      const result = getUrlParameter('center', 'number[]');

      expect(result).toEqual(coordinates);
    });

    it('should work with set then get boolean parameter', () => {
      setUrlParameter('center', true);

      // Mock the URL that would result from setUrlParameter
      mockLocation.href = 'https://example.com/?center=true';

      const result = getUrlParameter('center', 'boolean');

      expect(result).toBe(true);
    });

    it('should work with set then get number parameter', () => {
      setUrlParameter('scale', 1000);

      // Mock the URL that would result from setUrlParameter
      mockLocation.href = 'https://example.com/?scale=1000';

      const result = getUrlParameter('scale', 'number');

      expect(result).toBe(1000);
    });
  });
});
