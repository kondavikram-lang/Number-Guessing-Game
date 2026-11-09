/**
 * Selects a cryptographically secure uniform random integer between min and max (inclusive)
 * using window.crypto.getRandomValues with rejection sampling to eliminate modulo bias.
 */
export function generateSecretNumber(min: number, max: number): number {
  if (min > max) {
    throw new Error('min must be less than or equal to max');
  }

  const range = max - min + 1;
  const array = new Uint32Array(1);
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % range);

  let randomVal: number;
  do {
    window.crypto.getRandomValues(array);
    randomVal = array[0];
  } while (randomVal >= limit);

  return min + (randomVal % range);
}
