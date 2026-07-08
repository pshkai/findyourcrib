import { ArgumentsHost, BadRequestException, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { ApiExceptionFilter } from "./api-exception.filter";

describe("ApiExceptionFilter", () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, "error").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  function createHost() {
    const response = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };
    const host = {
      switchToHttp: () => ({
        getResponse: () => response
      })
    } as unknown as ArgumentsHost;

    return { host, response };
  }

  it("wraps HttpException responses in the API envelope", () => {
    const { host, response } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(new HttpException("Property not found", HttpStatus.NOT_FOUND), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(response.json).toHaveBeenCalledWith({
      data: null,
      meta: {},
      error: {
        statusCode: HttpStatus.NOT_FOUND,
        message: "Property not found"
      }
    });
  });

  it("joins validation message arrays", () => {
    const { host, response } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(new BadRequestException(["email must be an email", "password must be longer"]), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(response.json).toHaveBeenCalledWith({
      data: null,
      meta: {},
      error: {
        statusCode: HttpStatus.BAD_REQUEST,
        message: "email must be an email; password must be longer"
      }
    });
  });

  it("hides unexpected internal error messages", () => {
    const { host, response } = createHost();
    const filter = new ApiExceptionFilter();

    filter.catch(new Error("database password leaked"), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenCalledWith({
      data: null,
      meta: {},
      error: {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Internal server error"
      }
    });
  });
});
