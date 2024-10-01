import React from "react";
import { Button as AntdButton } from "antd";
import { ButtonProps as AntdButtonProps } from "antd";
import './style.scss'
interface ButtonProps extends AntdButtonProps {
  label?: string
  className?: string
}

export const CommonButton: React.FC<ButtonProps> = ({label, className = '', children, ...props }) => {
  return <AntdButton {...props} className={`common-button ${className}`}>{label || children}</AntdButton>;
};
