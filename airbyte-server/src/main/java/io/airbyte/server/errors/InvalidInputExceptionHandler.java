/*
 * Copyright (c) 2020-2024 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.server.errors;

import io.airbyte.commons.json.Jsons;
import io.airbyte.commons.server.errors.InvalidInputExceptionMapper;
import io.micronaut.context.annotation.Replaces;
import io.micronaut.context.annotation.Requires;
import io.micronaut.http.HttpRequest;
import io.micronaut.http.HttpResponse;
import io.micronaut.http.HttpStatus;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Produces;
import io.micronaut.http.server.exceptions.ExceptionHandler;
import io.micronaut.validation.exceptions.ConstraintExceptionHandler;
import jakarta.inject.Singleton;
import javax.validation.ConstraintViolationException;

/**
 * https://www.baeldung.com/jersey-bean-validation#custom-exception-handler. handles exceptions
 * related to the request body not matching the openapi config.
 */
@Produces
@Singleton
@Requires(classes = ConstraintViolationException.class)
@Replaces(ConstraintExceptionHandler.class)
public class InvalidInputExceptionHandler implements ExceptionHandler<ConstraintViolationException, HttpResponse> {

  /**
   * Re-route the invalid input to a meaningful HttpStatus.
   */
  @Override
  public HttpResponse handle(final HttpRequest request, final ConstraintViolationException exception) {
    return HttpResponse.status(HttpStatus.BAD_REQUEST)
        .body(Jsons.serialize(InvalidInputExceptionMapper.infoFromConstraints(exception)))
        .contentType(MediaType.APPLICATION_JSON_TYPE);
  }

}
