import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // CREATE CONTACT
  @Post()
  async create(@Body() body: any) {
    return this.contactsService.createContact(body);
  }

  // GET ALL CONTACTS (with optional search)
  @Get()
  async findAll(@Query('search') search?: string) {
    return this.contactsService.getContacts(search);
  }

  // GET CONTACT BY ID
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contactsService.getContactById(id);
  }

  // UPDATE CONTACT
  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.contactsService.updateContact(id, body);
  }
}