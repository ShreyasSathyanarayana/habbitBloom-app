import { globalStyles } from "@/app/(not-auth)/(auth)/weclome-screen";
import BackButton from "@/components/ui/back-button";
import Container from "@/components/ui/container";
import { GradientButton } from "@/components/ui/gradient-button";
import TextField from "@/components/ui/TextField";
import { ThemedText } from "@/components/ui/theme-text";
import { horizontalScale } from "@/metric";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import PhoneInIcon from "@/assets/svg/phone-icon-in.svg";
import PhoneActIcon from "@/assets/svg/phone-icon-act.svg";

const VerifyNumber = () => {
  const { control } = useForm({
    defaultValues: {
      number: "",
    },
  });
  return (
    <Container style={{ paddingHorizontal: horizontalScale(16) }}>
      <View style={globalStyles.header}>
        <BackButton />
      </View>
      <View style={globalStyles.heroSection}>
        <Controller
          control={control}
          rules={{ required: "Enter the pool name" }}
          render={({
            field: { onChange, onBlur, value },
            formState: { errors },
          }) => (
            <TextField
              label="Pool name"
              placeholder="Enter pool name"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              helperText={errors.number?.message}
              error={!!errors.number}
              leftIcon={<PhoneActIcon color={"red"} />}
            />
          )}
          name="number"
        />
      </View>
      <View style={globalStyles.footer}>
        <GradientButton title="VERIFY" />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default VerifyNumber;
