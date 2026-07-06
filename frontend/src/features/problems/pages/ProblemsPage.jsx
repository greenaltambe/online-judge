import { useEffect, useState } from "react";
import { Container, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";

import { useProblemStore } from "../../../stores/problemStore";
import { useAuthStore } from "../../../stores/authStore";

import { useProblemFilters } from "../hooks/useProblemFilters";

import ProblemsHeader from "../components/problem-list/ProblemsHeader";
import ProblemFilters from "../components/problem-list/ProblemFilters";
import ProblemsTable from "../components/problem-list/ProblemsTable";
import DeleteProblemModal from "../components/problem-list/DeleteProblemModal";

const ProblemsPage = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const {
    problems,
    getProblems,
    deleteProblem,
    isLoading,
    isError,
    message,
    reset,
  } = useProblemStore();

  // Filters
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);

  // Fetch problems
  useEffect(() => {
    getProblems();

    return () => {
      reset();
    };
  }, [getProblems, reset]);

  // Error notifications
  useEffect(() => {
    if (!isError) return;

    notifications.show({
      title: "Operation Failed",
      message: message || "Please check backend connection.",
      color: "red",
    });

    reset();
  }, [isError, message, reset]);

  // Filtered problems
  const filteredProblems = useProblemFilters(
    problems,
    search,
    difficulty,
    sortBy,
  );

  // Delete button clicked
  const handleDeleteClick = (event, problem) => {
    event.preventDefault();
    event.stopPropagation();

    setProblemToDelete(problem);
    setDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!problemToDelete) return;

    const success = await deleteProblem(problemToDelete._id);

    if (success) {
      notifications.show({
        title: "Problem Removed",
        message: `"${problemToDelete.title}" has been deleted successfully.`,
        color: "blue",
      });
    }

    setDeleteModalOpen(false);
    setProblemToDelete(null);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <ProblemsHeader isAdmin={user?.role === "admin"} />

        <ProblemFilters
          search={search}
          setSearch={setSearch}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          sortBy={sortBy}
          setSortBy={setSortBy}
        />

        <ProblemsTable
          problems={filteredProblems}
          isLoading={isLoading}
          isAdmin={user?.role === "admin"}
          navigate={navigate}
          onDelete={handleDeleteClick}
        />
      </Stack>

      <DeleteProblemModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        problem={problemToDelete}
        onConfirm={confirmDelete}
      />
    </Container>
  );
};

export default ProblemsPage;
