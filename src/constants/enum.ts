export enum USER_ROLE {
  CUSTOMER = 0,
  WAITER = 1,
  CASHIER = 2,
  CHEF = 3,
  ADMIN = 4
}

export enum CATEGORY_STATUS {
  INACTIVE = 0, //Dừng HĐ
  ACTIVE = 1 //Hoạt động
}

export enum DISHES_STATUS {
  AVAILABLE = 'available', // Còn bán
  UNAVAILABLE = 'unavailable' // Ngừng bán
}

export enum TABLE_STATUS {
  EMTY = 'emty', // Trống
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance'
}

export enum ORDER_STATUS {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  READY = 'READY',
  SERVED = 'SERVED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED'
}
