package com.example.fstprog.exception;

public class BookNotFoundException extends RuntimeException {

    public BookNotFoundException(Integer id) {
        super("Buch mit der ID " + id + " wurde nicht gefunden.");
    }
}