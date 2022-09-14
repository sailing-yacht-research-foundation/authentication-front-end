export const defineWindowMatchMedia = () => {
    Object.defineProperty(window, "matchMedia", { // have to define here because the tests will fail
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(), // Deprecated
            removeListener: jest.fn(), // Deprecated
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }))
    });
}

export const setHookTestState = (newState: any) => {
    const setStateMockFn = jest.fn();
    return Object.keys(newState).reduce((acc, val) => {
      acc = acc?.mockImplementationOnce(() => [newState[val], setStateMockFn]);
      return acc;
    }, jest.fn());
  };
  