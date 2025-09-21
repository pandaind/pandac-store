import PropTypes from 'prop-types';

/**
 * Common PropTypes definitions for reuse across components
 */

// User PropTypes
export const UserPropTypes = PropTypes.shape({
  userId: PropTypes.number,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  mobileNumber: PropTypes.string,
  roles: PropTypes.arrayOf(PropTypes.string),
  address: PropTypes.shape({
    street: PropTypes.string,
    city: PropTypes.string,
    state: PropTypes.string,
    postalCode: PropTypes.string,
    country: PropTypes.string,
  }),
});

// Product PropTypes
export const ProductPropTypes = PropTypes.shape({
  productId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  popularity: PropTypes.number,
});

// Cart Item PropTypes
export const CartItemPropTypes = PropTypes.shape({
  ...ProductPropTypes.isRequired,
  quantity: PropTypes.number.isRequired,
});

// Coupon PropTypes
export const CouponPropTypes = PropTypes.shape({
  code: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['PERCENTAGE', 'FIXED']).isRequired,
  discount: PropTypes.number.isRequired,
  minOrderAmount: PropTypes.number,
  maxUsage: PropTypes.number,
  usageCount: PropTypes.number,
  validFrom: PropTypes.string,
  validTo: PropTypes.string,
  isActive: PropTypes.bool,
});

// Order PropTypes
export const OrderPropTypes = PropTypes.shape({
  orderId: PropTypes.number.isRequired,
  totalPrice: PropTypes.number.isRequired,
  discount: PropTypes.number,
  discountCode: PropTypes.string,
  paymentId: PropTypes.string,
  paymentStatus: PropTypes.string,
  orderStatus: PropTypes.string,
  orderDate: PropTypes.string,
  items: PropTypes.arrayOf(CartItemPropTypes),
});

// Message/Contact PropTypes
export const MessagePropTypes = PropTypes.shape({
  contactId: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  subject: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  isOpen: PropTypes.bool,
  createdAt: PropTypes.string,
});

// Common Component PropTypes
export const LoadingPropTypes = {
  isLoading: PropTypes.bool,
  message: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  color: PropTypes.oneOf(['primary', 'white', 'gray']),
};

// DataManager Config PropTypes
export const DataManagerConfigPropTypes = PropTypes.shape({
  title: PropTypes.string.isRequired,
  entityName: PropTypes.string.isRequired,
  entityNamePlural: PropTypes.string,
  idField: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'number', 'email', 'date', 'boolean', 'image', 'currency', 'badge', 'truncate', 'discount']),
    fallback: PropTypes.string,
    badgeColors: PropTypes.object,
    trueLabel: PropTypes.string,
    falseLabel: PropTypes.string,
  })).isRequired,
  fields: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'number', 'email', 'password', 'tel', 'url', 'textarea', 'select', 'checkbox', 'date', 'datetime-local', 'file']),
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    min: PropTypes.string,
    max: PropTypes.string,
    step: PropTypes.string,
    rows: PropTypes.number,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })),
    accept: PropTypes.string,
  })).isRequired,
  actions: PropTypes.shape({
    create: PropTypes.bool,
    edit: PropTypes.bool,
    delete: PropTypes.bool,
  }),
  pagination: PropTypes.shape({
    itemsPerPage: PropTypes.number,
  }),
  api: PropTypes.shape({
    create: PropTypes.func,
    update: PropTypes.func,
    delete: PropTypes.func,
    uploadFile: PropTypes.func,
  }),
});

// Theme PropTypes
export const ThemePropTypes = PropTypes.oneOf(['light', 'dark']);

// Common function PropTypes
export const FunctionPropTypes = {
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func,
  onError: PropTypes.func,
  onSuccess: PropTypes.func,
};

// React Router PropTypes
export const RouterPropTypes = {
  navigate: PropTypes.func,
  location: PropTypes.object,
  params: PropTypes.object,
};
