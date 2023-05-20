import { ScrollView, View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/CheckBox";

interface Params {
  date: string;
}
export function Habit() {
  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="text-zinc-400 text-base font-semiBold mt-6 lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white text-3xl font-extrabold">
          {dayAndMonth}
        </Text>
        <ProgressBar progress={80} />

        <View className="mt-6">
          <Checkbox title={"Beber 2 litros de água"} checked/>
          <Checkbox title={"Exercício"} />
        </View>
      </ScrollView>
    </View>
  );
}
