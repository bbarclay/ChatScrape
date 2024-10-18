import { removeUnnecessaryInfo } from "./removeUnnecessaryInfo";

export const determineMessageType = (message: string): string => {
  const cleanMessage = removeUnnecessaryInfo(message);
  const lowerMsg = cleanMessage.toLowerCase();
  if (lowerMsg.includes("error")) return "error";
  if (lowerMsg.includes("warning")) return "warning";
  if (lowerMsg.includes("success") || lowerMsg.includes("completed") || lowerMsg.includes("finished")) return "success";
  return "info";
};
