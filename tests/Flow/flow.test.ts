import "opti";
import "opti/flow";

declare global {
  interface Document {
    nonWorkingFunction(): void
  }
}

describe("Flow.flows", () => {
  it("should be able to check if an implementation works", () => {
    expect(Flow.flows(document.createElement)).toBeTruthy();
    expect(Flow.flows(document.nonWorkingFunction)).toBeFalsy();
  });
});