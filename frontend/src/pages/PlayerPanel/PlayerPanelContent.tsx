import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Title, AttributeList, ExperienceBar } from "./styled";
import AttributeRow from "./AttributeRow";

const PlayerPanelContent: FC = () => {
  const player = useSelector((state: RootState) => state.player.data);

  if (!player) return null;

  const experienceProgress = (player.experience / (player.level * 100)) * 100;

  return (
    <>
      <Title>{player.username}</Title>

      <ExperienceBar>
        <div style={{ width: `${experienceProgress}%` }} />
        <span>
          {player.experience} / {player.level * 100} XP
        </span>
      </ExperienceBar>

      <AttributeList>
        <AttributeRow name="Сила" value={player.strength} field="strength" />
        <AttributeRow name="Ловкость" value={player.agility} field="agility" />
        <AttributeRow name="Защита" value={player.defense} field="defense" />
        <AttributeRow
          name="Атака пехоты"
          value={player.infantryAttack}
          field="infantryAttack"
        />
        <AttributeRow
          name="Защита пехоты"
          value={player.infantryDefense}
          field="infantryDefense"
        />
        <AttributeRow
          name="Атака лучников"
          value={player.archerAttack}
          field="archerAttack"
        />
        <AttributeRow
          name="Защита лучников"
          value={player.archerDefense}
          field="archerDefense"
        />
        <AttributeRow
          name="Атака кавалерии"
          value={player.cavalryAttack}
          field="cavalryAttack"
        />
        <AttributeRow
          name="Защита кавалерии"
          value={player.cavalryDefense}
          field="cavalryDefense"
        />
      </AttributeList>

      {player.attributePoints > 0 && (
        <p>Свободных очков: {player.attributePoints}</p>
      )}
    </>
  );
};

export default PlayerPanelContent;
