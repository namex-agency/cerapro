import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ActionsService } from './actions.service';

@Controller('actions')
export class ActionsController {
  constructor(private readonly actionsService: ActionsService) {}

  private getUserId(req: any, body?: any) {
    return (
      req.user?.id ||
      body?.userId ||
      'e7d8085e-f93c-41d7-81bd-377911aa6194'
    );
  }

  @Post()
  async createAction(@Req() req: any, @Body() body: any) {
    const userId = this.getUserId(req, body);

    return this.actionsService.createAction(userId, body);
  }

  @Get()
  async getActions(@Req() req: any, @Body() body: any) {
    const userId = this.getUserId(req, body);

    return this.actionsService.getActions(userId);
  }

  @Get(':id')
  async getActionById(@Req() req: any, @Param('id') id: string) {
    const userId = this.getUserId(req);

    return this.actionsService.getActionById(userId, id);
  }

  @Patch(':id')
  async updateAction(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const userId = this.getUserId(req, body);

    return this.actionsService.updateAction(userId, id, body);
  }
}