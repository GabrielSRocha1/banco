import { validateCPF, formatCPF, unformatCPF } from '@/utils/validators/cpf.validator';

describe('CPF Validator', () => {
  describe('validateCPF', () => {
    it('should validate correct CPF', () => {
      expect(validateCPF('12345678909')).toBe(true);
      expect(validateCPF('111.444.777-35')).toBe(true);
    });

    it('should reject invalid CPF', () => {
      expect(validateCPF('12345678901')).toBe(false);
      expect(validateCPF('000.000.000-00')).toBe(false);
      expect(validateCPF('111.111.111-11')).toBe(false);
    });

    it('should reject CPF with wrong length', () => {
      expect(validateCPF('123456789')).toBe(false);
      expect(validateCPF('123456789012')).toBe(false);
    });

    it('should reject CPF with all same digits', () => {
      expect(validateCPF('11111111111')).toBe(false);
      expect(validateCPF('99999999999')).toBe(false);
    });
  });

  describe('formatCPF', () => {
    it('should format CPF correctly', () => {
      expect(formatCPF('12345678909')).toBe('123.456.789-09');
      expect(formatCPF('111444777')).toBe('111.444.777');
      expect(formatCPF('111444')).toBe('111.444');
      expect(formatCPF('111')).toBe('111');
    });

    it('should remove non-numeric characters before formatting', () => {
      expect(formatCPF('123.456.789-09')).toBe('123.456.789-09');
      expect(formatCPF('abc123def456ghi789jkl09')).toBe('123.456.789-09');
    });
  });

  describe('unformatCPF', () => {
    it('should remove formatting', () => {
      expect(unformatCPF('123.456.789-09')).toBe('12345678909');
      expect(unformatCPF('111.444.777-35')).toBe('11144477735');
    });

    it('should handle already unformatted CPF', () => {
      expect(unformatCPF('12345678909')).toBe('12345678909');
    });
  });
});