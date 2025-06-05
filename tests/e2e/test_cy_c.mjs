import { incrementCounter } from '../../utils/sharedState.js';

describe('Test C - Shared State', () => {
  it('should have fresh counter value', () => {
    const value = incrementCounter();
    expect(value).to.eq(0);
  });
});
