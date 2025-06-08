// Base64url encoding/decoding utilities
function base64urlEncode (buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

function base64urlDecode (str: string): Uint8Array {
  // Add padding if needed
  str += '='.repeat((4 - str.length % 4) % 4);
  // Replace base64url chars with base64 chars
  str = str.replace(/-/g, '+').replace(/_/g, '/');

  const binary = atob(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function textToBuffer (text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function bufferToText (buffer: Uint8Array): string {
  return new TextDecoder().decode(buffer);
}

function parseDuration (duration: string): number {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) throw new Error('Invalid duration format');

  const value = parseInt(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's': return value;
    case 'm': return value * 60;
    case 'h': return value * 60 * 60;
    case 'd': return value * 60 * 60 * 24;
    default: throw new Error('Invalid duration unit');
  }
}

export function jwtService () {
  const secret = process.env.JWT_SECRET || 'default_secret';

  return {
    async sign ({ payload, expiresIn }: { expiresIn: string, payload: object }): Promise<string> {
      const secretKey = await crypto.subtle.importKey(
        'raw',
        textToBuffer(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign', 'verify']
      );

      const header = {
        alg: 'HS256',
        typ: 'JWT'
      };

      const now = Math.floor(Date.now() / 1000);
      const exp = now + parseDuration(expiresIn);

      const claims = {
        ...payload,
        iat: now,
        exp: exp
      };

      // Encode header and payload
      const encodedHeader = base64urlEncode(textToBuffer(JSON.stringify(header)));
      const encodedPayload = base64urlEncode(textToBuffer(JSON.stringify(claims)));

      // Create signature
      const signingInput = `${encodedHeader}.${encodedPayload}`;
      const signature = await crypto.subtle.sign(
        'HMAC',
        secretKey,
        textToBuffer(signingInput)
      );

      const encodedSignature = base64urlEncode(signature);

      return `${signingInput}.${encodedSignature}`;
    },

    async verify (token: string): Promise<boolean> {
      try {
        const secretKey = await crypto.subtle.importKey(
          'raw',
          textToBuffer(secret),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign', 'verify']
        );

        const parts = token.split('.');
        if (parts.length !== 3) {
          return false;
        }

        const [encodedHeader, encodedPayload, encodedSignature] = parts;

        // Verify signature
        const signingInput = `${encodedHeader}.${encodedPayload}`;
        const signature = base64urlDecode(encodedSignature);

        const isValidSignature = await crypto.subtle.verify(
          'HMAC',
          secretKey,
          signature,
          textToBuffer(signingInput)
        );

        if (!isValidSignature) {
          return false;
        }

        // Check expiration
        const payloadData = JSON.parse(bufferToText(base64urlDecode(encodedPayload)));
        const now = Math.floor(Date.now() / 1000);

        if (payloadData.exp && payloadData.exp < now) {
          return false;
        }

        return true;
      } catch {
        return false;
      }
    }
  };
}