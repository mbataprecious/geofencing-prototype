import { InferType, number, object, string } from "yup";

export const setupSchema = object({
  code: string().label("code").required(),
  location: object().shape({
    value: string().required().label("location"),
    label: string().required().label("label"),
  }),
  radius: number().label("code"),
});

export type LevelDescriptionSchemaType = InferType<typeof setupSchema>;
