import { Controller, Get, Param, Post, Body, Delete, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiTags('Users')
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: '64a123abc...' })
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  @ApiParam({ name: 'email', example: 'user@email.com' })
  @ApiOperation({ summary: 'Get user by email' })
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  async update(@Param('id') id: string, @Body() updateData: Partial<User>) {
    return this.usersService.update(id, updateData);
  }

  @Put('email/:email')
  @ApiOperation({ summary: 'Update user by email' })
  async updateByEmail(@Param('email') email: string, @Body() updateData: Partial<User>) {
    return this.usersService.updateByEmail(email, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by ID' })
  async delete(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
