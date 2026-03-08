import { View, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Skeleton Loader Component to replace spinners
 */
const SkeletonLoader = () => (
  <View className="w-full p-4 gap-4">
    <View className="h-40 w-full rounded-2xl bg-zinc-800 animate-pulse" />
    <View className="h-10 w-3/4 rounded-lg bg-zinc-800 animate-pulse" />
    <View className="flex-row gap-4">
      <View className="h-32 w-32 rounded-xl bg-zinc-800 animate-pulse" />
      <View className="h-32 w-32 rounded-xl bg-zinc-800 animate-pulse" />
    </View>
  </View>
);

export default function HomeScreen() {
  const isLoading = true; // Simulating fetch state

  return (
    <SafeAreaView className="flex-1 bg-black">
      {isLoading ? (
        <ScrollView className="flex-1 bg-black">
          <SkeletonLoader />
          <SkeletonLoader />
        </ScrollView>
      ) : (
        <View className="flex-1 bg-black">
          {/* Real content goes here */}
        </View>
      )}
    </SafeAreaView>
  );
}