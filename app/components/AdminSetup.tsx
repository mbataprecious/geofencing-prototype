"use client";
import React from "react";
import { Input } from "./Input";
import { SearchSelectInput } from "./SearchSelectInput";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@/utils/helpers";
import { SetupSchemaType, setupSchema } from "@/validation/SetupSchema";
import axios from "axios";
import { Button } from "./buttons";
import { setData } from "@/utils/storage";
import { useRouter } from "next/navigation";

const AdminSetup = () => {
  const router = useRouter();

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
      const { data } = await axios({
        url: "https://places.googleapis.com/v1/places:searchText",
        method: "POST",
        headers: {
          Accept: "*/*",
          "X-Goog-Api-Key": process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.location",
        },
        data: {
          textQuery: inputValue,
        },
      });
      return data?.places.map((project: IPlaces) => ({
        value: `${project.location.latitude},${project.location.longitude}`,
        label: project.displayName.text,
      }));
    }
  };

  const onSubmit = (data: SetupSchemaType) => {
    const details = {
      ...data,
      location: {
        latitude: parseFloat(data.location.value.split(",")[0]),
        longitude: parseFloat(data.location.value.split(",")[1]),
      },
    };

    setData(details);
    router.push("/students");
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver ? yupResolver(setupSchema) : undefined,
    defaultValues,
  });
  return (
    <div className=" text-white mt-8 px-6">
      <h3 className=" text-xl underline mb-32">Set Location setup</h3>
      <FormProvider {...methods}>
        <form
          className=" flex flex-col gap-5 max-w-2xl"
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
          <div className=" mt-16">
            <Button isOutlined type="submit">
              Submit
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AdminSetup;
