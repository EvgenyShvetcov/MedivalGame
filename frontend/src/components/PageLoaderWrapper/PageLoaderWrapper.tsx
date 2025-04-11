import { FC, ReactNode } from "react";
import styled from "styled-components";
import Spinner from "../Spinner/Spinner";

interface Props {
  isLoading: boolean;
  error: string | null;
  children: ReactNode;
}

const PageLoaderWrapper: FC<Props> = ({ isLoading, error, children }) => {
  if (isLoading) return <Spinner />;
  if (error) return <ErrorText>{error}</ErrorText>;
  return <>{children}</>;
};

export default PageLoaderWrapper;

const ErrorText = styled.div`
  color: red;
  margin-top: 1rem;
  font-size: 0.9rem;
`;
