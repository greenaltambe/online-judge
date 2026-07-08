import { useEffect, useState } from "react";
import { Container, Stack, Pagination, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useNavigate } from "react-router-dom";
import { useDebouncedValue } from "@mantine/hooks";

import { useProblemStore } from "../../../stores/problemStore";
import { useAuthStore } from "../../../stores/authStore";

import ProblemsHeader from "../components/problem-list/ProblemsHeader";
import ProblemFilters from "../components/problem-list/ProblemFilters";
import ProblemsTable from "../components/problem-list/ProblemsTable";
import DeleteProblemModal from "../components/problem-list/DeleteProblemModal";
import AddProblemToListModal from "../../userlist/components/AddProblemToListModal";

const ProblemsPage = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);

  const {
    problems,
    totalPages,
    totalProblems,
    getProblems,
    deleteProblem,
    isLoading,
    isError,
    message,
    reset,
  } = useProblemStore();

  // Filters & Pagination State
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [tags, setTags] = useState([]);
  const [page, setPage] = useState(1);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [problemToDelete, setProblemToDelete] = useState(null);

  // Add to list modal
  const [addToListModalOpen, setAddToListModalOpen] = useState(false);
  const [problemForList, setProblemForList] = useState(null);

  // Fetch problems based on current pagination & filters
  useEffect(() => {
    getProblems({
      page,
      limit: 10,
      search: debouncedSearch,
      difficulty,
      tags: tags.join(","),
      sortBy,
    });
  }, [page, debouncedSearch, difficulty, tags, sortBy, getProblems]);

  // Clean up store on unmount
  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, difficulty, tags, sortBy]);

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

  // Delete button clicked
  const handleDeleteClick = (event, problem) => {
    event.preventDefault();
    event.stopPropagation();

    setProblemToDelete(problem);
    setDeleteModalOpen(true);
  };

  // Add to list button clicked
  const handleAddToListClick = (event, problem) => {
    event.preventDefault();
    event.stopPropagation();
    setProblemForList(problem);
    setAddToListModalOpen(true);
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
      // Refetch page
      getProblems({
        page,
        limit: 10,
        search: debouncedSearch,
        difficulty,
        tags: tags.join(","),
        sortBy,
      });
    }

    setDeleteModalOpen(false);
    setProblemToDelete(null);
  };

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <ProblemsHeader isAdmin={user?.role === "admin"} totalProblems={totalProblems} />

        <ProblemFilters
          search={search}
          setSearch={setSearch}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          sortBy={sortBy}
          setSortBy={setSortBy}
          tags={tags}
          setTags={setTags}
        />

        <ProblemsTable
          problems={problems}
          isLoading={isLoading}
          isAdmin={user?.role === "admin"}
          navigate={navigate}
          onDelete={handleDeleteClick}
          onAddToList={handleAddToListClick}
        />

        {totalPages > 1 && (
          <Group justify="center" mt="md">
            <Pagination
              value={page}
              onChange={setPage}
              total={totalPages}
              color="blue"
              radius="md"
              withEdges
            />
          </Group>
        )}
      </Stack>

      <DeleteProblemModal
        opened={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        problem={problemToDelete}
        onConfirm={confirmDelete}
      />

      <AddProblemToListModal
        opened={addToListModalOpen}
        onClose={() => {
          setAddToListModalOpen(false);
          setProblemForList(null);
        }}
        problem={problemForList}
      />
    </Container>
  );
};

export default ProblemsPage;
