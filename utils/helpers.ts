import { FieldValues } from "react-hook-form";
import { yupResolver as yupResolvers } from "@hookform/resolvers/yup";


export const getErrObject = (name: string, errors: FieldValues) => {
    const nameArray = name.split(".");
    return nameArray.reduce(function (acc, item) {
      if (!acc) return null;
      if (acc[item]) {
        return acc[item];
      } else {
        return null;
      }
    }, errors as FieldValues);
  };
  const isClient = () => typeof window === "object";

export  const yupResolver = isClient() ? yupResolvers : undefined;