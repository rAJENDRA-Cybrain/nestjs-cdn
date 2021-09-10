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
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { RoleService } from './role.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto, UpdateRoleDto } from '../../dto';
import { RoleEntity } from '../../database';

@Controller('role')
@ApiTags('Role APIs')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Version('1')
  @ApiOperation({ summary: 'Get list of roles' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findAllRole() {
    const data: RoleEntity[] = await this.roleService.findAll();
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

  @Post()
  @Version('1')
  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async createRole(@Body() createRoleDto: CreateRoleDto) {
    const { role } = createRoleDto;
    const isRoleExist: RoleEntity = await this.roleService.isRoleExist(role);
    if (isRoleExist) {
      throw new ConflictException(`${role} is already exist.`);
    }
    const data: RoleEntity = await this.roleService.save(createRoleDto);
    if (data) {
      return {
        statusCode: 200,
        message: `${role} Saved Succesfully.`,
        data: data,
      };
    }
  }

  @Get(':roleId')
  @Version('1')
  @ApiOperation({ summary: 'Get individual role by roleId.' })
  @ApiResponse({
    status: 200,
    description: 'successful operation',
  })
  public async findOneRole(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string,
  ) {
    const data: RoleEntity[] = await this.roleService.findOne(roleId);
    if (data) {
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

  @Put(':roleId')
  @Version('1')
  @ApiOperation({ summary: 'Update individual role by roleId.' })
  @ApiResponse({
    status: 201,
    description: 'successful operation',
  })
  public async updateRole(
    @Param('roleId', new ParseUUIDPipe({ version: '4' })) roleId: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    const isRoleExistById: RoleEntity = await this.roleService.isRoleExistById(
      roleId,
    );
    if (isRoleExistById) {
      const data = await this.roleService.update(roleId, updateRoleDto);
      if (data) {
        return {
          statusCode: 201,
          message: `${updateRoleDto.role} Updated Succesfully.`,
          data: [],
        };
      }
    }
  }
}
