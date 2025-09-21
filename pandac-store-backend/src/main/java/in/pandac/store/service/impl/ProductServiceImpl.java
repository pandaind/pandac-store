package in.pandac.store.service.impl;

import in.pandac.store.dto.ProductDto;
import in.pandac.store.entity.Product;
import in.pandac.store.exception.FileUploadException;
import in.pandac.store.repository.ProductRepository;
import in.pandac.store.service.GitService;
import in.pandac.store.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final GitService gitService;

    @Cacheable("products")
    @Override
    public List<ProductDto> getProducts() {
        return productRepository.findAll()
                .stream().map(this::transformToDTO).collect(Collectors.toList());
    }

    @Override
    public ProductDto createProduct(ProductDto productDto, MultipartFile imageFile) {
        Product product = new Product();
        BeanUtils.copyProperties(productDto, product);

        Product savedProduct = productRepository.save(product);
        return transformToDTO(savedProduct);
    }

    @Override
    public String saveImage(MultipartFile imageFile) {

        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }
        try {
            return uploadImageToGit(imageFile);
        } catch (Exception e) {
            throw new FileUploadException("Failed to save image: " + e.getMessage(), e);
        }
    }

    @Override
    public ProductDto updateProduct(Long productId, ProductDto productDto) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        BeanUtils.copyProperties(productDto, existingProduct, "productId");
        Product updatedProduct = productRepository.save(existingProduct);
        return transformToDTO(updatedProduct);
    }

    @Override
    public void deleteProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new IllegalArgumentException("Product not found with id: " + productId);
        }
        productRepository.deleteById(productId);

    }


    private String uploadImageToGit(MultipartFile file) {
    // Validate file type
    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
        throw new FileUploadException("Only image files are allowed");
    }

    // Generate unique filename
    String originalFilename = file.getOriginalFilename();
    String fileExtension = "";
    if (originalFilename != null && originalFilename.contains(".")) {
        fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
    }
    String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

    // Upload to Git repository via GitService
    return gitService.uploadFileToGit(file, uniqueFilename);
}

private ProductDto transformToDTO(Product product) {
    ProductDto productDto = new ProductDto();
    BeanUtils.copyProperties(product, productDto);
    productDto.setProductId(product.getId());
    return productDto;
}
}
