package com.example.fstprog.repository;

import com.example.fstprog.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository  extends JpaRepository<Book,Integer> {

    boolean existsByIsbn(String isbn);
}
