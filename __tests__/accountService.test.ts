import { describe, it, expect } from '@jest/globals';
import { parseAmount, parseDate } from '../src/services/accountService';



describe('accountService unit tests', () => {
  
  describe('parseAmount', () => {
    it('should convert a valid string to a number', () => {
      expect(parseAmount("100")).toBe(100);
      expect(parseAmount(50)).toBe(50);
    });

    it('should throw an error if the amount is not an integer', () => {
      expect(() => parseAmount(100.5)).toThrow("Amount must be an integer value");
    });


    it('should throw an error if the amount is missing', () => {
      expect(() => parseAmount(null)).toThrow("Amount is required");
    });
  });




  describe('parseDate', () => {

    it('should correctly parse a valid DD/MM/YYYY string', () => {

      const date = parseDate("15/08/2026");
      expect(date).not.toBeNull();
      expect(date?.getFullYear()).toBe(2026);
      expect(date?.getMonth()).toBe(7); 
      expect(date?.getDate()).toBe(15);
     });


    it('should return null for invalid formats', () => {

      expect(parseDate("2026-08-15")).toBeNull(); 
      expect(parseDate("32/01/2026")).toBeNull(); 
      expect(parseDate("15/13/2026")).toBeNull(); 
      expect(parseDate("not-a-date")).toBeNull(); 
      });

  });

});