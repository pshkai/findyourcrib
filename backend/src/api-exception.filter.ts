import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";

interface ResponseLike {
  status: (statusCode: number) => ResponseLike;
  json: (body: unknown) => void;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<ResponseLike>();
    const statusCode = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = this.messageFor(exception, statusCode);

    if (statusCode >= 500) {
      this.logger.error(message, exception instanceof Error ? exception.stack : undefined);
    }

    response.status(statusCode).json({
      data: null,
      meta: {},
      error: {
        statusCode,
        message
      }
    });
  }

  private messageFor(exception: unknown, statusCode: number) {
    if (!(exception instanceof HttpException)) {
      return statusCode >= 500 ? "Internal server error" : "Request failed";
    }

    const response = exception.getResponse();

    if (typeof response === "string") {
      return response;
    }

    if (response && typeof response === "object" && "message" in response) {
      const message = (response as { message?: string | string[] }).message;
      return Array.isArray(message) ? message.join("; ") : message ?? exception.message;
    }

    return exception.message;
  }
}
