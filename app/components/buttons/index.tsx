import React from "react";
import { cva, VariantProps } from "class-variance-authority";
import Spin from "../shared/spin";

interface Props extends VariantProps<typeof buttonStyles> {
  name?: string;
  type?: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  useHalfWith?: boolean;
  isOutlined?: boolean;
  isCancelButton?: boolean;
  isDeclinedButton?: boolean;
  isRemoveButton?: boolean;
  isBusy?: boolean;
  isDisabled?: boolean;
  cssExtras?: string;
  isWhiteButton?: boolean;
  isSecondary?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const buttonStyles = cva(
  "font-medium text-base text-center items-center py-3 px-8 border-0 transition-all rounded-lg",
  {
    variants: {
      variant: {
        primary: " bg-white outline-none text-[#5250C7] ",
      },
      fullWidth: {
        true: "w-full",
      },
      isOutlined: {
        true: "!border-2 !bg-transparent hover:bg-transparent",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
    compoundVariants: [
      {
        variant: "primary",
        isOutlined: true,
        class: "bg-transperent border-white border text-white",
      },
    ],
  }
);

export const Button = ({
  name,
  type,
  onClick,
  variant,
  fullWidth,
  isOutlined,
  isBusy,
  isDisabled,
  cssExtras,
  children,

  style,
  ...rest
}: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isBusy || isDisabled}
      {...rest}
      className={`${buttonStyles({
        variant,
        isOutlined,
        fullWidth,
      })} ${cssExtras}`}
      style={style ? style : {}}
    >
      <>
        {children ? (
          <>{children}</>
        ) : (
          <>
            {isBusy ? (
              <span
                className={`${
                  isOutlined ? "text-[#0275D8]" : "text-[#FEFFFE]"
                } inline-flex items-center font-bold`}
              >
                <Spin width="w-5" height="h-5" /> Processing...
              </span>
            ) : (
              name
            )}
          </>
        )}
      </>
    </button>
  );
};
