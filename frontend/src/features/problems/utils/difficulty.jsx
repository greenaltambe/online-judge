import { Badge } from "@mantine/core";

export const getDifficultyBadge = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return (
        <Badge color="teal" variant="light">
          Easy
        </Badge>
      );

    case "medium":
      return (
        <Badge color="orange" variant="light">
          Medium
        </Badge>
      );

    case "hard":
      return (
        <Badge color="red" variant="light">
          Hard
        </Badge>
      );

    default:
      return (
        <Badge color="gray" variant="light">
          Unknown
        </Badge>
      );
  }
};

export const getDifficultyColor = (diff) => {
  const d = diff?.toLowerCase();
  if (d === "easy") return "teal";
  if (d === "medium") return "orange";
  return "red";
};
