import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
      extra={
        <Button type="primary" onClick={() => navigate(-1)}>
          Quay lại trang trước
        </Button>
      }
    />

  );
};

export default ErrorPage;
