const { validateUrl } = require("./server");

test("URL validator should working perfectly", () => {
    expect(validateUrl("https://www.google.com")).toBe(true);
})