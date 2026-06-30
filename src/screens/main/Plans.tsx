import { useGetAllPlans } from '@/hooks/api/plan';
import { TPlan } from '@/types/Plan';
import { Check, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { ScrollView, StatusBar, Text, TouchableOpacity, View } from 'react-native';

type TPlanCardProps = {
  plan: TPlan;
  onSelect: (plan: TPlan) => void;
  isSelected: boolean;
};

const PlanCard = ({ plan, onSelect, isSelected }: TPlanCardProps) => {
  const features = plan.description
    .split('-')
    .filter((item) => item.trim())
    .map((item) => item.trim());

  return (
    <TouchableOpacity
      onPress={() => onSelect(plan)}
      className={`bg-white rounded-xl p-6 mb-4 ${
        isSelected ? 'border-2 border-[#F1BB3E]' : 'border border-gray-200'
      }`}
    >
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-2xl font-bold text-[#1e1e1e]">{plan.name}</Text>
          <Text className="text-lg text-gray-600">
            Valid until{' '}
            {new Date(plan.validUntil).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-3xl font-bold text-[#F1BB3E]">₹{plan.amount}</Text>
          <Text className="text-sm text-gray-500">+ {plan.gstRate}% GST</Text>
        </View>
      </View>

      <View className="space-y-2">
        {features.map((feature, index) => (
          <View key={index} className="flex-row items-center space-x-2">
            <Check size={16} className="text-[#F1BB3E]" />
            <Text className="text-gray-700 flex-1">{feature}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
};

export const PlansScreen = ({ navigation }: any) => {
  const [selectedPlan, setSelectedPlan] = React.useState<TPlan | null>(null);
  const { data, error, isLoading } = useGetAllPlans();

  const handlePlanSelect = (plan: TPlan) => {
    setSelectedPlan(plan);
  };

  const handleContinue = () => {
    if (selectedPlan) {
      navigation.navigate('Payment', { plan: selectedPlan });
    }
  };

  return (
    <View className="flex-1 bg-[#F1BB3E]/10" style={{ paddingTop: StatusBar.currentHeight }}>
      <ScrollView className="flex-1">
        <View className="px-4 my-8">
          <Text className="text-4xl font-bold text-[#1e1e1e] mb-1">Choose your plan</Text>
          <Text className="text-lg text-gray-600">
            Select the perfect plan for your NEET preparation journey
          </Text>
        </View>

        <View className="px-4 mb-20">
          {isLoading ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-gray-600 text-lg">Loading plans...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-red-500 text-lg">
                Failed to load plans. Please try again later.
              </Text>
            </View>
          ) : data?.data?.length === 0 ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-gray-600 text-lg">No plans available at the moment.</Text>
            </View>
          ) : (
            data?.data?.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={handlePlanSelect}
                isSelected={selectedPlan?.id === plan.id}
              />
            ))
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedPlan}
          className={`flex-row items-center justify-center space-x-2 rounded-xl p-4 ${
            selectedPlan ? 'bg-[#F1BB3E]' : 'bg-gray-300'
          }`}
        >
          <Text className="text-lg font-bold text-white">Continue</Text>
          <ChevronRight size={20} className="text-white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlansScreen;
