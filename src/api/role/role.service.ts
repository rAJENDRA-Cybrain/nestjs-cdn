import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { RoleEntity } from '../../database';
import { CreateRoleDto, UpdateRoleDto } from '../../dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) {}

  public async save(createRoleDto: CreateRoleDto) {
    return await this.roleRepository.save(createRoleDto);
  }

  public async findAll(): Promise<RoleEntity[]> {
    return await this.roleRepository.find({
      where: {
        isActive: true,
        roleId: Not('a02d1846-7911-42e4-b052-5c8d569f2d22'), // Super Admin Id
      },
      order: { createdAt: 'ASC', roleId: 'ASC' },
    });
  }

  public async findOne(roleId: string): Promise<RoleEntity[]> {
    return await this.roleRepository.find({ roleId: roleId, isActive: true });
  }

  public async update(roleId: string, updateRoleDto: UpdateRoleDto) {
    return await this.roleRepository.update(roleId, updateRoleDto);
  }

  public async isRoleExist(role): Promise<RoleEntity> {
    return await this.roleRepository.findOne({
      role: role,
      isActive: true,
    });
  }
  public async isRoleExistById(roleId): Promise<RoleEntity> {
    return await this.roleRepository.findOne({
      roleId: roleId,
      isActive: true,
    });
  }
}
