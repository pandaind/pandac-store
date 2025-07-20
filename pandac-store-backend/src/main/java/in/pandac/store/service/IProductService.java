package in.pandac.store.service;

import in.pandac.store.dto.ProductDto;

import java.util.List;

public interface IProductService {

    List<ProductDto> getProducts();
}
