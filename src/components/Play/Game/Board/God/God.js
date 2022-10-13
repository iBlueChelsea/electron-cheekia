import React from "react";
import { useStore } from "../../../../../hooks/store";
import "./God.css";

const God = React.memo((props) => {
  const [state, dispatch] = useStore();
  const selectable = state.gods[props.id].selectable
    ? "god-selectable"
    : "god-not-selectable";

  const godHandler = () => {
    if (state.gods[props.id].selectable) {
      const payload = {
        event: "god",
        god: props.id,
        player: props.user,
        opponent: props.opponent,
      };
      if (state.currentAction === "event_occupant") {
        dispatch("PROCESS_EVENT_OCCUPANT", payload);
      } else if (state.currentAction === "gift_occupant") {
        dispatch("PROCESS_GIFT_OCCUPANT", payload);
      } else {
        dispatch("ATTACK_GOD", payload);
      }
    }
  };

  return (
    <g className={selectable} onClick={godHandler}>
      <circle cx={props.cx} cy={props.cy} r={props.r} />
      <text
        x={props.cx}
        y={props.cy}
        textAnchor="middle"
        stroke="#8B0000"
        strokeWidth="4px"
        fontSize="40px"
        dy=".3em"
      >
        {props.data.health}
      </text>
    </g>
  );
});

export default God;
