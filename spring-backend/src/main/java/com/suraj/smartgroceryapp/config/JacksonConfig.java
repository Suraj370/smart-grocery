package com.suraj.smartgroceryapp.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.ser.InstantSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;

@Configuration
public class JacksonConfig {

    private static final String INSTANT_FORMAT = "yyyy-MM-dd'T'HH:mm:ss.SSSSSSS'Z'";
    private static final DateTimeFormatter FORMATTER =
            DateTimeFormatter.ofPattern(INSTANT_FORMAT).withZone(ZoneOffset.UTC);

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        JavaTimeModule module = new JavaTimeModule();

        // Use the built-in ISO_INSTANT serializer
        module.addSerializer(Instant.class, InstantSerializer.INSTANCE);

        return Jackson2ObjectMapperBuilder
                .json()
                .modules(module)
                .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .build();
    }

}
