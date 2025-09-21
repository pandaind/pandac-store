package in.pandac.store.service.impl;

import in.pandac.store.exception.FileUploadException;
import in.pandac.store.service.GitService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class GitServiceImpl implements GitService {

    @Value("${app.git.repository-url}")
    private String repositoryUrl;

    @Value("${app.git.username}")
    private String gitUsername;

    @Value("${app.git.token}")
    private String gitToken;

    @Value("${app.git.cdn-base-url}")
    private String cdnBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String uploadFileToGit(MultipartFile file, String fileName) {
        try {
            // Extract repository info from URL
            String[] urlParts = repositoryUrl.replace("https://github.com/", "")
                    .replace(".git", "").split("/");
            String owner = urlParts[0];
            String repo = urlParts[1];

            // Encode file content to Base64
            byte[] fileContent = file.getBytes();
            String encodedContent = Base64.getEncoder().encodeToString(fileContent);

            // Prepare GitHub API URL
            String apiUrl = String.format("https://api.github.com/repos/%s/%s/contents/%s",
                    owner, repo, fileName);

            // Prepare headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "token " + gitToken);
            headers.set("User-Agent", "pandac-store-backend");

            // Prepare request body
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("message", "Add image: " + fileName);
            requestBody.put("content", encodedContent);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            // Make API call
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.PUT, entity, String.class);

            if (response.getStatusCode() == HttpStatus.CREATED) {
                log.info("Successfully uploaded file {} to Git repository", fileName);
                return generateCdnUrl(fileName);
            } else {
                throw new FileUploadException("Failed to upload file to Git repository. Status: " + response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("Error uploading file to Git repository: {}", e.getMessage(), e);
            throw new FileUploadException("Failed to upload file to Git repository: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateCdnUrl(String fileName) {
        // Extract repository info from URL
        String[] urlParts = repositoryUrl.replace("https://github.com/", "")
                .replace(".git", "").split("/");
        String owner = urlParts[0];
        String repo = urlParts[1];

        // Generate jsdelivr.net CDN URL
        return String.format("%s/%s/%s/%s",
                cdnBaseUrl, owner, repo, fileName);
    }
}
