import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Version,
  ConflictException,
  ParseUUIDPipe,
  Put,
  UseGuards,
  Res,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SignUpDto,
  SignInDto,
  UpdateSignUpDto,
  UpdatePasswordDto,
  ForgotPasswordDto,
} from '../../dto';
import { UserEntity, RoleEntity } from '../../database';
import { RoleService } from '../role/role.service';
import { BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth')
@ApiTags('Authentication APIs')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
  ) {}

  @Post('sign-in')
  @Version('1')
  @ApiOperation({ summary: 'SignIn : login to access the authenticated apis' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async signIn(
    @Req() req: Request,
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { auth_key, auth_credentials } = signInDto;
    const findUser: UserEntity = await this.authService.findUserAccount(
      auth_key,
    );
    if (!findUser) {
      throw new UnauthorizedException('InValid User.');
    } else {
      const checkPassword: boolean = await this.authService.comparePassword(
        auth_credentials,
        findUser.password,
      );
      if (checkPassword) {
        const payload = {
          userId: findUser.userId,
          name: `${findUser.firstName} ${findUser.lastName}`,
          emailId: findUser.emailId,
          role: findUser.role,
        };
        res.cookie(
          'access_token',
          await this.authService.generateJWT(payload),
          {
            sameSite: 'strict',
            path: '/',
            httpOnly: true,
            expires: new Date(new Date().getTime() + 5 * 1000),
          },
        );
        res.cookie('refresh_token', findUser.userId, {
          sameSite: 'strict',
          path: '/',
          httpOnly: true,
        });
        return {
          statusCode: 200,
          message: 'Success.',
          data: { access_token: await this.authService.generateJWT(payload) },
        };
      } else {
        throw new UnauthorizedException('InValid Password.');
      }
    }
  }

  @Post('sign-up')
  @Version('1')
  @ApiOperation({ summary: 'SignUp : Create Employee' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async signUp(@Body() signUpDto: SignUpDto) {
    const isExist: UserEntity = await this.authService.isAccountExist(
      signUpDto,
    );
    if (!isExist) {
      const findRole: RoleEntity = await this.roleService.isRoleExistById(
        signUpDto.roleId,
      );
      if (findRole) {
        signUpDto['password'] = await this.authService.hashPassword(
          signUpDto.password,
        );
        const data = await this.authService.save(signUpDto, findRole);
        if (data) {
          return {
            statusCode: 200,
            message: `${signUpDto.firstName} ${signUpDto.lastName} User Created Succesfully.`,
          };
        }
      } else {
        throw new BadRequestException('Please provide valid roleId');
      }
    } else {
      throw new ConflictException('User Already Exist.');
    }
  }

  @Put('/change-password/:userId')
  @Version('1')
  @ApiOperation({ summary: 'Change user password.' })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async changePassword(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    const findUser: UserEntity = await this.authService.isUserExistById(userId);
    if (!findUser) {
      throw new UnauthorizedException('User Not Exist.');
    } else {
      const hashPassword = await this.authService.hashPassword(
        updatePasswordDto.newPassword,
      );
      if (updatePasswordDto.source == 'Super-Admin') {
        if (hashPassword) {
          const data = await this.authService.updatePassword(
            userId,
            hashPassword,
          );
          if (data) {
            return {
              statusCode: 200,
              message: `Password Updated Succesfully.`,
            };
          }
        }
      } else {
        const checkPassword: boolean = await this.authService.comparePassword(
          updatePasswordDto.oldPassword,
          findUser.password,
        );
        if (checkPassword && hashPassword) {
          const data = await this.authService.updatePassword(
            userId,
            hashPassword,
          );
          if (data) {
            return {
              statusCode: 200,
              message: `Password Updated Succesfully.`,
            };
          }
        }
      }
    }
  }

  @Get('employee-list')
  @Version('1')
  @ApiOperation({ summary: 'Get user list' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findAllUser() {
    const data: UserEntity[] = await this.authService.findAllActiveUser();
    if (data.length > 0) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: data,
      };
    } else {
      return {
        statusCode: 200,
        message: 'No Data Found',
        data: [],
      };
    }
  }

  @Get('efc-employee-list')
  @Version('1')
  @ApiOperation({ summary: 'Get only efc employee user list' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findAllEfcEmployeeUser() {
    const data: UserEntity[] =
      await this.authService.findAllActiveEfcEmployeeUser();
    if (data.length > 0) {
      return {
        statusCode: 200,
        message: `Success.`,
        data: data,
      };
    } else {
      return {
        statusCode: 200,
        message: 'No Data Found',
        data: [],
      };
    }
  }

  @Put(':userId')
  @Version('1')
  @ApiOperation({ summary: 'Update individual employee by userId.' })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async updateEmployee(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() updateSignUpDto: UpdateSignUpDto,
  ) {
    const isExist = await this.authService.isAccountExistById(
      userId,
      updateSignUpDto,
    );
    if (isExist) {
      const findRole: RoleEntity = await this.roleService.isRoleExistById(
        updateSignUpDto.roleId,
      );
      if (findRole) {
        const data = await this.authService.update(
          userId,
          updateSignUpDto,
          findRole,
        );
        if (data) {
          return {
            statusCode: 200,
            message: `User Updated Succesfully.`,
          };
        }
      } else {
        throw new BadRequestException('Please provide valid roleId');
      }
    }
  }

  @Post('forgot-password')
  @Version('1')
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async sendForgetPasswordLink(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ) {
    const isExist: UserEntity = await this.authService.findUserByEmail(
      forgotPasswordDto.emailId,
    );
    if (isExist) {
      const expireIn = new Date(new Date().getTime() + 5 * 60000);
      const token = await this.authService.generateJWT({
        id: isExist.userId,
        exp: expireIn,
      });
      return {
        statusCode: 200,
        message: 'Success.',
        request_token: token,
      };
    } else {
      throw new ConflictException('Invalid email address!.');
    }
  }
}
