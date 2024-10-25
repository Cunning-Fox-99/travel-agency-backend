import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Извлекаем пользователя из запроса

    console.log('User in AdminGuard:', user); // Логируем для проверки

    if (!user?.isAdmin) {
      throw new ForbiddenException('Доступ разрешён только администраторам');
    }
    return true;
  }
}
