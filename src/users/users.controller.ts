import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { User } from './user.schema';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: '64a123abc...' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('email/:email')
  @ApiParam({ name: 'email', example: 'user@email.com' })
  async findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post()
  @ApiOperation({ summary: 'Create user' })
  async create(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }

  @Post(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<User>) {
    return this.usersService.update(id, updateData);
  }

  @Post('email/:email')
  async updateByEmail(@Param('email') email: string, @Body() updateData: Partial<User>) {
    return this.usersService.updateByEmail(email, updateData);
  }
}
