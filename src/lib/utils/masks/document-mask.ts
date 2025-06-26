import { clearMask } from "../clear-mask";

export function documentMask (value: string, type?: 'CPF' | 'RG'): string {
  // Remove all non-numeric characters
  const cleanValue = clearMask(value);

  // Determine type based on length if not provided
  const documentType = type || (cleanValue.length <= 9 ? 'RG' : 'CPF');

  if (documentType === 'CPF') {
    return applyCPFMask(cleanValue);
  } else {
    return applyRGMask(cleanValue);
  }
}

function applyCPFMask (value: string): string {
  // Limit to 11 digits
  const limitedValue = value.slice(0, 11);

  // Apply CPF mask: XXX.XXX.XXX-XX
  return limitedValue
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2');
}

function applyRGMask (value: string): string {
  // Limit to 9 digits
  const limitedValue = value.slice(0, 9);

  // Apply RG mask: XX.XXX.XXX-X
  return limitedValue
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1})/, '$1-$2');
}