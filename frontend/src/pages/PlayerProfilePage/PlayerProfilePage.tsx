import { useParams } from "react-router-dom";

const PlayerProfilePage = () => {
  const { id } = useParams();
  return <div>🧙 Player Profile: {id}</div>;
};

export default PlayerProfilePage;
