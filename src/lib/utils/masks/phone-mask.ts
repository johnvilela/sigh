import { clearMask } from "../clear-mask";

export function phoneMask (value: string): string {
  const numericValue = clearMask(value);
  const limitedValue = numericValue.slice(0, 11);

  return limitedValue
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}