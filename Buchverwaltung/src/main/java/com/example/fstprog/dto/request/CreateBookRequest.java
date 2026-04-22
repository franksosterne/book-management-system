package com.example.fstprog.dto.request;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CreateBookRequest(@NotBlank(message = "Titel darf nicht leer sein")
                                String title,

                                @NotBlank(message = "Autor darf nicht leer sein")
                                String author,

                                @NotBlank(message = "ISBN darf nicht leer sein")
                                String isbn,

                                @Positive(message = "Preis muss größer als 0 sein")
                                BigDecimal price,

                                @NotNull(message = "Erscheinungsjahr darf nicht leer sein")
                                @Min(value = 1000, message = "Ungültiges Erscheinungsjahr")
                                @Max(value = 2100, message = "Ungültiges Erscheinungsjahr")
                                Integer publishedYear){}


