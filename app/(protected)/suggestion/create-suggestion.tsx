import Container from "@/components/ui/container";
import { GradientButton } from "@/components/ui/gradient-button";
import Header from "@/components/ui/header";
import TextField from "@/components/ui/TextField";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import SuggestionTitleIcon from "@/assets/svg/suggestion-title.svg";
import SuggestionDescriptionIcon from "@/assets/svg/suggestion-description.svg";
import DropdownField from "@/components/ui/drop-down";
import CategoriesIcon from "@/assets/svg/categories-icon.svg";
import { Suggestion_categories } from "@/utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertSuggestion } from "@/api/api";
import { useToast } from "react-native-toast-notifications";
import { router } from "expo-router";

const _iconSize = horizontalScale(24);

const CreateSuggestion = () => {
  const { control, watch, handleSubmit } = useForm({
    defaultValues: {
      categories: "",
      title: "",
      description: "",
    },
    mode: "onChange",
  });
  const toast = useToast();
  const queryclient = useQueryClient()

  const insertSuggestionMutation = useMutation({
    mutationKey: ["insertSuggestion"],
    mutationFn: () => {
      return insertSuggestion(watch());
    },
    onSuccess: () => {
      toast.show("Suggestion submitted successfully", {
        type: "success",
      });
      queryclient.invalidateQueries({ queryKey: ["mySuggestion"] });
      router.back();
    },
    onError: (error: any) => {
      toast.show(error.message, {
        type: "warning",
      });
    },
  });
  // console.log(watch());

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
        <View style={{ gap: verticalScale(16) }}>
          <Controller
            control={control}
            rules={{
              required: "Title is required",
              validate: (val) =>
                val?.length < 50 || "can contain only 30 character",
            }}
            render={({
              field: { onChange, onBlur, value },
              formState: { errors },
            }) => (
              <TextField
                // key={"habitName"}
                label="Title"
                placeholder="Title"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                leftIcon={
                  <SuggestionTitleIcon
                    width={horizontalScale(24)}
                    height={horizontalScale(24)}
                  />
                }
                helperText={errors.title?.message}
                error={!!errors.title}
              />
            )}
            name="title"
          />
          <Controller
            control={control}
            name="categories"
            rules={{ required: "Category is required" }}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <DropdownField
                label="Categories"
                value={value}
                onChange={onChange}
                options={Suggestion_categories}
                placeholder="Select the category"
                key="Categories"
                leftIcon={
                  <CategoriesIcon width={_iconSize} height={_iconSize} />
                }
                helperText={errors.categories?.message}
                error={!!errors.categories}
              />
            )}
          />
          <Controller
            control={control}
            rules={{
              // required: "Habit Name is required",
              required: "Suggestion is Required",
              validate: (val) =>
                val?.length < 200 || "can contain only 200 character",
            }}
            render={({
              field: { onChange, onBlur, value },
              formState: { errors },
            }) => (
              <TextField
                // key={"habitName"}
                label="Description"
                placeholder="Type here"
                numberOfLines={5}
                textarea={true}
                maxLength={200}
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                leftIcon={
                  <SuggestionDescriptionIcon
                    width={_iconSize}
                    height={_iconSize}
                  />
                }
                helperText={errors.description?.message}
                error={!!errors.description}
              />
            )}
            name="description"
          />
        </View>
        <GradientButton
          isLoading={insertSuggestionMutation.isPending}
          disabled={insertSuggestionMutation.isPending}
          title="SUBMIT"
          onPress={handleSubmit(() => insertSuggestionMutation?.mutateAsync())}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default CreateSuggestion;
