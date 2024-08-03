import { Request } from 'express';

export interface RequestExtended extends Request {
  _id: ObjectId;
  roles: string;
}
