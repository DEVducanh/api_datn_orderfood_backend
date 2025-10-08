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
  EMPTY = 'empty', // Bàn trống
  OCCUPIED = 'occupied', // Bàn có người
  RESERVED = 'reserved', // Bàn đã đặt trước
  MAINTENANCE = 'maintenance' // Bàn đang bảo trì
}

export enum TABLE_STATUS {
  EMTY = 'emty', // Trống
  RESERVED = 'reserved',
  OCCUPIED = 'occupied',
  MAINTENANCE = 'maintenance'
}
