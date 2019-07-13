const vE = require('../src/modules/var-extractor');

test("workin?", () => {
    console.log(vE("Hej, %{name}! Miło cię, %{varhehe} widzieć"));
    expect(2+2).toBe(4);
});

test("custom pattern", () => {
    console.log(vE("Hej, &&{name}! Miło cię, &&{varhehe} widzieć", "&&{#}"));
    expect(2+2).toBe(4);
});