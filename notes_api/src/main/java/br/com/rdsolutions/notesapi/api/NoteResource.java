package br.com.rdsolutions.notesapi.api;

import br.com.rdsolutions.notesapi.domain.Note;
import br.com.rdsolutions.notesapi.repository.NoteRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

@Slf4j
@RestController
@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/api/notes")
public class NoteResource {

    private final NoteRepo noteRepo;

    @GetMapping
    public ResponseEntity<List<Note>> getNotes() {
        log.info("Generating list of notes");
        return ResponseEntity.ok().body(noteRepo.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Note> getNote(@PathVariable Long id) {
        log.info("Getting note by id: {}", id);
        return noteRepo.findById(id)
                .map(note -> ResponseEntity.ok().body(note))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Note> createNote(@RequestBody Note note) {
        log.info("Creating note");
        Note newNote = noteRepo.save(note);
        try {
            return ResponseEntity.created(new URI("/api/notes/" + note.getId())).body(newNote);
        } catch (URISyntaxException e) {
            log.error("Internal server error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Note> updateNote(@RequestBody Note note, @PathVariable Long id) {
        log.info("Updating note by id: {}", id);
        note.setId(id);
        return ResponseEntity.ok().body(noteRepo.save(note));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteNote(@PathVariable Long id) {
        log.info("Deleting note by id: {}", id);
        noteRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }

}
