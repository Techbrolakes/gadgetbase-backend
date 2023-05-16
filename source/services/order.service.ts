import { Types } from 'mongoose';
import { IOrder, IOrderDocument } from '../interfaces/order/order.interface';
import { Order } from '../models';
import { ExpressRequest } from '../server';

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

   // get all orders
   public async getAll(req: ExpressRequest): Promise<IOrderDocument[] | null | any> {
      const { query } = req;
      const search = String(query.search) || '';
      const perpage = Number(query.perpage) || 10;
      const status = String(query.status) || '';
      const page = Number(query.page) || 1;
      let filterQuery;

      if (search !== 'undefined' && Object.keys(search).length > 0) {
         filterQuery = {
            $or: [{ first_name: new RegExp(search, 'i') }],
         };
      }
      if (status !== 'undefined' && status.length > 0) {
         filterQuery = { ...filterQuery, status: status };
      }

      const filter = { ...filterQuery };

      const [orders, total] = await Promise.all([
         Order.find(filter)
            .lean(true)
            .sort({ createdAt: -1 })
            .limit(perpage)
            .skip(page * perpage - perpage),
         Order.aggregate([{ $match: filter }, { $count: 'count' }]),
      ]);

      const pagination = {
         hasPrevious: page > 1,
         prevPage: page - 1,
         hasNext: page < Math.ceil(total[0]?.count / perpage),
         next: page + 1,
         currentPage: Number(page),
         total: total[0]?.count || 0,
         pageSize: perpage,
         lastPage: Math.ceil(total[0]?.count / perpage),
      };

      return { data: orders, pagination };
   }

   // get user orders
   public async getAllUserOrders(req: ExpressRequest): Promise<IOrderDocument[] | null | any> {
      const { query } = req;
      const search = String(query.search) || '';
      const perpage = Number(query.perpage) || 10;
      const status = String(query.status) || '';
      const page = Number(query.page) || 1;
      let filterQuery;

      if (search !== 'undefined' && Object.keys(search).length > 0) {
         filterQuery = {
            $or: [{ first_name: new RegExp(search, 'i') }],
         };
      }
      if (status !== 'undefined' && status.length > 0) {
         filterQuery = { ...filterQuery, status: status };
      }

      const filter = { ...filterQuery, user_id: new Types.ObjectId(req.user?._id) };

      const [orders, total] = await Promise.all([
         Order.find(filter)
            .lean(true)
            .sort({ createdAt: -1 })
            .limit(perpage)
            .skip(page * perpage - perpage),
         Order.aggregate([{ $match: filter }, { $count: 'count' }]),
      ]);

      const pagination = {
         hasPrevious: page > 1,
         prevPage: page - 1,
         hasNext: page < Math.ceil(total[0]?.count / perpage),
         next: page + 1,
         currentPage: Number(page),
         total: total[0]?.count || 0,
         pageSize: perpage,
         lastPage: Math.ceil(total[0]?.count / perpage),
      };

      return { data: orders, pagination };
   }

   // find an orders
   public async findAll(populate: string = ''): Promise<IOrderDocument | null | any> {
      return await Order.find().populate(populate).sort({ createdAt: -1 });
   }

   // find an orders with query
   public async findWithQuery(query: any, populate: string = ''): Promise<IOrderDocument | null | any> {
      return await Order.find(query).populate(populate).sort({ createdAt: -1 });
   }

   // change order status
   public async changeStatus(order_id: Types.ObjectId): Promise<IOrderDocument | null | any> {
      return await Order.findByIdAndUpdate({ _id: order_id });
   }

   // delete an order
   public async deleteProduct(order_id: Types.ObjectId): Promise<IOrderDocument | null | any> {
      return await Order.findByIdAndDelete({ _id: order_id });
   }

   // update an order
   public async atomicUpdate(order_id: Types.ObjectId, record: any) {
      return await Order.findOneAndUpdate({ _id: order_id }, { ...record }, { new: true });
   }
}

export default new OrderService();
