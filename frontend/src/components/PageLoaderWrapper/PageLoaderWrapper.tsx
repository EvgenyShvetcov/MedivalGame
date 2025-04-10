import { FC, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  isLoading: boolean;
  error: string | null;
  children: ReactNode;
}

const PageLoaderWrapper: FC<Props> = ({ isLoading, error, children }) => {
  if (isLoading) return <Status>Загрузка...</Status>;
  if (error) return <ErrorText>{error}</ErrorText>;
  return <>{children}</>;
};

export default PageLoaderWrapper;

const Status = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: #ccc;
`;

const ErrorText = styled.div`
  color: red;
  margin-top: 1rem;
  font-size: 0.9rem;
`;
