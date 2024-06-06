import assert from 'assert';
import StyleGuide from './StyleGuide.js';

describe('js/StyleGuide', () => {
  it('should be importable.', async () => {
    const { default: actual } = await import('./StyleGuide.js');

    assert(actual === StyleGuide);
  });
});
