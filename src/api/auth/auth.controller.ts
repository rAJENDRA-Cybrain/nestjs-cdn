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
  Res,
  UnauthorizedException,
  Req,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  SignUpDto,
  SignInDto,
  UpdateSignUpDto,
  UpdatePasswordDto,
  ForgotPasswordDto,
  ForcePasswordDto,
} from '../../dto';
import { UserEntity, RoleEntity } from '../../database';
import { RoleService } from '../role/role.service';
import { BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';
import { IntakeService } from '../intake/intake.service';
import { SmtpDetailsService } from '../smtp-details/smtp-details.service';

@Controller('auth')
@ApiTags('Authentication APIs')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RoleService,
    private readonly intakeService: IntakeService,
    private readonly smtpDetailsService: SmtpDetailsService,
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
      throw new UnauthorizedException(
        'Authentication Failed.  Please retry with a correct username and password.',
      );
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
        // res.cookie(
        //   'access_token',
        //   await this.authService.generateJWT(payload),
        //   {
        //     sameSite: 'strict',
        //     path: '/',
        //     httpOnly: true,
        //     expires: new Date(new Date().getTime() + 5 * 1000),
        //   },
        // );
        // res.cookie('refresh_token', findUser.userId, {
        //   sameSite: 'strict',
        //   path: '/',
        //   httpOnly: true,
        // });
        return {
          statusCode: 200,
          message: 'Success.',
          data: {
            access_token: await this.authService.generateJWT(payload),
            login_status: findUser.first_login_status,
          },
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
    console.log(isExist);
    if (!isExist) {
      const findRole: RoleEntity = await this.roleService.isRoleExistById(
        signUpDto.roleId,
      );
      if (findRole) {
        const original_password = signUpDto.password;
        signUpDto['password'] = await this.authService.hashPassword(
          signUpDto.password,
        );
        const data = await this.authService.save(signUpDto, findRole);
        if (data) {
          const smtp = await this.smtpDetailsService.findActiveSmtp();
          await this.authService.triggerEmail(smtp, data, original_password);
          return {
            statusCode: 200,
            message: `${signUpDto.firstName} ${signUpDto.lastName} User Created Succesfully.`,
          };
        }
      } else {
        throw new BadRequestException('Please provide valid roleId');
      }
    } else {
      throw new ConflictException('User already exists');
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
      const smtp = await this.smtpDetailsService.findActiveSmtp();
      if (updatePasswordDto.source == 'Super-Admin') {
        if (hashPassword) {
          const data = await this.authService.updatePassword(
            userId,
            hashPassword,
          );
          if (data) {
            await this.authService.resetPasswordEmail(smtp, findUser);
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
            await this.authService.resetPasswordEmail(smtp, findUser);
            return {
              statusCode: 200,
              message: `Password Updated Succesfully.`,
            };
          }
        }
      }
    }
  }

  @Put('/force-change-password/:userId')
  @Version('1')
  @ApiOperation({ summary: 'Force change user password.' })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async forceChangePassword(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Body() ForcePasswordDto: ForcePasswordDto,
  ) {
    const findUser: UserEntity = await this.authService.isUserExistById(userId);
    if (!findUser) {
      throw new UnauthorizedException('User Not Exist.');
    } else {
      const hashPassword = await this.authService.hashPassword(
        ForcePasswordDto.newPassword,
      );
      const smtp = await this.smtpDetailsService.findActiveSmtp();

      const payload = {
        userId: findUser.userId,
        name: `${findUser.firstName} ${findUser.lastName}`,
        emailId: findUser.emailId,
        role: findUser.role,
      };

      if (hashPassword) {
        const data = await this.authService.forceUpdatePassword(
          userId,
          hashPassword,
        );
        if (data) {
          await this.authService.resetPasswordEmail(smtp, findUser);
          return {
            statusCode: 200,
            message: `Password Updated Succesfully.`,
            data: {
              access_token: await this.authService.generateJWT(payload),
            },
          };
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

  @Delete(':userId')
  @Version('1')
  @ApiOperation({ summary: 'Archive individual employee by userId.' })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async archiveEmployee(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
  ) {
    const isExist: UserEntity = await this.authService.isUserExistById(userId);
    if (!isExist) {
      throw new ConflictException('User Not Found!.');
    } else {
      const isAssignedToIntake = await this.intakeService.isAssignedOrNot(
        userId,
      );
      if (isAssignedToIntake.length > 0) {
        throw new ConflictException(
          'System Restricted. User already assigned to children.',
        );
      } else {
        const isStatusUpdated = await this.authService.deleteEmployee(userId);
        if (isStatusUpdated.affected > 0) {
          return {
            statusCode: 201,
            message: `User deleted succesfully.`,
          };
        }
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
      const smtp = await this.smtpDetailsService.findActiveSmtp();
      //const expireIn = new Date(new Date().getTime() + 5 * 60000);
      const expireIn = new Date(new Date().getTime() + 60 * 60 * 24 * 1000);
      const token = await this.authService.generateForgotPasswordJWTLink(
        {
          id: isExist.userId,
          exp: expireIn,
        },
        forgotPasswordDto.emailId,
        smtp,
      );
      return {
        statusCode: 200,
        message: 'Success.',
        request_token: token,
      };
    } else {
      throw new ConflictException('Invalid email address!.');
    }
  }

  @Get(':token/validate-forgot-password-token')
  @Version('1')
  @ApiOperation({ summary: 'Check Forgot Password Token' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async checkForgetPasswordToken(@Param('token') token: string) {
    const isExist: UserEntity = await this.authService.findFPTokenExist(token);
    if (isExist) {
      return {
        statusCode: 200,
        message: 'Success.',
        data: isExist,
      };
    } else {
      return {
        statusCode: 200,
        message: 'No Data Found.',
        data: [],
      };
    }
  }

  @Put(':userId/:password/reset-password')
  @Version('1')
  @ApiOperation({ summary: 'Reset password by userId.' })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async resetPassword(
    @Param('userId', new ParseUUIDPipe({ version: '4' })) userId: string,
    @Param('password') password: string,
  ) {
    const isExist: UserEntity = await this.authService.isUserExistById(userId);
    if (isExist) {
      const hashPassword = await this.authService.hashPassword(password);
      if (hashPassword) {
        const smtp = await this.smtpDetailsService.findActiveSmtp();
        const data = await this.authService.updatePassword(
          userId,
          hashPassword,
        );
        if (data.affected > 0) {
          await this.authService.resetPasswordEmail(smtp, isExist);
          return {
            statusCode: 200,
            message: `Password Updated Succesfully.`,
          };
        }
      }
    }
  }

  @Put('/:from_userid/:to_userid/reassign-efcemployee')
  @Version('1')
  @ApiOperation({ summary: 'ReAssign Efc Employee.' })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async ReAssignEFCEmployee(
    @Param('from_userid', new ParseUUIDPipe({ version: '4' }))
    from_userid: string,
    @Param('to_userid', new ParseUUIDPipe({ version: '4' })) to_userid: string,
  ) {
    const data = await this.authService.reAssignEFCEmployee(
      from_userid,
      to_userid,
    );
    if (data) {
      return {
        statusCode: 200,
        message: `Re-Assignment of efc employee has been updated succesfully.`,
      };
    }
  }
}
