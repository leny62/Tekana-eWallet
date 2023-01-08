/* eslint-disable */
import { ERoles } from '../enums';

export interface JwtPayload {
  id: number;
  role: ERoles;
  phone: number;
}
