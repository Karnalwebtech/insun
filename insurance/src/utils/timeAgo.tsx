import React from "react";

interface TimerProps {
  time: string | number | Date; // Specify correct types
}

export const TimeAgo: React.FC<TimerProps> = ({ time }) => {
  const getTimeDifference = (timestamp: string | number | Date): string => {
    const now = new Date();
    const date = new Date(timestamp);

    const timeDifference = now.getTime() - date.getTime(); // Ensure correct date subtraction

    const seconds = Math.floor(timeDifference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return "Just now";
    } else if (hours < 1) {
      return `${minutes} minutes ago`;
    } else if (days < 1) {
      return `${hours} hours ago`;
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return `${days} days ago`;
    } else {
      return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    }
  };

  return <span>{getTimeDifference(time)}</span>;
};
