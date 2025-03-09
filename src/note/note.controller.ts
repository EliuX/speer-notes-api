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
} from '@nestjs/common';
import { NoteService } from 'src/note/note.service';
import { CreateNoteDto } from 'src/note/dto/create-note.dto';
import { UpdateNoteDto } from 'src/note/dto/update-note.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

// @UseGuards(JwtGuard)
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 201,
    description: 'The note has been successfully created',
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Req() req, @Body() createNoteDto: CreateNoteDto) {
    return this.noteService.create(createNoteDto, req.user.sub);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  @ApiResponse({ status: 200, description: 'Return all notes.' })
  findAll(@Req() req) {
    return this.noteService.findAll(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a note by id' })
  @ApiResponse({ status: 200, description: 'Return the note.' })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.noteService.findOne(id, req.user.sub);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a note by id' })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.noteService.update(id, updateNoteDto, req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a note by id' })
  @ApiResponse({
    status: 200,
    description: 'The note has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Note not found.' })
  delete(@Req() req, @Param('id') id: string) {
    return this.noteService.delete(id, req.user.sub);
  }
}
