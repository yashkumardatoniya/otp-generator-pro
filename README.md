# OTP Generator Pro

#otp-generator-pro

A secure, easy-to-use, and highly configurable OTP (One-Time Password) generator for Node.js applications with extensive customization options.

# Installation

```bash
npm install @yashdatoniya/otp-generator-pro
```

# Quick Start

```javaScript

const {generateOTP} = require('@yashdatoniya/otp-generator-pro');

// Generate a simple 6-digit OTP

const otp = generateOTP();
console.log(otp);

// Generate a custom length & character types
const customOTP = generateOTP({
length: 8,
digits: true,
lowerCase: true,
upperCase: true,
specialChars: true
});
console.log(customOTP);

// Generate OTP with expiration time

const otpWithExpiration = generateOTP({expiresIn: "5m"});
console.log(otpWithExpiration);

/*
{
otp: "789843",
expiresAt: 2025-06-25T10:35:00.000Z,
createdAt: 2025-06-25T10:30:00.000Z,
expiresIn: 300
}
*/
```

# API Reference

**1. generateOTP(options)**

Generates an OTP with custom configuration options.

**Parameters**

**`options` (Object): Configuration object**

- `length` (number): Length of the OTP (default: 6, min: 1, max: 32)
- `digits` (boolean): Include digits 0-9 (default:true)
- `lowerCase` (boolean): Include lowercase letters a-z (default: false);
- `upperCase` (boolean): Include uppercase letters A-Z (default: false)
- `specialChars` (boolean): Include special characters (default: false);
- `customChars` (string): Custom character set to use;
- `expireIn` (number|string): seconds or string '5m', '1h', etc;

**Returns**

- **Without expiration:** `string`: Generated OTP
- **With expiration:** `object`: Object containing OTP and expiration details

```javascript
// Default 6-digit numeric OTP
const otp = generateOTP(); // "123456"

// Custom length
const longOtp = generateOTP({ length: 8 });
// "12345678"

// 8-character alphanumeric OTP

const alphaOtp = generateOTP({
  length: 8,
  digits: true,
  lowerCase: true,
  upperCase: true,
});
// "A7b2X9k1"

// Custom character set
const customOtp = generateOTP({
  length: 6,
  customChars: "ABCDEF123456",
});
// "AB3C5F"

//With expiration
generateOTP({
  length: 6,
  digits: true,
  expiresIn: "5m",
});
// "234567"

// With expiration (number in seconds)
const otpWithExpiry = generateOTP({ expiresIn: 300 });

// With expiration (string format)
const otpWithStringExpiry = generateOTP({ expiresIn: "5m" });
```

**3. generateNumericOTP(length, expiresIn)**

Generate numeric-only OTP (digits 0-9).

```javascript \
const numericOtp = generateNumericOTP(6);
// "123456"

const numericWithExpiry = generateNumericOTP(8, "10m");
// Returns object with 8-digit numeric OTP and 10-minute expiration
```

**4. generateAlphaNumericOTP(length, expiresIn)**

Generate alpha-numeric OTP (digits + letters).

```javascript
const alphaNumOtp = generateAlphaNumericOTP(8);
// "A3b7K9m2"

const alphaNumWithExpiry = generateAlphaNumericOTP(12, "1h");
// Returns object with 12-character alphanumeric OTP and 1-hour expiration
```

**5.generateComplexOTP(length, expiresIn)**

Generate complex OTP with all character types.

```javascript
const complexOtp = generateComplexOTP(12);
// "A3b7K9m2!@#"

const complexWithExpiry = generateComplexOTP(16, "30m");
// Returns object with 16-character complex OTP and 30-minute expiration
```

**Expiration Time Formats**

The `expiresIn` parameter accepts:

- **Number:** Time in seconds
- **String:** Time with unit suffix

| Format | Description | Examples |
| :----- | :---------- | :------- |
| `30`   | 30 seconds  | `30`     |
| `30s`  | 30 seconds  | `30s`    |
| `5m`   | 5 minutes   | `5m`     |
| `1h`   | 1 hours     | `1h`     |
| `1d`   | 1 day       | `1d`     |

**Expiration Response Object**

When `expiresIn` is provided, the function return an object:

```javascript
{
  otp: "123456",              // The generated OTP
  expiresAt: Date,            // Expiration timestamp
  createdAt: Date,            // Creation timestamp
  expiresIn: 300              // Expiration time in seconds
}
```

**Character Sets**

**Default Character Sets**

- **Digits:** `0123456789`
- **Lowercase:** `abcdefghijklmnopqrstuvwxyz`
- **Uppercase:** `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
- **Special Characters:** `!@#$%^&*()_-+=[]{}|:;,.<>?`

**Custom Character Sets**

You can provide your own character set using the `customChars` option:

```javascript
const otp = generateOTP({
  length: 8,
  customChars: "0123456789ABCDEF", // Hexadecimal characters only
});
```

**Error Handling**

The library provides clear error message for invalid inputs

```javascript
// Invalid length
generateOTP({ length: 0 });
// Error: OTP length must be between 1 to 32 characters

// Invalid expiration format
generateOTP({ expiresIn: "invalid" });
// Error: Invalid expiration format. Use number (second) or string like "5m", "1h", "30s"

// Invalid time unit
generateOTP({ expiresIn: "5x" });
// Error: Invalid expiration format. Use number (second) or string like "5m", "1h", "30s"
```

## Usage Examples

**Email Verification**

```javascript
const { generateNumericOTP } = require("@yashdatoniya/otp-generator-pro");

// Generate 6-digit OTP valid for 10 minutes
const emailOtp = generateNumericOTP(6, "10m");

console.log(`Your verification code: ${emailOtp.otp}`);
console.log(`Expires at: ${emailOtp.expiresAt.toLocaleString()}`);
```

**SMS Authentication**

```javascript
const { generateOTP } = require("@yashdatoniya/otp-generator-pro");

// Generate 4-digit OTP for SMS (shorter for mobile)
const smsOtp = generateOTP({
  length: 4,
  digits: true,
  expiresIn: "5m",
});

console.log(`SMS Code: ${smsOtp.otp}`);
```

**Two-Factor Authentication**

```javascript
const { generateAlphaNumericOTP } = require("@yashdatoniya/otp-generator-pro");

// Generate 8-character alphanumeric code for 2FA
const twoFactorCode = generateAlphaNumericOTP(8, "15m");

console.log(`2FA Code: ${twoFactorCode.otp}`);
```

**Secure Token Generation**

```javascript
const { generateComplexOTP } = require("@yashdatoniya/otp-generator-pro");

// Generate complex token for secure operations
const secureToken = generateComplexOTP(32, "1h");

console.log(`Secure Token: ${secureToken.otp}`);
```

## Features

**Cryptographically Secure:** Uses Node.js crypto module for secure random generation.

**Highly Customizable:** Configure length, character sets, exclusions, and more.

**Multiple Presets:** Numeric, alphanumeric, and complex OTP generators.

**Validation:** Built-in OTP validation functionality.

**Zero Dependencies:** Lightweight with no external dependencies

**TypeScript Support:** Full TypeScript declarations included

## Testing

Run the comprehensive test suite:

```bash
npm test
```

### Keywords

`otp`
`generator`
`one-time-password`
`security`
