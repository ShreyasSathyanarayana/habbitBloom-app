import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import InfoIcon from "@/assets/svg/info-icon.svg";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
import { Controller, useForm } from "react-hook-form";
import TextField from "@/components/ui/TextField";
import Label from "@/components/ui/Label";
import Switch from "@/components/ui/switch";
import CorrectIcon from "@/assets/svg/correct-icon.svg";
import { GradientButton } from "@/components/ui/gradient-button";
import { goodHabitsCategories } from "@/utils/constants";
import { LinearGradient } from "expo-linear-gradient";
import TimePicker from "@/components/ui/time-picker";
import TimerIcon from "@/assets/svg/timer-icon.svg";
import UpDownIcon from "@/assets/svg/up-down.svg";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createOrUpdateHabit,
  deleteHabit,
  getHabitById,
  getHabitNames,
} from "@/api/api";
import { router, useLocalSearchParams } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { insertHabit } from "@/database/db";
import HabitNameIcon from "@/assets/svg/hadit-name.svg";
import { useRoute } from "@react-navigation/native";
import NotificationIcon from "@/assets/svg/notification.svg";
import GoogleCalenderIcon from "@/assets/svg/google-calender.svg";
import CalenderIcon from "@/assets/svg/calendar-active-icon.svg";
import CalenderInactiveIcon from "@/assets/svg/calendar-inactive-icon.svg";
import UpdownInactiveIcon from "@/assets/svg/up-down-inactive.svg";
import DateInputV2 from "@/components/ui/date-picker";
import DescriptionIcon from "@/assets/svg/description-icon.svg";
import { scheduleNotification } from "@/services/notificationService";

const days = ["S", "M", "T", "W", "T", "F", "S"];
const colors = [
  "rgba(255, 59, 48, 1)",
  "rgba(255, 149, 0, 1)",
  "rgba(255, 214, 10, 1)",
  "rgba(52, 199, 89, 1)",
  "rgba(0, 122, 255, 1)",
  "rgba(88, 86, 214, 1)",
  "rgba(0, 172, 193, 1)",
  "rgba(216, 27, 96, 1)",
];

const CreateHabit = () => {
  const { id } = useLocalSearchParams();
  const habitId = Array.isArray(id) ? id[0] : id;

  const { control, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      habitName: "",
      category: goodHabitsCategories?.[0]?.name,
      reminderTime: "10:00:00",
      frequency: [0, 1, 2, 3, 4, 5, 6] as number[],
      notificationEnable: true,
      habitColor: "rgba(255, 59, 48, 1)",
      googleNotificationEnable: false,
      end_date: null,
      description: "",
    },
    mode: "all",
  });
  const toast = useToast();
  const categoryRef = useRef<FlatList<any>>(null);
  const [isCreatingHabit, setIsCreatingHabit] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const category = watch("category"); // Watch category value

  const getHabitNamesQuery = useQuery({
    queryKey: ["habitNames"],
    queryFn: () => getHabitNames(),
  });

  console.log(
    "Habit Names==>",
    JSON.stringify(getHabitNamesQuery?.data, null, 2)
  );

  const mutation = useMutation({
    mutationFn: (data: any) => {
      setIsCreatingHabit(true);
      return createOrUpdateHabit(data, habitId);
    },
    onSuccess: (data) => {
      // console.log("onSuccess", JSON.stringify(data, null, 2));
      if (watch("notificationEnable")) {
        scheduleNotification({
          reminder_time: data[0]?.reminder_time,
          habit_name: data[0]?.habit_name,
          id: data[0]?.id,
        });
      }

      queryClient.invalidateQueries({ queryKey: ["habitList"] });
      queryClient.invalidateQueries({ queryKey: ["habitCount"] });

      router.dismissAll();
      router.replace("/(protected)/(tabs)");
    },
    onError: (error: any) => {
      console.log("error", error);

      toast.show(error.message, {
        type: "warning",
      });
    },
    onSettled: () => {
      setIsCreatingHabit(false);
    },
  });

  useEffect(() => {
    if (!categoryRef.current || !category) return;

    const LAST_INDEX = goodHabitsCategories.length - 1;
    const INTIAL_INDEX = 0;

    const index = goodHabitsCategories.findIndex(
      (item) => item.name === category
    );
    if (index !== -1) {
      setTimeout(() => {
        categoryRef.current?.scrollToIndex({
          index,
          animated: true,
          viewPosition:
            index === LAST_INDEX ? 1 : index === INTIAL_INDEX ? 0 : 0.5, // Center the item
        });
      }, 200); // Small delay ensures UI is ready before scrolling
    }
  }, [category]);

  const onFrequencyPress = (day: number) => {
    const currentFrequency = watch("frequency") || [];
    if (currentFrequency.includes(day)) {
      // Remove day if already selected
      setValue(
        "frequency",
        currentFrequency.filter((d: number) => d !== day)
      );
    } else {
      // Add day if not selected
      setValue("frequency", [...currentFrequency, day]);
    }
  };

  return (
    <Container>
      <Header title="Create Habit" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingTop: verticalScale(16) }}
        style={{
          flex: 1,
          paddingHorizontal: horizontalScale(16),
          // marginTop: verticalScale(16),
          // paddingTop: verticalScale(16),
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(8),
          }}
        >
          <InfoIcon width={horizontalScale(24)} height={horizontalScale(24)} />

          <ThemedText style={{ fontSize: getFontSize(13) }}>
            Learn how to track habits effectively!{" "}
            <ThemedText
              onPress={() =>
                router.push("/(protected)/create-habit/habit-instruction")
              }
              style={{
                color: "rgba(138, 43, 226, 1)",
                fontSize: getFontSize(13),
                fontFamily: "PoppinsBold",
                textDecorationLine: "underline",
              }}
            >
              Read
            </ThemedText>
          </ThemedText>
        </View>
        <View
          style={{
            flex: 1,
            gap: verticalScale(16),
            paddingTop: verticalScale(16),
          }}
        >
          <Controller
            control={control}
            rules={{
              required: "Habit Name is required",
              validate: (val) => {
                if (val.length > 100) return "Can contain only 100 characters";
                if (
                  getHabitNamesQuery?.data?.includes(val.toLowerCase().trim())
                )
                  return "Habit name already exists";
                return true;
              },
            }}
            render={({
              field: { onChange, onBlur, value },
              formState: { errors },
            }) => (
              <TextField
                // key={"habitName"}
                label="Habit Name"
                placeholder="Habit Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                leftIcon={
                  <HabitNameIcon
                    width={horizontalScale(24)}
                    height={horizontalScale(24)}
                  />
                }
                helperText={errors.habitName?.message}
                error={!!errors.habitName}
              />
            )}
            name="habitName"
          />
          <Label label="Categories:">
            <FlatList
              ref={categoryRef}
              data={goodHabitsCategories}
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              horizontal
              contentContainerStyle={{
                gap: horizontalScale(16),
                marginTop: verticalScale(8),
              }}
              keyExtractor={(item, index) => "categories==>" + index}
              renderItem={({ item, index }) => {
                const isSelected = watch("category") === item.name;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setValue("category", item.name);
                      categoryRef.current?.scrollToIndex({
                        index,
                        animated: true,
                        viewPosition:
                          index === 0
                            ? 0
                            : index != goodHabitsCategories.length - 1
                            ? 0.5
                            : 1,
                      });
                    }}
                  >
                    <LinearGradient
                      colors={item.colors as [string, string, ...string[]]}
                      start={{ x: 0, y: 0 }} // Adjusts the gradient direction
                      end={{ x: 1, y: 0.8 }}
                      style={[
                        {
                          paddingHorizontal: horizontalScale(16),
                          paddingVertical: verticalScale(12),
                          borderRadius: horizontalScale(16),
                          flexDirection: "row",
                          alignItems: "center",
                          gap: horizontalScale(8),
                          borderWidth: 2,
                        },
                        isSelected && { borderWidth: 2, borderColor: "white" },
                      ]}
                    >
                      {item.icon}
                      <ThemedText>{item.name}</ThemedText>
                    </LinearGradient>
                  </TouchableOpacity>
                );
              }}
            />
          </Label>
          <Controller
            control={control}
            rules={{
              // required: "Habit Name is required",
              validate: (val) =>
                val?.length < 200 || "can contain only 200 character",
            }}
            render={({
              field: { onChange, onBlur, value },
              formState: { errors },
            }) => (
              <TextField
                // key={"habitName"}
                label="Description (Optional)"
                placeholder="Description here"
                numberOfLines={5}
                textarea={true}
                maxLength={200}
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                leftIcon={
                  <DescriptionIcon
                    width={horizontalScale(24)}
                    height={horizontalScale(24)}
                  />
                }
                helperText={errors.description?.message}
                error={!!errors.description}
              />
            )}
            name="description"
          />
          <Controller
            control={control}
            name="reminderTime"
            render={({
              field: { onChange, onBlur, value },
              formState: { errors },
            }) => {
              return (
                <TimePicker
                  leftIcon={
                    <TimerIcon
                      width={horizontalScale(24)}
                      height={horizontalScale(24)}
                    />
                  }
                  rightIcon={
                    <UpDownIcon
                      width={horizontalScale(24)}
                      height={horizontalScale(24)}
                    />
                  }
                  value={value}
                  label="Set Reminder"
                  onChange={onChange}
                />
              );
            }}
          />
          <Label label="Repeat Frequency">
            <FlatList
              data={days}
              horizontal
              contentContainerStyle={{
                flexDirection: "row",
                justifyContent: "space-around",
                flex: 1,
                marginTop: verticalScale(10),
              }}
              keyExtractor={(item, index) => index.toString() + "weekDays"}
              renderItem={({ item, index }) => {
                const isSelected = watch("frequency")?.includes(index);
                return (
                  <TouchableOpacity
                    onPress={() => onFrequencyPress(index)}
                    style={[
                      styles.weekBtn,
                      isSelected && {
                        borderColor: "white",
                        backgroundColor: "rgba(138, 43, 226, 1)",
                      },
                    ]}
                  >
                    <ThemedText
                      style={{
                        fontSize: getFontSize(13),
                        fontFamily: "PoppinsBold",
                      }}
                    >
                      {item}
                    </ThemedText>
                  </TouchableOpacity>
                );
              }}
            />
          </Label>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: verticalScale(8),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(12),
              }}
            >
              <NotificationIcon
                width={horizontalScale(32)}
                height={horizontalScale(32)}
              />
              <View>
                <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>
                  Notification
                </ThemedText>
                <ThemedText style={{ fontSize: getFontSize(12) }}>
                  Get habit reminders
                </ThemedText>
              </View>
            </View>
            <Controller
              control={control}
              name="notificationEnable"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onPress={() => onChange(!value)} />
              )}
            />
          </View>
          {/* <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: verticalScale(8),
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: horizontalScale(12),
              }}
            >
              <GoogleCalenderIcon
                width={horizontalScale(32)}
                height={horizontalScale(32)}
              />
              <View>
                <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>
                  Google Calendar
                </ThemedText>
                <ThemedText style={{ fontSize: getFontSize(12) }}>
                  Get habit reminders
                </ThemedText>
              </View>
            </View>
            <Controller
              control={control}
              name="googleNotificationEnable"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onPress={() => onChange(!value)} />
              )}
            />
          </View> */}
          {/* <Label label="Habit Color">
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                gap: verticalScale(15),
                marginTop: verticalScale(10),
              }}
            >
              {colors.map((color, index) => {
                return (
                  <Controller
                    control={control}
                    key={"colors" + index}
                    name="habitColor"
                    render={({ field: { onChange, value } }) => (
                      <TouchableOpacity
                        //  key={index}
                        onPress={() => onChange(color)}
                        key={index + "colors"}
                        style={[
                          {
                            width: horizontalScale(44),
                            height: horizontalScale(44),
                            borderRadius: horizontalScale(22),
                            backgroundColor: color,
                            borderWidth: 2,
                            borderColor: color,
                            alignItems: "center",
                            justifyContent: "center",
                          },
                          value === color && {
                            borderWidth: 2,
                            borderColor: "rgba(255, 255, 255, 1)",
                          },
                        ]}
                      >
                        {value === color && (
                          <CorrectIcon
                            width={horizontalScale(24)}
                            height={horizontalScale(24)}
                          />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                );
              })}
            </View>
          </Label> */}
          <Controller
            control={control}
            name="end_date"
            render={({
              field: { onChange, onBlur, value },
              formState: { errors },
            }) => {
              return (
                <DateInputV2
                  leftIcon={
                    <CalenderIcon
                      width={horizontalScale(24)}
                      height={horizontalScale(24)}
                    />
                  }
                  inActiveLeftIcon={
                    <CalenderInactiveIcon
                      width={horizontalScale(24)}
                      height={horizontalScale(24)}
                    />
                  }
                  rightIcon={
                    <Pressable onPress={() => setValue("end_date", null)}>
                      <ThemedText
                        style={{
                          fontSize: getFontSize(12),
                          fontFamily: "PoppinsSemiBold",
                          color: "rgba(138, 43, 226, 1)",
                        }}
                      >
                        Reset
                      </ThemedText>
                    </Pressable>
                  }
                  inActiveRightIcon={
                    <UpdownInactiveIcon
                      width={horizontalScale(24)}
                      height={horizontalScale(24)}
                    />
                  }
                  minimumDate={
                    new Date(new Date().setDate(new Date().getDate() + 1))
                  }
                  placeholder="Select the date"
                  value={value ?? ""}
                  label="End Date (Optional)"
                  onChange={onChange}
                />
              );
            }}
          />
        </View>
      </ScrollView>
      <GradientButton
        disable={!watch("habitName")}
        title={"Save Habit"}
        isLoading={isCreatingHabit}
        onPress={handleSubmit((data) => mutation.mutateAsync(data))}
        style={{
          marginHorizontal: horizontalScale(16),
          marginVertical: verticalScale(20),
        }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  weekBtn: {
    borderRadius: horizontalScale(6),
    borderWidth: horizontalScale(2),
    borderColor: "rgba(138, 43, 226, 1)",
    width: horizontalScale(32),
    height: horizontalScale(32),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CreateHabit;
