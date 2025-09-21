package in.pandac.store.controller;

import in.pandac.store.dto.ProfileRequestDto;
import in.pandac.store.dto.ProfileResponseDto;
import in.pandac.store.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public ResponseEntity<ProfileResponseDto> getProfile() {
        ProfileResponseDto responseDto = profileService.getProfile();
        return ResponseEntity.ok(responseDto);
    }

    @PutMapping
    public ResponseEntity<ProfileResponseDto> updateProfile(
            @Validated @RequestBody ProfileRequestDto profileRequestDto) {
        ProfileResponseDto responseDto = profileService.updateProfile(profileRequestDto);
        return ResponseEntity.ok(responseDto);
    }

}
