import { InferType, number, object, string } from "yup";

export const setupSchema = object({
  code: string().label("code").required(),
  location: object().shape({
    value: string().required().label("location"),
    label: string().required().label("label"),
  }),
  radius: number()
    .label("radius")
    .required()
    .min(1, "radius must be greater than 5 miles"),
});

export type SetupSchemaType = InferType<typeof setupSchema>;
