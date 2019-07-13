const cc = require('../src/modules/case-converter');

// test("stripping invalid JS characters", () => {
//     expect(cc("0sJZKŻÓIL-_sad:sadsa./2$$%")).toBe("0sJZKIL-_sadsadsa2");
// });

test("digit error", () => {
    expect(cc("lol3")).toBe('lol3')
});

test("- test", () => {
    expect(cc("moje-id-jest---fajowe---")).toBe('mojeIdJestFajowe');
});