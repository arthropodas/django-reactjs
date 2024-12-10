import { createAxiosInstance } from '../../utils/Constants';

jest.mock('axios'); // Mock Axios module

jest.mock('../../utils/Constants', () => ({
    createAxiosInstance: jest.fn(() => {
      return {
        interceptors: {
          response: {
            use: jest.fn(),
          },
        },
      };
    }),
    requestConfig: jest.fn(),
  }));

describe('Axios Interceptor Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should call refreshAccessToken on 401 error with errorCode e402', async () => {
    // Mock createAxiosInstance
   
    const mockedAxiosInstance = {
      interceptors: {
        response: {
          use: jest.fn().mockImplementation((fulfilled, rejected) => {
            return {
              fulfilled,
              rejected,
            };
          }),
        },
      },
    };
    createAxiosInstance.mockReturnValue(mockedAxiosInstance);

    // Define refreshAccessTokenMock within the test case
    const refreshAccessTokenMock = jest.fn().mockResolvedValue('newAccessToken');

    // Mock the axiosInstance interceptor
    const mockInterceptor = {
      fulfilled: jest.fn(),
      rejected: jest.fn().mockImplementation(refreshAccessTokenMock),
    };

    jest.mock('../../services/interceptors', () => ({
      __esModule: true,
      axiosPrivate: {
        interceptors: {
          response: {
            handlers: [mockInterceptor],
          },
        },
      },
    }));

    // 401 error with errorCode e402
    const originalRequest = { _retry: false };
    const errorResponse = {
      response: {
        status: 401,
        data: { errorCode: 'e402' }
      },
      config: originalRequest
    };

    await mockInterceptor.rejected(errorResponse);

  });

})
