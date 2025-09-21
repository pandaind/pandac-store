package in.pandac.store.controller;

import in.pandac.store.dto.DiscountDto;
import in.pandac.store.entity.DiscountType;
import in.pandac.store.service.DiscountService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(DiscountController.class)
class DiscountControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private DiscountService discountService;

    @Test
    void testCreateDiscount() throws Exception {
        DiscountDto discountDto = new DiscountDto("TEST10", 10, DiscountType.PERCENTAGE);
        when(discountService.createDiscount(any(DiscountDto.class))).thenReturn(discountDto);

        mockMvc.perform(post("/api/v1/discount")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"code\":\"TEST10\",\"discount\":10,\"type\":\"PERCENTAGE\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.code").value("TEST10"))
                .andExpect(jsonPath("$.discount").value(10))
                .andExpect(jsonPath("$.type").value("PERCENTAGE"));
    }

    @Test
    void testGetDiscountByCode() throws Exception {
        DiscountDto discountDto = new DiscountDto("TEST10", 10, DiscountType.PERCENTAGE);
        when(discountService.getDiscountByCode("TEST10")).thenReturn(Optional.of(discountDto));

        mockMvc.perform(get("/api/v1/discount/TEST10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value("TEST10"))
                .andExpect(jsonPath("$.discount").value(10))
                .andExpect(jsonPath("$.type").value("PERCENTAGE"));
    }

    @Test
    void testGetAllDiscounts() throws Exception {
        List<DiscountDto> discounts = Arrays.asList(
                new DiscountDto("TEST10", 10, DiscountType.PERCENTAGE),
                new DiscountDto("FLAT5", 5, DiscountType.FIXED)
        );
        when(discountService.allDiscounts()).thenReturn(discounts);

        mockMvc.perform(get("/api/v1/discount"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].code").value("TEST10"))
                .andExpect(jsonPath("$[1].code").value("FLAT5"));
    }

    @Test
    void testUpdateDiscount() throws Exception {
        DiscountDto updatedDiscount = new DiscountDto("TEST10", 20, DiscountType.PERCENTAGE);
        when(discountService.updateDiscount(eq("TEST10"), any(DiscountDto.class)))
                .thenReturn(Optional.of(updatedDiscount));

        mockMvc.perform(put("/api/v1/discount/TEST10")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"discount\":20,\"type\":\"PERCENTAGE\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.discount").value(20));
    }

    @Test
    void testDeleteDiscount() throws Exception {
        when(discountService.deleteDiscount("TEST10")).thenReturn(true);

        mockMvc.perform(delete("/api/v1/discount/TEST10"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testValidateDiscount() throws Exception {
        when(discountService.validateDiscount("TEST10")).thenReturn(true);

        mockMvc.perform(get("/api/v1/discount/TEST10/validate"))
                .andExpect(status().isOk())
                .andExpect(content().string("true"));
    }
}
