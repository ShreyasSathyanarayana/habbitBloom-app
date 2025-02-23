// import { getFontSize } from './fontScaling';

import { getFontSize } from "./font";

describe('getFontSize', () => {
  it('should return a scaled font size for a given base size', () => {
    const baseSize = 16;
    const scaledSize = getFontSize(baseSize);
    
    expect(typeof scaledSize).toBe('number');
    expect(scaledSize).toBeGreaterThan(10);
    expect(scaledSize).toBeLessThanOrEqual(30); // Allow exactly 30
  });
});
