package com.example.fstprog.repository;
import com.example.fstprog.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookRepository  extends JpaRepository<Book,Integer> {

    boolean existsByIsbn(String isbn);
  //Sucht Bücher, wenn title oder author den Suchbegriff enthält
  List<Book> findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(
          String title,
          String author
  );
}
