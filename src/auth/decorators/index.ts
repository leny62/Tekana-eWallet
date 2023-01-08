/* eslint-disable */
import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";
import { ERoles } from "src/auth/enums";


export const AllowRoles = (...roles: ERoles[]) => SetMetadata('roles', roles);

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): any => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);