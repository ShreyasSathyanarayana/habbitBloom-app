import Container from "@/components/ui/container";
import { GradientButton } from "@/components/ui/gradient-button";
import Header from "@/components/ui/header";
import TextField from "@/components/ui/TextField";
import { horizontalScale, verticalScale } from "@/metric";
import React, { useEffect, useState } from "react";
import { Controller, set, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import SuggestionTitleIcon from "@/assets/svg/suggestion-title.svg";
import SuggestionDescriptionIcon from "@/assets/svg/suggestion-description.svg";
import DropdownField from "@/components/ui/drop-down";
import CategoriesIcon from "@/assets/svg/categories-icon.svg";
import { Status_options, Suggestion_categories } from "@/utils/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "react-native-toast-notifications";
import { router } from "expo-router";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import StatusIcon from "@/assets/svg/status-icon.svg";
import { updateSuggestionStatus } from "@/api/api";
import { ThemedText } from "@/components/ui/theme-text";
import { getFontSize } from "@/font";
const _iconSize = horizontalScale(24);

const UpdateSuggestion = () => {
  const { title, categories, description, status, id, full_name, email } =
    useLocalSearchParams<{
      title: string;
      categories: string;
      description: string;
      status: string;
      id: string;
      full_name: string;
      email: string;
    }>();
  const { control, watch, handleSubmit, setValue } = useForm({
    defaultValues: {
      categories: "",
      title: "",
      description: "",
      status: "",
    },
    mode: "onChange",
  });
  const toast = useToast();
  const queryclient = useQueryClient();
  useEffect(() => {
    setValue("categories", categories);
    setValue("description", description);
    setValue("title", title);
    setValue("status", status);
  }, []);

  const updateSuggestionMutation = useMutation({
    mutationKey: ["updateSuggestion"],
    mutationFn: () => {
      return updateSuggestionStatus(id, watch("status"));
    },
    onSuccess: () => {
      queryclient.invalidateQueries({ queryKey: ["getAllSuggestion"] });
      toast.show("Status Updated Successfully", {
        type: "success",
      });
      router.back();
    },
    onError: (error) => {
      toast.show(`${error.message}`, {
        type: "warning",
      });
    },
  });

  // console.log(id);

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
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ gap: verticalScale(16) }}
        >
          <ThemedText style={{ fontSize: getFontSize(14) }}>
            {full_name} {`(${email})`}
          </ThemedText>
          <Controller
            control={control}
            // rules={{
            //   required: "Title is required",
            //   validate: (val) =>
            //     val?.length < 30 || "can contain only 30 character",
            // }}
            render={({
              field: { onChange, onBlur, value },
              formState: { errors },
            }) => (
              <TextField
                // key={"habitName"}
                disabled
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
            // rules={{ required: "Category is required" }}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <DropdownField
                disabled
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
            // rules={{
            //   // required: "Habit Name is required",
            //   required: "Suggestion is Required",
            //   validate: (val) =>
            //     val?.length < 200 || "can contain only 200 character",
            // }}
            render={({
              field: { onChange, onBlur, value },
              formState: { errors },
            }) => (
              <TextField
                // key={"habitName"}
                disabled
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
          <Controller
            control={control}
            name="status"
            rules={{ required: "Status is required" }}
            render={({ field: { onChange, value }, formState: { errors } }) => (
              <DropdownField
                label="Status"
                value={value}
                onChange={onChange}
                options={Status_options}
                placeholder="Select the category"
                key="Categories"
                leftIcon={<StatusIcon width={_iconSize} height={_iconSize} />}
                helperText={errors.status?.message}
                error={!!errors.status}
              />
            )}
          />
        </ScrollView>
        <GradientButton
          isLoading={updateSuggestionMutation?.isPending}
          disabled={updateSuggestionMutation?.isPending}
          title="DONE"
          onPress={handleSubmit((data) =>
            updateSuggestionMutation?.mutateAsync()
          )}
        />
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({});

export default UpdateSuggestion;
