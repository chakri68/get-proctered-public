declare namespace Express {
  export interface JwtPayload {
    id: string;
    email: string;
  }

  export interface Request {
    user?: JwtPayload;
  }
}
