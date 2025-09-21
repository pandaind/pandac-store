package in.pandac.store.service;


import in.pandac.store.dto.ContactRequestDto;
import in.pandac.store.dto.ContactResponseDto;

import java.util.List;

public interface ContactService {

    boolean saveContact(ContactRequestDto contactRequestDto);

    List<ContactResponseDto> getAllOpenMessages();

    void updateMessageStatus(Long contactId, String status);
}
