package br.com.rdsolutions.notesapi.repository;

import br.com.rdsolutions.notesapi.domain.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepo extends JpaRepository<Note, Long> { }
