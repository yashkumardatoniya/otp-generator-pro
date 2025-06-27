const crypto = require("crypto");

/**
OTP Generator (otp-generator-pro) with customizable options
@param {object} options - Configuration options for OTP genertion
@param {number} options.length - Length of the OTP (default: 6)
@param {boolean} options.digits - Include digits 0-9 (default: true)
@param {boolean} options.lowerCase - Include lowercase Letters a-z (default: false)
@param {boolean} options.upperCase - Include uppercase letters A-Z (default: false)
@param {boolean} options.specialChars - Include special characteres like '!@#$^&*()_-+=[]{}|;:,.<>?' (default: false)
@param {string} options.customChars - Custom Characters set to use
@param {number|string} options.expiresIn - Expiration time in seconds or string format (e.g., '5m', '1h')
@returns {string} Generated OTP

*/

function generateOTP(options = {}) {
  const config = {
    length: 6,
    digits: true,
    lowerCase: false,
    upperCase: false,
    specialChars: false,
    customChars: "",
    expiresIn: null,
    ...options,
  };

  if (config.length < 1 || config.length > 32) {
    throw new Error("OTP length must be between 1 to 32 characters");
  }

  const charSets = {
    digits: "0123456789",
    lowerCase: "abcdefghijklmnopqrstuvwxyz",
    upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    specialChars: "!@#$%^&*()_-+=[]{}|:;,.<>?",
  };

  let charPool = "";

  if (config.customChars) {
    charPool = config.customChars;
  } else {
    if (config.digits) charPool += charSets.digits;
    if (config.lowerCase) charPool += charSets.lowerCase;
    if (config.upperCase) charPool += charSets.upperCase;
    if (config.specialChars) charPool += charSets.specialChars;
  }

  if (!charPool) {
    charPool = charSets.digits;
  }

  if (charPool.length === 0) {
    throw new Error("No valid characters available for OTP generation");
  }
  let otp = "";
  for (let i = 0; i < config.length; i++) {
    const randomIndex = getSecureRandomInt(0, charPool.length);
    otp += charPool[randomIndex];
  }

  if (config.expiresIn !== null) {
    const expirationTime = parseExpirationTime(config.expiresIn);
    const expiresAt = new Date(Date.now() + expirationTime * 1000);

    const otpData = {
      otp,
      expiresAt,
      createdAt: new Date(),
      isExpired: false,
      attemps: 0,
    };
    return {
      otp,
      expiresAt,
      createdAt: otpData.createdAt,
      expiresIn: expirationTime,
    };
  }
  return otp;
}

/** Generate cryptographically secure random integer
 * @param {number}  Min - Minimum value (inclusive)
 * @param {number}  Max -  Maximum value (exclusive)
 * @returns {number} Secure random integer
 */
function getSecureRandomInt(min, max) {
  const range = max - min;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8);
  const maxValidValue = Math.floor(256 ** bytesNeeded / range) * range - 1;

  let randomValue;
  do {
    const randomBytes = crypto.randomBytes(bytesNeeded);
    randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = randomValue * 256 + randomBytes[i];
    }
  } while (randomValue > maxValidValue);

  return min + (randomValue % range);
}

/**
 * Parsing expiration time from string or number
 * @param {number|string} expiresIn - Expiration time
 * @returns {number} Expiration time in seconds
 */

function parseExpirationTime(expiresIn) {
  if (typeof expiresIn === "number") {
    return expiresIn;
  }

  if (typeof expiresIn === "string") {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      throw new Error(
        'Invalid expiration format. Use number (second) or string like "5m", "1h", "30s"'
      );
    }

    const value = parseInt(match[1], 10);
    const unit = match[2] || "s";

    switch (unit) {
      case "s":
        return value;
      case "m":
        return value * 60;
      case "h":
        return value * 60 * 60;
      case "d":
        return value * 24 * 60 * 60;
      default:
        throw new Error("Invalid time unit. Use s, m, h, or d");
    }
  }
  throw new Error("expiresIn must be a number (seconds) or string");
}

/**
 * Generate numeric OTP (digits only)
 * @param {number} length - Length of the OTP (default: 6)
 * @param {number|string} expiresIn - Expiration time
 * @returns {string|Object} Numeric OTP
 */
function generateNumericOTP(length = 6, expiresIn = null) {
  const options = { length, digits: true };
  if (expiresIn) options.expiresIn = expiresIn;
  return generateOTP(options);
}

/**
 * Generate alphanumeric OTP (digits + letters)
 * @param {number} length - Length of the OTP (default: 8)
 * @param {number|string} expiresIn - Expiration time
 * @returns {string|Object} Alphanumeric OTP
 */

function generateAlphaNumericOTP(length = 8, expiresIn = null) {
  const options = {
    length,
    digits: true,
    lowerCase: true,
    upperCase: true,
  };

  if (expiresIn) options.expiresIn = expiresIn;
  return generateOTP(options);
}

/**
 * Generate complex OTP (all character types)
 * @param {number} length - Length of the OTP (default: 12)
 * @param {number|string} expiresIn - Expiration time
 * @param {string} identifier - Unique identifier
 * @returns {string|Object} Complex OTP
 */

function generateComplexOTP(length = 12, expiresIn = null) {
  const options = {
    length,
    digits: true,
    lowerCase: true,
    upperCase: true,
    specialChars: true,
  };
  if (expiresIn) options.expiresIn = expiresIn;
  return generateOTP(options);
}

module.exports = {
  generateOTP,
  generateNumericOTP,
  generateAlphaNumericOTP,
  generateComplexOTP,
};
