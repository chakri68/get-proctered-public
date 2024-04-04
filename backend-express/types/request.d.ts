declare namespace Express {
  export interface JwtPayload {
    id: number;
    email: string;
  }

  export interface Request {
    user?: JwtPayload;
  }
}
