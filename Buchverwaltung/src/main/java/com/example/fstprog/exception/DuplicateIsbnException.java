package com.example.fstprog.exception;

public class DuplicateIsbnException extends RuntimeException {

    public DuplicateIsbnException(String isbn) {
        super("Ein Buch mit der ISBN " + isbn + " existiert bereits.");
    }
}