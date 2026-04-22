package com.example.fstprog.entity;

import jakarta.persistence.*;


import java.math.BigDecimal;


@Entity
@Table(name = "books")
public class Book{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Integer id;

    @Column(nullable = false)
        private String title;

    @Column(nullable = false)
        private String author;

    @Column(nullable = false,unique = true)
        private String isbn;

    @Column(nullable = false, precision = 10,scale = 2)
        private BigDecimal price;    //BigDecimal um  Rundungsfehler zu vermeiden


    @Column(nullable = false)
        private Integer publishedYear;

    public Book() {

    };

    public Book(String title, String author, String isbn, BigDecimal price, Integer publishedYear) {

        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.price = price;
        this.publishedYear = publishedYear;
    }

    public Integer getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public int getPublishedYear() {
        return publishedYear;
    }

    public void setPublishedYear(int publishedYear) {
        this.publishedYear = publishedYear;
    }


}
