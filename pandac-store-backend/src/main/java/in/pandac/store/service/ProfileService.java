package in.pandac.store.service;


import in.pandac.store.dto.ProfileRequestDto;
import in.pandac.store.dto.ProfileResponseDto;
import in.pandac.store.entity.Customer;

public interface ProfileService {

    ProfileResponseDto getProfile();

    ProfileResponseDto updateProfile(ProfileRequestDto profileRequestDto);

    Customer getAuthenticatedCustomer();
}
