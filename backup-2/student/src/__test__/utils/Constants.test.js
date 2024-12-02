import axios from 'axios';
import { requestConfig } from '../../utils/Constants'; 

jest.mock('axios');

describe('Axios instance and interceptors', () => {
  let axiosInstance;

  beforeEach(() => {
    axiosInstance = {
      defaults: {
        baseURL: '',
        headers: {
          'Content-Type': '',
        },
      },
      interceptors: {
        request: {
          use: jest.fn(),
        },
      },
    };

    axios.create.mockReturnValue(axiosInstance);
  });
  it('adding Authorization header if accessToken is present in localStorage', () => {
    const accessToken = 'test-token';
    localStorage.setItem('accessToken', accessToken);

    requestConfig(axiosInstance);

    const config = {
      headers: {},
    };

    const fulfilled = axiosInstance.interceptors.request.use.mock.calls[0][0];
    const updatedConfig = fulfilled(config);

    expect(updatedConfig.headers['Authorization']).toBe(`Bearer ${accessToken}`);
  });

  it('without Authorization header if accessToken is not present in localStorage', () => {
    localStorage.removeItem('accessToken');

    requestConfig(axiosInstance);

    const config = {
      headers: {},
    };

    const fulfilled = axiosInstance.interceptors.request.use.mock.calls[0][0];
    const updatedConfig = fulfilled(config);

    expect(updatedConfig.headers['Authorization']).toBeUndefined();
  });

  it('handle request interceptor errors', async () => {
    requestConfig(axiosInstance);

    const error = new Error('Request error');
    let caughtError;

    const rejected = axiosInstance.interceptors.request.use.mock.calls[0][1];

    try {
      await rejected(error);
    } catch (err) {
      caughtError = err;
    }

    expect(caughtError).toBe(error);
  });
});
