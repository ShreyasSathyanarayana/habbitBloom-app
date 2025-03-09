import Container from "@/components/ui/container";
import Header from "@/components/ui/header";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useEffect, useRef } from "react";
import {
  FlatList,
  Platform,
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
import { useMutation } from "@tanstack/react-query";
import { createHabit } from "@/api/api";
import { router } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { insertHabit } from "@/database/db";
import HabitNameIcon from "@/assets/svg/hadit-name.svg";

const days = ["M", "T", "W", "T", "F", "S", "S"];
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

const Index = () => {
  const { control, setValue, watch, handleSubmit } = useForm({
    defaultValues: {
      habitName: "",
      category: goodHabitsCategories?.[0]?.name,
      reminderTime: "12:00:00",
      frequency: [0] as number[],
      notificationEnable: false,
      habitColor: "rgba(255, 59, 48, 1)",
    },
  });
  const toast = useToast();
  const categoryRef = useRef<FlatList<any>>(null);
  const category = watch("category"); // Watch category value
  const mutation = useMutation({
    mutationFn: (data: any) => {
      return insertHabit(data); //createHabit(data);
    },
    onSuccess: () => {
      router.back();
    },
    onError: (error: any) => {
      console.log("error", error);

      toast.show(error.message, {
        type: "warning",
      });
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
      }, 800); // Small delay ensures UI is ready before scrolling
    }
  }, []);

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
        style={{ flex: 1, paddingHorizontal: horizontalScale(16) }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: horizontalScale(8),
          }}
        >
          <InfoIcon width={horizontalScale(24)} height={horizontalScale(24)} />
          <ThemedText style={{ fontSize: getFontSize(14) }}>
            Learn how to track habits effectively!{" "}
            <ThemedText
              style={{
                color: "rgba(138, 43, 226, 1)",
                fontSize: getFontSize(14),
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
              validate: (val) =>
                val?.length < 100 || "can contain only 100 character",
            }}
            render={({
              field: { onChange, onBlur, value },
              formState: { errors },
            }) => (
              <TextField
                key={"habitName"}
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
          <Label
            label="Repeat Frequency"
            // labelStyle={{ marginBottom: verticalScale(16) }}
          >
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
            <View>
              <ThemedText style={{ fontFamily: "PoppinsSemiBold" }}>
                Notification
              </ThemedText>
              <ThemedText style={{ fontSize: getFontSize(12) }}>
                Get habit reminders
              </ThemedText>
            </View>
            <Controller
              control={control}
              name="notificationEnable"
              render={({ field: { onChange, value } }) => (
                <Switch value={value} onPress={() => onChange(!value)} />
              )}
            />
          </View>
          <Label label="Habit Color">
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
          </Label>
        </View>
      </ScrollView>
      <GradientButton
        title="Save Habit"
        onPress={handleSubmit((data) => mutation.mutateAsync(data))}
        style={{
          marginHorizontal: horizontalScale(16),
          paddingBottom:
            Platform.OS === "ios" ? verticalScale(8) : verticalScale(16),
          marginVertical: verticalScale(20),
        }}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  weekBtn: {
    // paddingHorizontal: horizontalScale(10),
    // paddingVertical: horizontalScale(6),
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(138, 43, 226, 1)",
    width: horizontalScale(32),
    height: horizontalScale(32),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Index;
