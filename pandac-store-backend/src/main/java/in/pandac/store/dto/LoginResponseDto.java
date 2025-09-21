package in.pandac.store.dto;

import in.pandac.store.dto.UserDto;

public record LoginResponseDto(String message, UserDto user, String jwtToken) {
}
