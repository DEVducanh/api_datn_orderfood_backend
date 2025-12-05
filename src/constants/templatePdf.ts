export const invoiceTemplate = (order: any) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    h1 { text-align: center; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ccc; padding: 8px; }
    th { background: #f2f2f2; }
    .total { text-align: right; margin-top: 20px; font-size: 18px; }
  </style>
</head>
<body>
  <h1>HÓA ĐƠN THANH TOÁN</h1>
  <p>Bàn: ${order.table_name}</p>
  <p>Thời gian: ${order.createdAt}</p>

  <table>
    <tr>
      <th>Sản phẩm</th>
      <th>Số lượng</th>
      <th>Giá</th>
    </tr>

    ${order.items
      .map(
        (i: any) => `
        <tr>
          <td>${i.name}</td>
          <td>${i.quantity}</td>
          <td>${i.price.toLocaleString()} đ</td>
        </tr>
      `
      )
      .join('')}
  </table>

  <p class="total"><strong>Tổng cộng: ${order.total.toLocaleString()} đ</strong></p>
</body>
</html>
`
