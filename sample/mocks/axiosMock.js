const mAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  
  const axiosMock = {
    create: jest.fn(() => mAxiosInstance),
  };
  
  export default axiosMock;