package com.example.fstprog.service;

import com.example.fstprog.dto.reponse.BookResponse;
import com.example.fstprog.dto.request.CreateBookRequest;

import com.example.fstprog.entity.Book;
import com.example.fstprog.exception.BookNotFoundException;
import com.example.fstprog.exception.DuplicateIsbnException;
import com.example.fstprog.repository.BookRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Neues Buch erstellen
    public BookResponse createBook(CreateBookRequest request) {
        if (bookRepository.existsByIsbn(request.isbn())) {
            throw new DuplicateIsbnException(request.isbn());
        }

        Book book = new Book(
                request.title(),
                request.author(),
                request.isbn(),
                request.price(),
                request.publishedYear()
        );

        Book savedBook = bookRepository.save(book);
        return mapToResponse(savedBook);
    }

    // Alle Bücher abrufen
    public List<BookResponse> getAllBooks() {
        return bookRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Ein Buch anhand der ID abrufen
    public BookResponse findBookById(Integer id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));

        return mapToResponse(book);
    }

    // Buch aktualisieren
    public BookResponse updateBook(Integer id, CreateBookRequest request) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new BookNotFoundException(id));

        // Nur prüfen, wenn die ISBN tatsächlich geändert wurde
        if (!existingBook.getIsbn().equals(request.isbn())
                && bookRepository.existsByIsbn(request.isbn())) {
            throw new DuplicateIsbnException(request.isbn());
        }

        existingBook.setTitle(request.title());
        existingBook.setAuthor(request.author());
        existingBook.setIsbn(request.isbn());
        existingBook.setPrice(request.price());
        existingBook.setPublishedYear(request.publishedYear());

        Book updatedBook = bookRepository.save(existingBook);
        return mapToResponse(updatedBook);
    }

    // Buch löschen
    public void deleteBook(Integer id) {
        if (!bookRepository.existsById(id)) {
            throw new BookNotFoundException(id);
        }

        bookRepository.deleteById(id);
    }

    // Buch nach Titel oder Autor suchen
    public List<BookResponse> searchBooks(String keyword) {
        return bookRepository
                .findByTitleContainingIgnoreCaseOrAuthorContainingIgnoreCase(keyword, keyword)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }
    // Hilfsmethode: Entity -> Response DTO
    private BookResponse mapToResponse(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getPrice(),
                book.getPublishedYear()
        );
    }
}