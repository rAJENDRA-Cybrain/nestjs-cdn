import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IntakeEntity, UserEntity } from 'src/database';
import { Equal, Not, Repository } from 'typeorm';
import { SignUpDto, UpdateSignUpDto } from '../../dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { sendEmail } from 'src/shared/node-mailer';
import { mailer } from 'src/shared/htmlMailer/welcome';
import { fp_mailer } from 'src/shared/htmlMailer/forgot-password';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(IntakeEntity)
    private intakeRepository: Repository<IntakeEntity>,
    private readonly jwtService: JwtService,
  ) {}

  public async reAssignEFCEmployee(from, to) {
    const userIntakes = await this.checkUserIntakes(from);
    const findUser: any = await this.isUserExistById(to);
    if (findUser.role?.role === 'Efc Employee') {
      if (userIntakes.length > 0) {
        for (let index = 0; index < userIntakes.length; index++) {
          await this.intakeRepository.update(userIntakes[index].intakeId, {
            efcEmployee: findUser,
          });
        }
      }
      return true;
    } else {
      throw new ConflictException('Assigned user is not an efc employee.');
    }
  }

  public async save(signUpDto: SignUpDto, role) {
    return this.userRepository.save({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      emailId: signUpDto.emailId,
      password: signUpDto.password,
      role: role,
    });
  }

  public async findAllActiveUser(): Promise<UserEntity[]> {
    const userData: UserEntity[] = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.userId',
        'user.firstName',
        'user.lastName',
        'user.emailId',
        'role.roleId',
        'role.role',
      ])
      .leftJoin('user.role', 'role')
      .where({
        status: 'Active',
        // role: Not('a02d1846-7911-42e4-b052-5c8d569f2d22'), // Super Admin Id
      })
      .orderBy({ 'user.createdAt': 'DESC' })
      .getMany();

    if (userData.length > 0) {
      for (let i = 0; i < userData.length; i++) {
        let Intake = [];
        Intake = await this.checkUserIntakes(userData[i].userId);
        userData[i]['intake'] = Intake;
        userData[i]['count'] = Intake.length;
        // userData[i]['count'] = await (
        //   await this.checkUserIntakes(userData[i].userId)
        // ).length;
      }
    }

    return userData;
  }

  public async checkUserIntakes(userId) {
    const query = this.intakeRepository
      .createQueryBuilder('Intake')
      .select([
        'Intake.intakeId',
        'Intake.childName',
        'Intake.childMiddleName',
        'Intake.childLastName',
      ])
      .leftJoin('Intake.efcEmployee', 'efcEmployee')
      .orderBy({ 'Intake.createdAt': 'ASC' })
      .where('Intake.isActive = :IsActive AND efcEmployee.userId = :userId', {
        IsActive: true,
        userId: userId,
      });

    return await query.getMany();
  }

  public async findAllActiveEfcEmployeeUser(): Promise<UserEntity[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.userId',
        'user.firstName',
        'user.lastName',
        'user.emailId',
      ])
      .leftJoin('user.role', 'role')
      .where('user.status = :status AND role.roleId =:RoleId', {
        status: 'Active',
        RoleId: '8700bed7-45de-471b-aac0-362bb71daa3f', // Efc Role
      })
      .orderBy({ 'user.createdAt': 'ASC' })
      .getMany();
  }

  public async isAccountExist(signUpDto: SignUpDto) {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('(user.emailId = :EmailId)', {
        EmailId: signUpDto.emailId,
      })
      .andWhere({ status: 'Active' })
      .getOne();
  }

  public async findUserByEmail(emailId): Promise<UserEntity> {
    return await this.userRepository.findOne({
      emailId: emailId,
      status: 'Active',
    });
  }

  async findUserAccount(auth_key) {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.userId',
        'user.firstName',
        'user.lastName',
        'user.emailId',
        'user.password',
        'user.first_login_status',
        'role.roleId',
        'role.role',
      ])
      .leftJoin('user.role', 'role')
      .where('user.emailId = :EmailId AND user.status = :Status', {
        EmailId: auth_key,
        Status: 'Active',
      })
      .getOne();
  }

  public async isAccountExistById(id, updateSignUpDto: UpdateSignUpDto) {
    if (
      (
        await this.userRepository.find({
          emailId: updateSignUpDto.emailId,
          status: 'Active',
          userId: Not(id),
        })
      ).length > 0
    ) {
      throw new ConflictException('Email Already Exist.');
    } else {
      return true;
    }
  }
  public async isUserExistById(id): Promise<UserEntity> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.userId',
        'user.firstName',
        'user.lastName',
        'user.emailId',
        'user.password',
        'user.first_login_status',
        'role.roleId',
        'role.role',
      ])
      .leftJoin('user.role', 'role')
      .where('user.userId = :userId AND user.status = :Status', {
        userId: id,
        Status: 'Active',
      })
      .getOne();
    // return await this.userRepository.findOne({
    //   userId: Equal(id),
    //   status: 'Active',
    // });
  }
  public async update(userId: string, updateSignUpDto: UpdateSignUpDto, Role) {
    return await this.userRepository.update(userId, {
      firstName: updateSignUpDto.firstName,
      lastName: updateSignUpDto.lastName,
      emailId: updateSignUpDto.emailId,
      role: Role,
    });
  }

  public async updatePassword(userId: string, hash: string): Promise<any> {
    return await this.userRepository.update(userId, {
      password: hash,
      fp_req_token_status: true,
    });
  }
  public async forceUpdatePassword(userId: string, hash: string): Promise<any> {
    return await this.userRepository.update(userId, {
      password: hash,
      first_login_status: true,
      fp_req_token_status: true,
    });
  }

  public async findRoleByUserId(id: string) {
    return await this.userRepository.findOne({
      where: { userId: Equal(id), status: 'Active' },
      relations: ['role'],
    });
  }

  async deleteEmployee(id: string) {
    return await this.userRepository.update(id, {
      status: 'InActive',
    });
  }

  async triggerEmail(smtp, data, original_password) {
    const mailOptions = {
      email: data.emailId,
      subject: `Welcome to  ${smtp.smtpDisplayName}`,
      body: mailer.mailerhtml({
        smtpDisplayName: smtp.smtpDisplayName,
        emailId: data.emailId,
        password: original_password,
      }),
      attachments: [],
    };
    await sendEmail(smtp, mailOptions);
    return true;
  }
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 12);
  }

  async comparePassword(userPswd: string, hashPswd: string): Promise<boolean> {
    return bcrypt.compareSync(userPswd, hashPswd);
  }

  async validateUser(email: string, password: string): Promise<UserEntity> {
    try {
      const findUser: UserEntity = await this.findUserByEmail(email);
      if (!this.comparePassword(password, findUser.password)) return null;
      return findUser;
    } catch (err) {
      console.log(err);
    }
  }

  async findFPTokenExist(token: string): Promise<any> {
    return await this.userRepository.findOne({
      select: [
        'userId',
        'firstName',
        'lastName',
        'emailId',
        'fp_req_token',
        'fp_req_token_status',
      ],
      where: { fp_req_token: token, status: 'Active' },
    });
  }

  async generateJWT(payload): Promise<string> {
    return await this.jwtService.signAsync({ payload });
  }

  async generateForgotPasswordJWTLink(payload, emailId, smtp): Promise<string> {
    const fp_req_token = await this.jwtService.signAsync({ payload });

    // storing  the last fp token for each user.
    await this.userRepository.update(payload.id, {
      fp_req_token: fp_req_token,
      fp_req_token_status: false,
    });
    // send the forgot password link through email.
    const mailOptions = {
      email: emailId,
      subject: `${smtp.smtpDisplayName} Reset Password Assistance.`,
      body: fp_mailer.mailerhtml({
        smtpDisplayName: smtp.smtpDisplayName,
        request_link: `https://childcarecrm.cyberschoolmanager.com/auth/reset-password/${fp_req_token}`,
      }),
      attachments: [],
    };
    await sendEmail(smtp, mailOptions);
    return fp_req_token;
  }

  async resetPasswordEmail(smtp, userData) {
    const mailOptions = {
      email: userData.emailId,
      subject: `${smtp.smtpDisplayName} Password Has Been Updated.`,
      body: fp_mailer.resetPasswordThankYouHtml({
        smtpDisplayName: smtp.smtpDisplayName,
      }),
      attachments: [],
    };
    await sendEmail(smtp, mailOptions);
    return true;
  }

  async generateFPJwt(id: any): Promise<string> {
    return this.jwtService.signAsync(id);
  }
}
