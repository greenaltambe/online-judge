import { useMemo } from "react";

const difficultyWeight = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export const useProblemFilters = (problems, search, difficulty, sortBy) => {
  return useMemo(() => {
    const filtered = problems.filter((problem) => {
      const matchesSearch = problem.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesDifficulty =
        difficulty === "all" ||
        problem.difficulty.toLowerCase() === difficulty.toLowerCase();

      return matchesSearch && matchesDifficulty;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);

        case "difficulty":
          return (
            difficultyWeight[a.difficulty.toLowerCase()] -
            difficultyWeight[b.difficulty.toLowerCase()]
          );

        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  }, [problems, search, difficulty, sortBy]);
};
