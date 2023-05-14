import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const paystackAPI = {
   client: async () => {
      const app = axios.create({
         baseURL: process.env.PAYSTACK_BASE_API_URl,
         headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
            'Content-Type': 'application/json',
         },
      });
      return app;
   },

   initializeTransaction: async (body: { email: string; amount: number; callback_url: string; metadata?: Record<string, any>; customerName?: string }) => {
      try {
         const apiCall = await paystackAPI.client();
         const res = await apiCall.post(`/transaction/initialize`, {
            ...body,
         });

         if (res?.data?.Data) return res.data.Data;
         return res?.data;
      } catch (e: any | Error | unknown) {
         return Promise.reject(e);
      }
   },

   verifyTransaction: async (reference: string) => {
      try {
         const apiCall = await paystackAPI.client();
         const res = await apiCall.get(`/transaction/verify/${reference}`);
         if (res?.data?.Data) return res.data.Data;
         return res?.data;
      } catch (e: any | Error | unknown) {
         if (e?.response?.data) return Promise.reject(String(e?.response?.data?.message));
         return Promise.reject(e);
      }
   },
};
