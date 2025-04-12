import { useForm } from "react-hook-form";
import { RegisterLink, Subtitle, Wrapper } from "../styled";
import background from "@/assets/login.png";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { authActions } from "@/store/auth";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FormValues {
  username: string;
  password: string;
}

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error, isLoading } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    mode: "onTouched",
  });

  const onSubmit = (data: FormValues) => {
    dispatch(authActions.loginRequest(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/game");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Wrapper background={background}>
      <Subtitle>Вход в мир</Subtitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Имя пользователя"
          type="text"
          {...register("username", { required: "Имя обязательно" })}
        />
        {errors.username && <ErrorText>{errors.username.message}</ErrorText>}

        <Input
          placeholder="Пароль"
          type="password"
          {...register("password", { required: "Пароль обязателен" })}
        />
        {errors.password && <ErrorText>{errors.password.message}</ErrorText>}

        {error && <ErrorText>{error}</ErrorText>}

        <Button variant="darkWood" type="submit" disabled={isLoading}>
          {isLoading ? "Вход..." : "Войти"}
        </Button>
      </Form>

      <RegisterLink to="/register">
        Нет аккаунта? Зарегистрироваться
      </RegisterLink>
    </Wrapper>
  );
};

export default LoginPage;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 300px;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 0.85rem;
`;
