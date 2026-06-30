import env from '@/constants/env';
import api from '@/lib/api';
import { TApiPromise, TMutationOpts } from '@/types/api';
import { TPlan } from '@/types/Plan';
import { useMutation } from '@tanstack/react-query';
import RazorpayCheckout, { CheckoutOptions } from 'react-native-razorpay';

type TCreateOrderResponse = {
  id: string;
  amount: number;
  currency: string;
  notes: {
    email: string;
    name: string;
  };
};

const createOrder = (planId: TPlan['id']): TApiPromise<TCreateOrderResponse> => {
  return api.post('/api/v1/subscriptions/create-order', {
    planId,
  });
};

const createSubscription = (data: {
  orderId: string;
  paymentId: string;
  signature: string;
  planId: string;
}): TApiPromise => {
  return api.post('/api/v1/subscriptions', data);
};

export const useCreateOrder = (options?: TMutationOpts<TPlan['id'], TCreateOrderResponse>) => {
  return useMutation({
    mutationKey: ['create-order'],
    mutationFn: (planId: TPlan['id']) => createOrder(planId),
    ...options,
  });
};

export const useCreateSubscription = (
  options?: TMutationOpts<
    {
      orderId: string;
      paymentId: string;
      signature: string;
      planId: string;
    },
    void
  >
) => {
  return useMutation({
    mutationKey: ['create-subscription'],
    mutationFn: (data: { orderId: string; paymentId: string; signature: string; planId: string }) =>
      createSubscription(data),
    ...options,
  });
};

export const initiateRazorpayPayment = async ({
  order,
  plan,
}: {
  order: TCreateOrderResponse;
  plan: TPlan;
}) => {
  const options: CheckoutOptions = {
    description: `Payment for ${plan.name} plan`,
    image: 'https://your-app-logo-url.png',
    currency: order.currency,
    key: env.razorpayKeyId,
    amount: order.amount,
    name: 'Taiyari NEET ki',
    order_id: order.id,
    prefill: {
      email: order.notes.email,
      name: order.notes.name,
    },
    theme: { color: '#F1BB3E' },
  };

  try {
    const data = await RazorpayCheckout.open(options);
    return {
      paymentId: data.razorpay_payment_id,
      orderId: data.razorpay_order_id,
      signature: data.razorpay_signature,
    };
  } catch (error: any) {
    throw new Error(error?.description || 'Payment failed');
  }
};
