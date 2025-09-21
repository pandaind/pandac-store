package in.pandac.store.service;

import org.springframework.web.multipart.MultipartFile;

public interface GitService {
    
    /**
     * Upload a file to Git repository and return the CDN URL
     * @param file The file to upload
     * @param fileName The desired filename
     * @return The CDN URL for accessing the file
     */
    String uploadFileToGit(MultipartFile file, String fileName);
    
    /**
     * Generate a CDN URL for a file in the Git repository
     * @param fileName The filename
     * @return The CDN URL
     */
    String generateCdnUrl(String fileName);
}
