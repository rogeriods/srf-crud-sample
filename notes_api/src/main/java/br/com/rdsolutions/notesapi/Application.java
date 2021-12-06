package br.com.rdsolutions.notesapi;

import br.com.rdsolutions.notesapi.domain.Note;
import br.com.rdsolutions.notesapi.repository.NoteRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

	@Bean
	CommandLineRunner run(NoteRepo noteRepo) {
		return args -> {
			noteRepo.save(new Note(null, "Task #1"));
			noteRepo.save(new Note(null, "Task #2"));
			noteRepo.save(new Note(null, "Task #3"));
			noteRepo.save(new Note(null, "Task #4"));
			noteRepo.save(new Note(null, "Task #5"));
		};
	}

}
