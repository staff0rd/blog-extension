import seq from "seq-logging";

export const logger = new seq.Logger({
  serverUrl: "http://localhost:5341",
  onError: (error) => {
    console.error("Error from seq", error);
  },
});

export const log = (
  message: string,
  properties?: Parameters<typeof logger.emit>[0]["properties"]
) =>
  logger.emit({
    timestamp: new Date(),
    level: "Information",
    messageTemplate: message,
    properties,
  });
