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
      session,
   }: IOrder): Promise<IOrderDocument | null | any> {
      const data = { address, city, first_name, last_name, phone_number, products, status, total_price, user_id, additional_info, additional_phone_number };

      const newOrder = await Order.create([data], { session });

      return newOrder;
   }
}

export default new OrderService();
