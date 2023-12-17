"use client";
import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@/utils/helpers";
import { object, string } from "yup";
import { getData } from "@/utils/storage";
import { Button } from "./buttons";
import { getGeoLocation } from "@/utils/getLocation";
import { toast } from "react-toastify";
import Link from "next/link";
import axios from "axios";

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
  const [location, setLocation] = useState("");

  useEffect(() => {
    getGeoLocation(() => {
      console.log("location accepted...");
    });
  }, []);
  const onSubmit = async () => {
    const savedData = getData();
    if (!savedData?.code) {
      toast.error("ERR: no saved code.");
      return;
    }
    const geofenceCenter = {
      lat: savedData.location.latitude,
      lng: savedData.location.longitude,
    };

    getGeoLocation(async (position) => {
      // Use Geometry Library to check if the location is within the geofence
      const isWithinGeofence =
        google.maps.geometry.spherical.computeDistanceBetween(
          new google.maps.LatLng(geofenceCenter),
          new google.maps.LatLng({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        ) <= savedData.radius;
      const { data } = await axios({
        url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&location_type=APPROXIMATE&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`,
        method: "GET",
      });
      setLocation(data.results[0].formatted_address);
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
      <Link href="/">
        <h3 className=" text-xl hover:underline mb-32"> Set Location</h3>
      </Link>

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
                Location: {location}
              </div>
            )}
            {attendStatus === "error" && (
              <div className=" text-red-500 text-base font-medium">
                Error
                <br />
                Location: {location}
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
