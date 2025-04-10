import { useParams } from "react-router-dom";

const BattlePage = () => {
  const { id } = useParams();
  return <div>⚔️ Battle Page: {id}</div>;
};

export default BattlePage;
