import { useForm } from "react-hook-form";
import { RegisterLink, Subtitle, Wrapper } from "../styled";
import background from "@/assets/register.png";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { authActions } from "@/store/auth";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface FormValues {
  email: string;
  username: string;
  password: string;
}

const RegisterPage = () => {
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
    dispatch(authActions.registerRequest(data));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/game");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Wrapper background={background}>
      <Subtitle>Регистрация</Subtitle>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          placeholder="Email"
          type="email"
          {...register("email", { required: "Email обязателен" })}
        />
        {errors.email && <ErrorText>{errors.email.message}</ErrorText>}

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

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </Form>
      <RegisterLink to="/login">Уже есть аккаунт? Войдите</RegisterLink>
    </Wrapper>
  );
};

export default RegisterPage;

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
