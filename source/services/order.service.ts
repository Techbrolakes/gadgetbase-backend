import { Types } from 'mongoose';
import { IOrder, IOrderDocument } from '../interfaces/order/order.interface';
import { Order } from '../models';

class OrderService {
   // create an order
   public async createOrder({
      address,
      city,
      first_name,
      last_name,
      phone_number,
      products,
      status,
      total_price,
      user_id,
      additional_info,
      additional_phone_number,
   }: IOrder): Promise<IOrderDocument | null> {
      const data = { address, city, first_name, last_name, phone_number, products, status, total_price, user_id, additional_info, additional_phone_number };

      return await Order.create(data);
   }
}

export default new OrderService();
