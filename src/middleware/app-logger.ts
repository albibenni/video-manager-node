import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

// @Injectable()
// export class AppLoggerMiddleware implements NestMiddleware {
//   private logger = new Logger("HTTP");
//
//   use(request: Request, response: Response, next: NextFunction): void {
//     const { ip, method, path: url } = request;
//     const userAgent = request.get("user-agent") || "";
//
//     response.on("close", () => {
//       const { statusCode } = response;
//       const contentLength = response.get("content-length");
//
//       this.logger.log(
//         `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
//       );
//     });
//
//     next();
//   }
// }

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, headers } = req;
    res.on("finish", () => {
      const { statusCode } = res;
      this.logger.log(`${method} ${headers.authorization} ${statusCode}`);
    });

    next();
  }
}

// @Injectable()
// export class HTTPLoggerMiddleware implements NestMiddleware {
//   private logger = new Logger("HTTP");
//
//   use(request: Request, response: Response, next: NextFunction): void {
//     response.on("close", () => {
//       this.logger.log(request);
//     });
//
//     next();
//   }
// }
@Injectable()
export class HTTPLoggerMiddleware implements NestMiddleware {
  private logger = new Logger("HTTP");

  use(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
      this.logger.log(req);
    });

    next();
  }
}
