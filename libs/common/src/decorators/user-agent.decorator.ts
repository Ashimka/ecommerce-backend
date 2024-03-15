import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UserAgent = createParamDecorator((_: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  return request.headers['user-agent'];
});
