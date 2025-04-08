import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Регистрация игрока' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'Успешная регистрация' })
  @ApiResponse({ status: 400, description: 'Некорректные данные' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.username, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Логин по username и password' })
  @ApiResponse({ status: 200, description: 'JWT access token' })
  @ApiResponse({ status: 401, description: 'Неверные данные' })
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
