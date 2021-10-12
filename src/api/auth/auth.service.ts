import { ConflictException, Injectable, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database';
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
    private readonly jwtService: JwtService,
  ) {}

  public async save(signUpDto: SignUpDto, role) {
    return this.userRepository.save({
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      emailId: signUpDto.emailId,
      contactNo: signUpDto.contactNo,
      dateOfJoining: signUpDto.dateOfJoining,
      userName: signUpDto.userName,
      password: signUpDto.password,
      role: role,
    });
  }

  public async findAllActiveUser(): Promise<UserEntity[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.userId',
        'user.firstName',
        'user.lastName',
        'user.emailId',
        'user.contactNo',
        'user.dateOfJoining',
        'user.userName',
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
  }

  public async findAllActiveEfcEmployeeUser(): Promise<UserEntity[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.userId',
        'user.firstName',
        'user.lastName',
        'user.emailId',
        'user.contactNo',
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
      .where(
        '(user.userName = :UserName OR user.emailId = :EmailId OR user.contactNo = :ContactNo)',
        {
          UserName: signUpDto.userName,
          EmailId: signUpDto.emailId,
          ContactNo: signUpDto.contactNo,
        },
      )
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
        'user.contactNo',
        'user.password',
        'role.roleId',
        'role.role',
      ])
      .leftJoin('user.role', 'role')
      .where(
        'user.userName = :UserName OR user.emailId = :EmailId OR user.contactNo = :ContactNo AND user.status = :Status',
        {
          UserName: auth_key,
          EmailId: auth_key,
          ContactNo: auth_key,
          Status: 'Active',
        },
      )
      .getOne();
  }

  public async isAccountExistById(id, updateSignUpDto: UpdateSignUpDto) {
    const { emailId, userName, contactNo } = updateSignUpDto;
    if (
      (
        await this.userRepository.find({
          emailId: emailId,
          status: 'Active',
          userId: Not(id),
        })
      ).length > 0
    ) {
      throw new ConflictException('Email Already Exist.');
    } else if (
      (
        await this.userRepository.find({
          userName: userName,
          status: 'Active',
          userId: Not(id),
        })
      ).length > 0
    ) {
      throw new ConflictException('UserName Already Exist.');
    } else if (
      (
        await this.userRepository.find({
          contactNo: contactNo,
          status: 'Active',
          userId: Not(id),
        })
      ).length > 0
    ) {
      throw new ConflictException('Mobile No Already Exist.');
    } else {
      return true;
    }
    // return await this.userRepository
    //   .createQueryBuilder('user')
    //   .where(
    //     'user.userName = :UserName OR user.emailId = :EmailId OR user.contactNo = :ContactNo AND user.status = :Status AND user.userId != :UserId',
    //     {
    //       UserName: updateSignUpDto.userName,
    //       EmailId: updateSignUpDto.emailId,
    //       ContactNo: updateSignUpDto.contactNo,
    //       Status: 'Active',
    //       UserId: id,
    //     },
    //   )
    //   .getOne();
  }
  public async isUserExistById(id): Promise<UserEntity> {
    return await this.userRepository.findOne({
      userId: Equal(id),
      status: 'Active',
    });
  }
  public async update(userId: string, updateSignUpDto: UpdateSignUpDto, Role) {
    return await this.userRepository.update(userId, {
      firstName: updateSignUpDto.firstName,
      lastName: updateSignUpDto.lastName,
      emailId: updateSignUpDto.emailId,
      contactNo: updateSignUpDto.contactNo,
      dateOfJoining: updateSignUpDto.dateOfJoining,
      userName: updateSignUpDto.userName,
      role: Role,
    });
  }

  public async updatePassword(userId: string, hash: string): Promise<any> {
    return await this.userRepository.update(userId, {
      password: hash,
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
        userName: data.userName,
        emailId: data.emailId,
        contactNo: data.contactNo,
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
      body: fp_mailer.resetPasswordThankYouHtml(),
      attachments: [],
    };
    await sendEmail(smtp, mailOptions);
    return true;
  }

  async generateFPJwt(id: any): Promise<string> {
    return this.jwtService.signAsync(id);
  }
}
