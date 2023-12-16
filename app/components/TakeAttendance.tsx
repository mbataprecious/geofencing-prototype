"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@/utils/helpers";
import { object, string } from "yup";
import { getData } from "@/utils/storage";
import { Button } from "./buttons";
import { getGeoLocation } from "@/utils/getLocation";
import { SetupSchemaType } from "@/validation/SetupSchema";
import { toast } from "react-toastify";

export const setupSchema = object({
  code: string()
    .label("code")
    .test("is-valid-code", "code is invalide", (code) => {
      let data = getData();
      if (data?.code === code) {
        return true;
      } else {
        return false;
      }
    })
    .required(),
});
const TakeAttendance = () => {
  const [attendStatus, setAttendStatus] = useState<"success" | "error">();

  useEffect(() => {
    getGeoLocation(() => {
      console.log("location accepted...");
    });
  }, []);
  const onSubmit = () => {
    const savedData = getData();
    if (!savedData?.code) {
      toast.error("ERR: no saved code.");
      return;
    }
    const geofenceCenter = {
      lat: savedData.location.latitude,
      lng: savedData.location.longitude,
    };

    getGeoLocation((position) => {
      // Use Geometry Library to check if the location is within the geofence
      const isWithinGeofence =
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(geofenceCenter),
          new google.maps.LatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        ) <=
        savedData.radius * 1609.34;

      if (isWithinGeofence) {
        setAttendStatus("success");
        toast.success("you are within the geofenced area.");
      } else {
        toast.error("Attendance failed.not in geofenced area.");
        setAttendStatus("error");
      }
    });
  };
  const methods = useForm({
    mode: "onSubmit",
    resolver: yupResolver ? yupResolver(setupSchema) : undefined,
  });
  return (
    <div className=" text-white mt-8 px-6">
      <h3 className=" text-xl underline mb-32"> Take Attendance</h3>
      <FormProvider {...methods}>
        <form
          className=" flex justify-center items-center"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-8">
            <Input name="code" type="text" label="" />
            <Button isOutlined type="submit">
              SUBMIT
            </Button>
            {attendStatus === "success" && (
              <div className=" text-green-500 text-base font-medium">
                Successful
                <br />
                Location: *********
              </div>
            )}
            {attendStatus === "error" && (
              <div className=" text-red-500 text-base font-medium">
                Error
                <br />
                Location: *********
              </div>
            )}
            <div className=" flex justify-center items-center">
              {attendStatus && (
                <p
                  className="cursor-pointer hover:underline"
                  onClick={() => setAttendStatus(undefined)}
                >
                  clear status
                </p>
              )}
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default TakeAttendance;
