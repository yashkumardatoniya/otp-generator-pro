const {
  generateOTP,
  generateNumericOTP,
  generateAlphaNumericOTP,
  generateComplexOTP,
} = require("../index");

describe("OTP Generator Test Suite", () => {
  describe("generateOTP", () => {
    describe("Basic functionality", () => {
      test("should generate OTP with default options (6 digits)", () => {
        const otp = generateOTP();
        expect(typeof otp).toBe("string");
        expect(otp).toHaveLength(6);
        expect(/^\d{6}$/.test(otp)).toBe(true);
      });

      test("should generate OTP with custom length", () => {
        const lengths = [1, 4, 8, 16, 32];
        lengths.forEach((length) => {
          const otp = generateOTP({ length });
          expect(otp).toHaveLength(length);
          expect(/^\d+$/.test(otp)).toBe(true);
        });
      });

      test("should throw error for invalid length", () => {
        expect(() => generateOTP({ length: 0 })).toThrow(
          "OTP length must be between 1 to 32 characters"
        );
        expect(() => generateOTP({ length: -1 })).toThrow(
          "OTP length must be between 1 to 32 characters"
        );
        expect(() => generateOTP({ length: 33 })).toThrow(
          "OTP length must be between 1 to 32 characters"
        );
      });
    });

    describe("Character set options", () => {
      test("should generate digits only OTP", () => {
        const otp = generateOTP({ length: 10, digits: true });
        expect(/^\d{10}$/.test(otp)).toBe(true);
      });

      test("should generate lowercase letters only OTP", () => {
        const otp = generateOTP({
          length: 10,
          digits: false,
          lowerCase: true,
        });
        expect(/^[a-z]{10}$/.test(otp)).toBe(true);
      });

      test("should generate uppercase letters only OTP", () => {
        const otp = generateOTP({
          length: 10,
          digits: false,
          upperCase: true,
        });
        expect(/^[A-Z]{10}$/.test(otp)).toBe(true);
      });

      test("should generate special characters only OTP", () => {
        const otp = generateOTP({
          length: 10,
          digits: false,
          specialChars: true,
        });
        expect(/^[!@#$%^&*()_\-+=\[\]{}|:;,.<>?]{10}$/.test(otp)).toBe(true);
      });

      test("should generate mixed character set OTP", () => {
        const otp = generateOTP({
          length: 20,
          digits: true,
          lowerCase: true,
          upperCase: true,
          specialChars: true,
        });
        expect(otp).toHaveLength(20);

        expect(
          /[0-9]/.test(otp) || /[a-z]/.test(otp) || /[A-Z]/.test(otp)
        ).toBe(true);
      });

      test("should use custom character set", () => {
        const customChars = "ABC123";
        const otp = generateOTP({
          length: 10,
          customChars,
        });
        expect(otp).toHaveLength(10);
        expect(/^[ABC123]{10}$/.test(otp)).toBe(true);
      });

      test("should default to digits when no character sets are enabled", () => {
        const otp = generateOTP({
          length: 6,
          digits: false,
          lowerCase: false,
          upperCase: false,
          specialChars: false,
        });
        expect(/^\d{6}$/.test(otp)).toBe(true);
      });

      test("should prioritize custom chars over other options", () => {
        const customChars = "XYZ";
        const otp = generateOTP({
          length: 6,
          digits: true,
          lowerCase: true,
          customChars,
        });
        expect(/^[XYZ]{6}$/.test(otp)).toBe(true);
      });
    });

    describe("Expiration functionality", () => {
      test("should return object with expiration when expiresIn is set (number)", () => {
        const result = generateOTP({ expiresIn: 300 });

        expect(typeof result).toBe("object");
        expect(result).toHaveProperty("otp");
        expect(result).toHaveProperty("expiresAt");
        expect(result).toHaveProperty("createdAt");
        expect(result).toHaveProperty("expiresIn");

        expect(typeof result.otp).toBe("string");
        expect(result.otp).toHaveLength(6);
        expect(result.expiresAt instanceof Date).toBe(true);
        expect(result.createdAt instanceof Date).toBe(true);
        expect(result.expiresIn).toBe(300);
      });

      test("should return object with expiration when expiresIn is set (string)", () => {
        const result = generateOTP({ expiresIn: "5m" });

        expect(typeof result).toBe("object");
        expect(result.expiresIn).toBe(300);

        const timeDiff =
          result.expiresAt.getTime() - result.createdAt.getTime();
        expect(timeDiff).toBe(300000);
      });

      test("should parse different time units correctly", () => {
        const testCases = [
          { input: "30s", expected: 30 },
          { input: "5m", expected: 300 },
          { input: "2h", expected: 7200 },
          { input: "1d", expected: 86400 },
          { input: 60, expected: 60 },
        ];

        testCases.forEach(({ input, expected }) => {
          const result = generateOTP({ expiresIn: input });
          expect(result.expiresIn).toBe(expected);
        });
      });

      test("should throw error for invalid expiration format", () => {
        expect(() => generateOTP({ expiresIn: "invalid" })).toThrow(
          'Invalid expiration format. Use number (second) or string like "5m", "1h", "30s"'
        );

        expect(() => generateOTP({ expiresIn: "5x" })).toThrow(
          'Invalid expiration format. Use number (second) or string like "5m", "1h", "30s"'
        );

        expect(() => generateOTP({ expiresIn: {} })).toThrow(
          "expiresIn must be a number (seconds) or string"
        );
      });
    });

    describe("Randomness and uniqueness", () => {
      test("should generate different OTPs on multiple calls", () => {
        const otps = new Set();
        for (let i = 0; i < 100; i++) {
          otps.add(generateOTP({ length: 8 }));
        }

        expect(otps.size).toBeGreaterThan(90);
      });

      test("should use all characters from the character set over many generations", () => {
        const customChars = "ABCDE";
        const usedChars = new Set();

        for (let i = 0; i < 1000; i++) {
          const otp = generateOTP({
            length: 1,
            customChars,
          });
          usedChars.add(otp);
        }

        // Should have used all 5 characters
        expect(usedChars.size).toBe(5);
        expect([...usedChars].sort()).toEqual(["A", "B", "C", "D", "E"]);
      });
    });
  });

  describe("generateNumericOTP", () => {
    test("should generate numeric OTP with default length", () => {
      const otp = generateNumericOTP();
      expect(typeof otp).toBe("string");
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    test("should generate numeric OTP with custom length", () => {
      const otp = generateNumericOTP(10);
      expect(otp).toHaveLength(10);
      expect(/^\d{10}$/.test(otp)).toBe(true);
    });

    test("should return object when expiration is set", () => {
      const result = generateNumericOTP(6, 300);
      expect(typeof result).toBe("object");
      expect(result).toHaveProperty("otp");
      expect(/^\d{6}$/.test(result.otp)).toBe(true);
      expect(result.expiresIn).toBe(300);
    });

    test("should work with string expiration", () => {
      const result = generateNumericOTP(8, "10m");
      expect(result.expiresIn).toBe(600);
      expect(/^\d{8}$/.test(result.otp)).toBe(true);
    });
  });

  describe("generateAlphaNumericOTP", () => {
    test("should generate alphanumeric OTP with default length", () => {
      const otp = generateAlphaNumericOTP();
      expect(typeof otp).toBe("string");
      expect(otp).toHaveLength(8);
      expect(/^[a-zA-Z0-9]{8}$/.test(otp)).toBe(true);
    });

    test("should generate alphanumeric OTP with custom length", () => {
      const otp = generateAlphaNumericOTP(12);
      expect(otp).toHaveLength(12);
      expect(/^[a-zA-Z0-9]{12}$/.test(otp)).toBe(true);
    });

    test("should return object when expiration is set", () => {
      const result = generateAlphaNumericOTP(10, 600);
      expect(typeof result).toBe("object");
      expect(result).toHaveProperty("otp");
      expect(/^[a-zA-Z0-9]{10}$/.test(result.otp)).toBe(true);
      expect(result.expiresIn).toBe(600);
    });

    test("should contain mix of character types over multiple generations", () => {
      const hasDigit = new Set();
      const hasLower = new Set();
      const hasUpper = new Set();

      for (let i = 0; i < 100; i++) {
        const otp = generateAlphaNumericOTP(20);
        if (/\d/.test(otp)) hasDigit.add(true);
        if (/[a-z]/.test(otp)) hasLower.add(true);
        if (/[A-Z]/.test(otp)) hasUpper.add(true);
      }

      expect(hasDigit.has(true)).toBe(true);
      expect(hasLower.has(true)).toBe(true);
      expect(hasUpper.has(true)).toBe(true);
    });
  });

  describe("generateComplexOTP", () => {
    test("should generate complex OTP with default length", () => {
      const otp = generateComplexOTP();
      expect(typeof otp).toBe("string");
      expect(otp).toHaveLength(12);
      expect(/^[a-zA-Z0-9!@#$%^&*()_\-+=\[\]{}|:;,.<>?]{12}$/.test(otp)).toBe(
        true
      );
    });

    test("should generate complex OTP with custom length", () => {
      const otp = generateComplexOTP(16);
      expect(otp).toHaveLength(16);
      expect(/^[a-zA-Z0-9!@#$%^&*()_\-+=\[\]{}|:;,.<>?]{16}$/.test(otp)).toBe(
        true
      );
    });

    test("should return object when expiration is set", () => {
      const result = generateComplexOTP(15, "1h");
      expect(typeof result).toBe("object");
      expect(result).toHaveProperty("otp");
      expect(result.otp).toHaveLength(15);
      expect(result.expiresIn).toBe(3600);
    });

    test("should contain variety of character types over multiple generations", () => {
      const hasDigit = new Set();
      const hasLower = new Set();
      const hasUpper = new Set();
      const hasSpecial = new Set();

      for (let i = 0; i < 100; i++) {
        const otp = generateComplexOTP(20);
        if (/\d/.test(otp)) hasDigit.add(true);
        if (/[a-z]/.test(otp)) hasLower.add(true);
        if (/[A-Z]/.test(otp)) hasUpper.add(true);
        if (/[!@#$%^&*()_\-+=\[\]{}|:;,.<>?]/.test(otp)) hasSpecial.add(true);
      }

      expect(hasDigit.has(true)).toBe(true);
      expect(hasLower.has(true)).toBe(true);
      expect(hasUpper.has(true)).toBe(true);
      expect(hasSpecial.has(true)).toBe(true);
    });
  });

  describe("Edge cases and error handling", () => {
    test("should handle empty custom character set gracefully", () => {
      const otp = generateOTP({ customChars: "" });
      expect(typeof otp).toBe("string");
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    test("should handle very large numbers for expiration", () => {
      const result = generateOTP({ expiresIn: 999999999 });
      expect(result.expiresIn).toBe(999999999);
    });

    test("should handle zero expiration time", () => {
      const result = generateOTP({ expiresIn: 0 });
      expect(result.expiresIn).toBe(0);
      // Should expire immediately or very soon
      expect(result.expiresAt.getTime()).toBeLessThanOrEqual(Date.now() + 1000);
    });
  });

  describe("Performance tests", () => {
    test("should generate OTP quickly", () => {
      const start = Date.now();
      for (let i = 0; i < 1000; i++) {
        generateOTP();
      }
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(1000);
    });

    test("should handle maximum length efficiently", () => {
      const start = Date.now();
      const otp = generateOTP({ length: 32 });
      const duration = Date.now() - start;

      expect(otp).toHaveLength(32);
      expect(duration).toBeLessThan(100);
    });
  });
});
