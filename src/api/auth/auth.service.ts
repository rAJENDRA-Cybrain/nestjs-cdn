import { ConflictException, Injectable, Options } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database';
import { Equal, Not, Repository } from 'typeorm';
import { SignUpDto, UpdateSignUpDto } from '../../dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
        'user.userName = :UserName OR user.emailId = :EmailId OR user.contactNo = :ContactNo AND user.status = :Status',
        {
          UserName: signUpDto.userName,
          EmailId: signUpDto.emailId,
          ContactNo: signUpDto.contactNo,
          Status: 'Active',
        },
      )
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

  async generateJWT(payload): Promise<string> {
    return await this.jwtService.signAsync({ payload });
  }

  async generateFPJwt(id: any): Promise<string> {
    return this.jwtService.signAsync(id);
  }
}
