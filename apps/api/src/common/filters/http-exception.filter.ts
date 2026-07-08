import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";

type HttpRequest = {
  method?: string;
  url?: string;
};

type HttpResponse = {
  status: (statusCode: number) => {
    json: (body: ErrorResponseBody) => void;
  };
};

type ErrorResponseBody = {
  error: string;
  message: string | string[];
  method: string;
  path: string;
  statusCode: number;
  timestamp: string;
};

type ExceptionResponse = {
  error?: unknown;
  message?: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest<HttpRequest>();
    const response = context.getResponse<HttpResponse>();
    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionResponse = isHttpException
      ? exception.getResponse()
      : undefined;

    if (!isHttpException) {
      this.logUnhandledException(exception);
    }

    response.status(statusCode).json({
      error: this.getError(exceptionResponse, statusCode),
      message: this.getMessage(exceptionResponse, exception),
      method: request.method ?? "",
      path: request.url ?? "",
      statusCode,
      timestamp: new Date().toISOString(),
    });
  }

  private getError(
    exceptionResponse: HttpException["response"] | undefined,
    statusCode: number,
  ) {
    if (this.isExceptionResponse(exceptionResponse)) {
      const error = exceptionResponse.error;

      if (typeof error === "string" && error.trim().length > 0) {
        return error;
      }
    }

    return HttpStatus[statusCode] ?? "Error";
  }

  private getMessage(
    exceptionResponse: HttpException["response"] | undefined,
    exception: unknown,
  ) {
    if (typeof exceptionResponse === "string") {
      return exceptionResponse;
    }

    if (this.isExceptionResponse(exceptionResponse)) {
      const message = exceptionResponse.message;

      if (typeof message === "string" || this.isStringArray(message)) {
        return message;
      }
    }

    if (exception instanceof Error && exception.message.trim().length > 0) {
      return exception.message;
    }

    return "Internal server error";
  }

  private isExceptionResponse(value: unknown): value is ExceptionResponse {
    return typeof value === "object" && value !== null;
  }

  private isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === "string");
  }

  private logUnhandledException(exception: unknown) {
    if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
      return;
    }

    this.logger.error("Unhandled exception", String(exception));
  }
}
