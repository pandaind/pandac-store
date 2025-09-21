package in.pandac.store.service;


import in.pandac.store.dto.ProductDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {

    List<ProductDto> getProducts();

    ProductDto createProduct(ProductDto productDto, MultipartFile imageFile);

    String saveImage(MultipartFile imageFile);

    ProductDto updateProduct(Long productId, ProductDto productDto);

    void deleteProduct(Long productId);
}
