import React from "react";

const RegisterForm = React.lazy(() => import("./RegisterForm/RegisterForm"));
const LoginForm = React.lazy(() => import("./LoginForm/LoginForm"));

export { RegisterForm, LoginForm };
