import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ContactsService } from './contacts.service';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    phone: string;
    role: string;
  };
};

@Controller('contacts')
@UseGuards(JwtAuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // CREATE CONTACT
  @Post()
  async create(@Req() req: AuthenticatedRequest, @Body() body: any) {
    return this.contactsService.createContact({
      ...body,
      userId: req.user.id,
    });
  }

  // GET ALL CONTACTS (with optional search)
  @Get()
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('search') search?: string,
  ) {
    return this.contactsService.getContacts(req.user.id, search);
  }

  // GET CONTACT BY ID
  @Get(':id')
  async findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.contactsService.getContactById(req.user.id, id);
  }

  // UPDATE CONTACT
  @Patch(':id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    return this.contactsService.updateContact(req.user.id, id, body);
  }
}