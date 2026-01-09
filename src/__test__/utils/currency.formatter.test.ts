import {
  formatBRL,
  formatUSD,
  abbreviateNumber,
  abbreviateAddress,
} from '@/utils/formatters/currency';

describe('Currency Formatter', () => {
  describe('formatBRL', () => {
    it('should format BRL correctly', () => {
      expect(formatBRL(1000)).toBe('R$ 1.000,00');
      expect(formatBRL(1234.56)).toBe('R$ 1.234,56');
      expect(formatBRL(0.5)).toBe('R$ 0,50');
    });
  });

  describe('formatUSD', () => {
    it('should format USD correctly', () => {
      expect(formatUSD(1000)).toBe('$1,000.00');
      expect(formatUSD(1234.56)).toBe('$1,234.56');
    });
  });

  describe('abbreviateNumber', () => {
    it('should abbreviate large numbers', () => {
      expect(abbreviateNumber(1500)).toBe('1.5K');
      expect(abbreviateNumber(1500000)).toBe('1.5M');
      expect(abbreviateNumber(1500000000)).toBe('1.5B');
    });

    it('should not abbreviate small numbers', () => {
      expect(abbreviateNumber(500)).toBe('500');
    });
  });

  describe('abbreviateAddress', () => {
    it('should abbreviate blockchain address', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      expect(abbreviateAddress(address)).toBe('0x1234...5678');
    });

    it('should handle custom lengths', () => {
      const address = '0x1234567890abcdef1234567890abcdef12345678';
      expect(abbreviateAddress(address, 8, 6)).toBe('0x123456...345678');
    });

    it('should return original if too short', () => {
      const address = '0x1234';
      expect(abbreviateAddress(address)).toBe('0x1234');
    });
  });
});