import { FC } from "react";
import styled from "styled-components";
import { IBattleLog } from "@/store/battle/types";

const LogWrapper = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(20, 20, 20, 0.6);
  border-radius: 8px;
  color: #eee;
  font-family: "MedievalSharp", serif;
`;

const RoundBlock = styled.div`
  margin-bottom: 1rem;
  border-bottom: 1px solid #555;
  padding-bottom: 1rem;
`;

const Highlight = styled.span<{ type: "crit" | "dodge" | "normal" }>`
  color: ${({ type }) =>
    type === "crit" ? "#ff4444" : type === "dodge" ? "#8888ff" : "#eee"};
  font-weight: bold;
`;

interface Props {
  logs: IBattleLog[];
}

const BattleLog: FC<Props> = ({ logs }) => {
  if (!logs?.length) return null;

  return (
    <LogWrapper>
      <h4>📝 Ходы:</h4>
      {logs.map((log) => (
        <RoundBlock key={log.id}>
          <p>
            <strong>Раунд {log.turnNumber}</strong>
          </p>

          {log.defenderDodged ? (
            <p>
              {log.attacker.username} атаковал {log.defender.username}, но тот{" "}
              <Highlight type="dodge">увернулся</Highlight>!
            </p>
          ) : (
            <p>
              {log.attacker.username} атаковал {log.defender.username} на{" "}
              <Highlight type={log.attackerCrit ? "crit" : "normal"}>
                {log.damageDealtToDefender}
              </Highlight>{" "}
              урона {log.attackerCrit && <em>(Крит!)</em>}
            </p>
          )}

          {log.attackerDodged ? (
            <p>
              Ответная атака {log.defender.username} — промах,{" "}
              <Highlight type="dodge">
                {log.attacker.username} увернулся
              </Highlight>
              !
            </p>
          ) : (
            <p>
              Ответная атака {log.defender.username} —{" "}
              <Highlight type={log.defenderCrit ? "crit" : "normal"}>
                {log.damageDealtToAttacker}
              </Highlight>{" "}
              урона {log.defenderCrit && <em>(Крит!)</em>}
            </p>
          )}
        </RoundBlock>
      ))}
    </LogWrapper>
  );
};

export default BattleLog;
