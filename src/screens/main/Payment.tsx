import { useSendLogReport } from '@/hooks/api/log';
import { initiateRazorpayPayment, useCreateOrder } from '@/hooks/api/payment';
import { useCreateSubscription } from '@/hooks/api/subscription';
import { TPlan } from '@/types/Plan';

import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { ActivityIndicator, StatusBar, Text, TouchableOpacity, View } from 'react-native';

type PaymentScreenProps = {
  navigation: any;
  route: {
    params: {
      plan: TPlan;
    };
  };
};

export const PaymentScreen = ({ navigation, route }: PaymentScreenProps) => {
  const { plan } = route.params;
  const { mutateAsync: createOrderAsync, isPending: isCreatingOrder } = useCreateOrder();
  const { mutate: createSubscription, isPending: isCreatingSubscription } = useCreateSubscription();
  const sendLogReport = useSendLogReport();

  const handlePayment = async () => {
    try {
      // Create order
      const order = await createOrderAsync(plan.id);

      if (!order) {
        throw new Error('Order creation failed');
      }

      // Initiate Razorpay payment
      if (order.data) {
        const paymentResult = await initiateRazorpayPayment({
          order: order.data,
          plan,
        });

        createSubscription(
          {
            ...paymentResult,
            planId: plan.id,
          },
          {
            onSuccess: () => {
              navigation.navigate('SubscriptionMessage', {
                success: true,
                plan,
              });
            },
            onError: (error) => {
              navigation.navigate('SubscriptionMessage', {
                success: false,
                plan,
              });
            },
          }
        );
      }
    } catch (error: any) {
      // Send log report
      await sendLogReport.mutateAsync({
        error: error.message,
      });

      navigation.navigate('SubscriptionMessage', {
        success: false,
        plan,
      });
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: StatusBar.currentHeight }}>
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} className="text-gray-800" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Payment</Text>
      </View>

      <View className="flex-1 p-4">
        <View className="bg-gray-50 rounded-xl p-6 mb-6">
          <Text className="text-lg font-semibold mb-2">Order Summary</Text>
          <View className="flex flex-col gap-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Plan</Text>
              <Text className="font-medium">{plan.name}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Duration</Text>
              <Text className="font-medium">
                Valid until{' '}
                {new Date(plan.validUntil).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Amount</Text>
              <Text className="font-medium">₹{Math.round(plan.amount)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">GST ({plan.gstRate}%)</Text>
              <Text className="font-medium">₹{Math.round((plan.amount * plan.gstRate) / 100)}</Text>
            </View>
            <View className="flex-row justify-between pt-2 border-t border-gray-200">
              <Text className="font-semibold">Total</Text>
              <Text className="font-bold text-[#F1BB3E]">
                ₹{Math.round(plan.amount + (plan.amount * plan.gstRate) / 100)}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handlePayment}
          disabled={isCreatingOrder || isCreatingSubscription}
          className={`rounded-xl p-4 ${
            isCreatingOrder || isCreatingSubscription ? 'bg-gray-300' : 'bg-[#F1BB3E]'
          }`}
        >
          {isCreatingOrder || isCreatingSubscription ? (
            <View className="flex-row justify-center items-center space-x-2">
              <ActivityIndicator color="white" />
              <Text className="text-white font-bold">Processing...</Text>
            </View>
          ) : (
            <Text className="text-white font-bold text-center text-lg">Pay Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PaymentScreen;
