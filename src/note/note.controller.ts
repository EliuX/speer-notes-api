import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { NoteService } from 'src/note/note.service';
import { CreateNoteDto } from 'src/note/dto/create-note.dto';
import { UpdateNoteDto } from 'src/note/dto/update-note.dto';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully created',
  })
  @ApiBody({ type: CreateNoteDto })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async create(@Req() req, @Body() createNoteDto: CreateNoteDto) {
    return this.noteService.create(createNoteDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @ApiResponse({ status: 200, description: 'Return all notes.' })
  async findAll(@Req() req) {
    return this.noteService.findAll(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by id' })
  @ApiResponse({ status: 200, description: 'Return the note.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async findOne(@Req() req, @Param('id') id: string) {
    return this.noteService.findOne(id, req.user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note by id' })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.noteService.update(id, updateNoteDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note by id' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: 204,
    description: 'The note has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  async delete(@Req() req, @Param('id') id: string) {
    await this.noteService.delete(id, req.user.sub);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Share a note with another user' })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully shared.',
  })
  @ApiResponse({
    status: 409,
    description: 'This note is already shared with the specified users',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async share(
    @Req() req,
    @Param('id') noteId: string,
    @Body('sharedWith') anotherUserId: string[],
  ) {
    return this.noteService.share(noteId, anotherUserId || [], req.user.sub);
  }

  @Get('search/:query')
  @ApiOperation({ summary: 'Search notes by query' })
  @ApiResponse({ status: 200, description: 'Return the search results.' })
  @ApiResponse({ status: 404, description: 'No notes found.' })
  async search(@Req() req, @Param('query') query: string) {
    return this.noteService.search(query, req.user.sub);
  }
}
