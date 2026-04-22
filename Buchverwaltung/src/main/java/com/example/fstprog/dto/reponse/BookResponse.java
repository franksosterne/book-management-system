package com.example.fstprog.dto.reponse;

import java.math.BigDecimal;

public record BookResponse(
        Integer id,
        String title,
        String author,
        String isbn,
        BigDecimal price,
        Integer publishedYear
) {
}