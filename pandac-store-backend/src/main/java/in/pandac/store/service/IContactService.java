package in.pandac.store.service;


import in.pandac.store.dto.ContactRequestDto;

import java.util.List;

public interface IContactService {

    boolean saveContact(ContactRequestDto contactRequestDto);
}
