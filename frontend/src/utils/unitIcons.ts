// src/utils/unitIcons.ts
export const getUnitIcon = (type: string) => {
  switch (type) {
    case "INFANTRY":
      return "🗡️";
    case "ARCHER":
      return "🏹";
    case "CAVALRY":
      return "🐴";
    default:
      return "❓";
  }
};
