"use client";
import React, { useId } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import {
  CSSObjectWithLabel,
  MultiValue,
  SingleValue,
  StylesConfig,
} from "react-select";
import ReactSelect from "react-select/async";
import { getErrObject } from "../../utils/helpers";
interface Props {
  label?: string;
  name: string;
  options?: { value: string; label: string }[];
  isSearchable?: boolean;
  isClearable?: boolean;
  placeholder?: string;
  loadOptions?: (
    inputValue: string
  ) => Promise<{ value: string; label: string }[]>;
  isMulti?: boolean;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const colourStyles: StylesConfig<{ value: string; label: string }> = {
  singleValue: (styles, props) => {
    return {
      ...styles,
      color: props.data?.value === "" ? "#aeb6c4" : styles.color,
    } as CSSObjectWithLabel;
  },
};
const SearchSelectInput = ({
  label,
  name,
  placeholder,
  options,
  loadOptions,
  isMulti,
  required,
  disabled,
  className,
}: Props) => {
  const { control, formState } = useFormContext();
  const selectId = useId();

  return (
    <div className={"control custom-select " + className}>
      {label && (
        <label className="label" htmlFor={name}>
          {label} {required && <i className="text-xs text-[#0275D8]">*</i>}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        render={({ field: { onBlur, onChange, value, name, ref } }) => (
          <ReactSelect
            instanceId={selectId}
            id={name}
            isDisabled={disabled}
            ref={ref}
            placeholder={placeholder}
            isMulti={isMulti}
            defaultOptions={options}
            className={`border-0 w-full text-black  my-0.5 focus:outline-none focus:ring focus:border-blue-300 shadow-none
                            ${formState.errors[name] && "errorControl"}`}
            onBlur={onBlur}
            value={
              value?.value === "" ? { label: placeholder, value: "" } : value
            }
            onChange={(
              newValue:
                | MultiValue<
                    | { value: string; label: string }[]
                    | { value: string; label: string }
                  >
                | SingleValue<{
                    value: string;
                    label: string;
                  }>
            ) => onChange(newValue)}
            loadOptions={loadOptions}
            styles={colourStyles}
          />
        )}
      />
      <p className="errorText text-xs flex items-start">
        {!!getErrObject(name, formState?.errors) && (
          <>
            {" "}
            <span className=" ">
              <InformationCircleIcon className="w-4 h-4 mr-1 inline" />
            </span>
            {getErrObject(name, formState?.errors)?.value.message}
          </>
        )}
      </p>
    </div>
  );
};

export { SearchSelectInput };
