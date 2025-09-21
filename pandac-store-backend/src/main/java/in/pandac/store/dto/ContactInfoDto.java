package in.pandac.store.dto;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties("contact")
public record ContactInfoDto(String phone, String email, String address) {
}
