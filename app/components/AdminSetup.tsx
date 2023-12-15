"use client";
import React from "react";
import { Input } from "./Input";
import { SearchSelectInput } from "./SearchSelectInput";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@/utils/helpers";
import { setupSchema } from "@/validation/SetupSchema";
import axios from "axios";

const AdminSetup = () => {
  const defaultValues = {
    code: "",
    location: {
      label: "",
      value: "",
    },
    radius: 0,
  };

  const loadOption = async (inputValue: string) => {
    if (inputValue.length > 3) {
      const { data } = await axios.post(
        `https://places.googleapis.com/v1/places:searchText=${inputValue}`,
        {
          headers: {
            "X-Goog-Api-Key": "AIzaSyD6XOuP55y8eBL8R11VbaugRdg4iE955fw",
            "X-Goog-FieldMask":
              "places.displayName,places.formattedAddress,places.location",
          },
          data: {
            textQuery: inputValue,
          },
        }
      );
      return data?.data.map((project: IPlaces) => ({
        value: project.displayName.text,
        label: `${project.location.latitude},${project.location.longitude}`,
      }));
    }
  };

  const onSubmit = () => {};

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver ? yupResolver(setupSchema) : undefined,
    defaultValues,
  });
  return (
    <div className=" text-white mt-8 px-6">
      <h3 className=" text-xl underline mb-32">Take Attendance</h3>
      <FormProvider {...methods}>
        <form
          className=" flex flex-col gap-5"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div>
            code: <Input name="code" type="text" />
          </div>
          <div>
            location:{" "}
            <SearchSelectInput name="location" loadOptions={loadOption} />
          </div>
          <div>
            radius in miles(m): <Input name="radius" type="number" />
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AdminSetup;
