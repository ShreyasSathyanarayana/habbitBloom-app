import Container from "@/components/ui/container";
import { GradientButton } from "@/components/ui/gradient-button";
import Header from "@/components/ui/header";
import TextField from "@/components/ui/TextField";
import { horizontalScale } from "@/metric";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import DescriptionIcon from "@/assets/svg/description-icon.svg";

const Index = () => {
  const { control } = useForm({
    defaultValues: {
      suggestion: "",
    },
  });
  return (
    <Container>
      <Header title="Suggestion Box" />
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          padding: horizontalScale(16),
        }}
      >
        <Controller
          control={control}
          rules={{
            // required: "Habit Name is required",
            validate: (val) =>
              val?.length < 100 || "can contain only 200 character",
          }}
          render={({
            field: { onChange, onBlur, value },
            formState: { errors },
          }) => (
            <TextField
              // key={"habitName"}
              label="Suggestion box"
              placeholder="Type here"
              numberOfLines={5}
              textarea={true}
              maxLength={250}
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
              helperText={errors.suggestion?.message}
              error={!!errors.suggestion}
            />
          )}
          name="suggestion"
        />
        <GradientButton title="SEND" />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default Index;
