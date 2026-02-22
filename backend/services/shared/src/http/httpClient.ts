import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

export interface HttpClientOptions {
  baseURL: string;
  timeout?: number;
}

export class HttpClient {
  private readonly instance: AxiosInstance;

  constructor(options: HttpClientOptions) {
    this.instance = axios.create({
      baseURL: options.baseURL,
      timeout: options.timeout ?? 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      method: "GET",
      url,
    });
  }

  async post<T, B = unknown>(
    url: string,
    body: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({
      ...config,
      method: "POST",
      url,
      data: body,
    });
  }

  async put<T, B = unknown>(
    url: string,
    body: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.request<T>({
      ...config,
      method: "PUT",
      url,
      data: body,
    });
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.request<T>({
      ...config,
      method: "DELETE",
      url,
    });
  }

  private async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.instance.request<T>(config);
      return response.data;
    } catch (error) {
      
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response) {
        throw new Error(
          `HTTP ${axiosError.response.status}: ${JSON.stringify(
            axiosError.response.data,
          )}`,
        );
      }

      if (axiosError.request) {
        throw new Error("No response received from upstream service");
      }

      throw new Error(axiosError.message);
    }

    throw new Error("Unknown HTTP client error");
  }
}
