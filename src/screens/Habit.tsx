import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import { BackButton } from "../components/BackButton";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/CheckBox";
import { useEffect, useState } from "react";
import { Loading } from "../components/loading";
import { api } from "../lib/axios";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface Params {
  date: string;
}
interface DayInfoProps {
  completedHabits: string[];
  possibleHabits: {
    id: string;
    title: string;
  }[];
}
export function Habit() {
  const [loading, setLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  const route = useRoute();
  const { date } = route.params as Params;

  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");
  const isDateBefore = parsedDate.endOf("day").isBefore(new Date());

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;
  async function fetchHabits() {
    try {
      setLoading(true);

      const response = await api.get("/day", { params: { date } });
      //console.log(response.data);
      setCompletedHabits(response.data.completedHabits);
      setDayInfo(response.data);
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Ops",
        "Não foi possível carregar as informações dos hábitos"
      );
    } finally {
      setLoading(false);
    }

    if (loading) {
      return <Loading />;
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`);
      if (completedHabits?.includes(habitId)) {
        setCompletedHabits((prevState) =>
          prevState.filter((habit) => habit !== habitId)
        );
      } else {
        setCompletedHabits((prevState) => [...prevState, habitId]);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("ops", "Não foi possível atualizar o status do hábito");
    }
  }
  useEffect(() => {
    fetchHabits();
  }, []);
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
        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateBefore,
          })}
        >
          {dayInfo?.possibleHabits ? (
            dayInfo?.possibleHabits.map((habit) => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                disabled={isDateBefore}
                checked={completedHabits!.includes(habit.id)}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>
        {isDateBefore && (
          <Text className="text-white mt-10 text-center">
            Você não pode editar um hábito em data passada
          </Text>
        )}
      </ScrollView>
    </View>
  );
}
