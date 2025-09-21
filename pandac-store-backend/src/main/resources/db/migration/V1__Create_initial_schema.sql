-- Initial schema migration for Pandac Store
-- This migration creates all the core tables for the e-commerce application

CREATE TABLE products
(
    product_id  BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(250)                          NOT NULL,
    description VARCHAR(500)                          NOT NULL,
    price       DECIMAL(10, 2)                        NOT NULL,
    popularity  INT                                   NOT NULL,
    image_url   VARCHAR(500)                          NOT NULL,
    created_at  TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by  VARCHAR(20)                           NOT NULL,
    updated_at  TIMESTAMP   DEFAULT NULL,
    updated_by  VARCHAR(20) DEFAULT NULL
);

CREATE TABLE contacts
(
    contact_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100)                          NOT NULL,
    email         VARCHAR(100)                          NOT NULL,
    mobile_number VARCHAR(15)                           NOT NULL,
    message       VARCHAR(500)                          NOT NULL,
    status        VARCHAR(50)       NOT NULL,
    created_at    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by    VARCHAR(20)                           NOT NULL,
    updated_at    TIMESTAMP   DEFAULT NULL,
    updated_by    VARCHAR(20) DEFAULT NULL
);

CREATE TABLE customers
(
    customer_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(100)                          NOT NULL,
    email         VARCHAR(100)                          NOT NULL UNIQUE,
    mobile_number VARCHAR(15)                           NOT NULL,
    password_hash VARCHAR(500)                          NOT NULL,
    created_at    TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by    VARCHAR(20)                           NOT NULL,
    updated_at    TIMESTAMP   DEFAULT NULL,
    updated_by    VARCHAR(20) DEFAULT NULL,
    UNIQUE KEY unique_email (email),
    UNIQUE KEY unique_mobile_number (mobile_number)
);

CREATE TABLE address
(
    address_id    BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id       BIGINT NOT NULL UNIQUE,
    street        VARCHAR(150) NOT NULL,
    city          VARCHAR(100) NOT NULL,
    state         VARCHAR(100) NOT NULL,
    postal_code   VARCHAR(20)  NOT NULL,
    country       VARCHAR(100) NOT NULL,
    created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by    VARCHAR(20)  NOT NULL,
    updated_at    TIMESTAMP    DEFAULT NULL,
    updated_by    VARCHAR(20)  DEFAULT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE
);

CREATE TABLE roles (
    role_id     BIGINT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50) NOT NULL,
    created_at TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP   DEFAULT NULL,
    updated_by VARCHAR(20) DEFAULT NULL,
    UNIQUE KEY unique_name (name)
);

CREATE TABLE customer_roles (
   customer_id BIGINT NOT NULL,
   role_id     BIGINT NOT NULL,
   PRIMARY KEY (customer_id, role_id),
   FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
   FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

CREATE TABLE orders
(
    order_id       BIGINT AUTO_INCREMENT PRIMARY KEY,
    customer_id    BIGINT NOT NULL,
    total_price    DECIMAL(10, 2)                        NOT NULL,
    discount    DECIMAL(10, 2) DEFAULT 0                 NOT NULL,
    discount_code   VARCHAR(50),
    payment_id     VARCHAR(200)                          NOT NULL,
    payment_status VARCHAR(50)                           NOT NULL,
    order_status   VARCHAR(50)                           NOT NULL,
    created_at     TIMESTAMP   DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by     VARCHAR(20)                           NOT NULL,
    updated_at     TIMESTAMP   DEFAULT NULL,
    updated_by     VARCHAR(20) DEFAULT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
);

CREATE TABLE order_items
(
    order_item_id   BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id        BIGINT NOT NULL,
    product_id      BIGINT NOT NULL,
    quantity        INT NOT NULL,
    price           DECIMAL(10, 2) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by      VARCHAR(20)    NOT NULL,
    updated_at      TIMESTAMP      DEFAULT NULL,
    updated_by      VARCHAR(20)    DEFAULT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);

CREATE TABLE discounts (
    code VARCHAR(255) PRIMARY KEY,
    discount INT NOT NULL,
    type VARCHAR(255) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_by      VARCHAR(20)    NOT NULL,
    updated_at      TIMESTAMP      DEFAULT NULL,
    updated_by      VARCHAR(20)    DEFAULT NULL
);