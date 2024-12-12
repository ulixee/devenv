"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const linkedom_1 = require("linkedom");
const generateSelectorMap_1 = require("../injected-scripts/generateSelectorMap");
test('bitmasks should convert', () => {
    expect((0, generateSelectorMap_1.getMaxBitmaskValue)([1, 2, 3])).toEqual(BigInt(0b111));
    expect((0, generateSelectorMap_1.decodeBitmask)(BigInt(0b1010), [1, 2, 3, 4])).toEqual([2, 4]);
});
test('should be able to find a shortest path', async () => {
    const domParser = new linkedom_1.DOMParser();
    const document = domParser.parseFromString(`<body>
<div>
    <span class="link">Link</span>
</div>
</body>`, 'text/html');
    const element = document.querySelector('span');
    const results = (0, generateSelectorMap_1.default)(element, document);
    const matches = results.selectors;
    expect(matches.length).toBeGreaterThanOrEqual(50);
    expect(matches[0].selector).toBe('.link');
});
test('should be able to find a nested path', async () => {
    const domParser = new linkedom_1.DOMParser();
    const document = domParser.parseFromString(`<body>
<div id="outer">
  <div class="inner" data-id="test1">
    <p>
      <a class="link">Link</a>
      <a class="link">Link</a>
    </p>
      <a class="link">Link</a>
  </div>
  
</div>
</body>`, 'text/html');
    const element = document.querySelectorAll('a')[1];
    const results = (0, generateSelectorMap_1.default)(element, document);
    const matches = results.selectors;
    expect(matches.length).toBeGreaterThanOrEqual(50);
    expect(matches[0].selector).toBe('p > a.link:nth-child(2)');
});
//# sourceMappingURL=generateSelectorMap.test.js.map