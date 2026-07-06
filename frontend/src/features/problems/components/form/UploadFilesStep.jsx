import {
  ActionIcon,
  Alert,
  Card,
  Grid,
  Group,
  List,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import {
  IconAlertCircle,
  IconFile,
  IconUpload,
  IconX,
} from "@tabler/icons-react";

const UploadFilesStep = ({
  inputsFiles,
  outputsFiles,
  onDropInputs,
  onDropOutputs,
  onRemoveInputFile,
  onRemoveOutputFile,
}) => {
  return (
    <Stack gap="md" mt="xl">
      <Alert color="blue" icon={<IconAlertCircle size={16} />}>
        Please upload paired input/output testcase files. Files must be named
        strictly as <strong>input_1.txt / output_1.txt</strong>,{" "}
        <strong>input_2.txt / output_2.txt</strong> and so on.
      </Alert>

      <Grid gutter="xl">
        {/* Input Files */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card p="md" withBorder radius="md">
            <Text fw={600} size="sm" c="dimmed" mb="xs">
              Input Files (input_*.txt)
            </Text>

            <Dropzone
              onDrop={onDropInputs}
              maxFiles={20}
              accept={["text/plain"]}
              style={{
                border: "2px dashed var(--mantine-color-default-border)",
                padding: "1.5rem",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <Group justify="center" gap="sm">
                <IconUpload
                  size={24}
                  style={{
                    color: "var(--mantine-color-blue-filled)",
                  }}
                />

                <div>
                  <Text size="sm" inline>
                    Drag & drop or click to choose input files
                  </Text>

                  <Text size="xs" c="dimmed" inline mt={5}>
                    Supports up to 20 text files
                  </Text>
                </div>
              </Group>
            </Dropzone>

            {inputsFiles.length > 0 && (
              <List mt="md" spacing="xs" size="sm">
                {inputsFiles.map((file, index) => (
                  <List.Item
                    key={index}
                    icon={
                      <ThemeIcon color="blue" size={20} radius="xl">
                        <IconFile size={12} />
                      </ThemeIcon>
                    }
                  >
                    <Group
                      justify="between"
                      style={{
                        display: "inline-flex",
                        width: "calc(100% - 24px)",
                      }}
                    >
                      <Text size="xs" truncate>
                        {file.name}
                      </Text>

                      <ActionIcon
                        size="xs"
                        color="red"
                        variant="subtle"
                        onClick={() => onRemoveInputFile(index)}
                      >
                        <IconX size={12} />
                      </ActionIcon>
                    </Group>
                  </List.Item>
                ))}
              </List>
            )}
          </Card>
        </Grid.Col>{" "}
        {/* Output Files */}
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card p="md" withBorder radius="md">
            <Text fw={600} size="sm" c="dimmed" mb="xs">
              Output Files (output_*.txt)
            </Text>

            <Dropzone
              onDrop={onDropOutputs}
              maxFiles={20}
              accept={["text/plain"]}
              style={{
                border: "2px dashed var(--mantine-color-default-border)",
                padding: "1.5rem",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <Group justify="center" gap="sm">
                <IconUpload
                  size={24}
                  style={{
                    color: "var(--mantine-color-blue-filled)",
                  }}
                />

                <div>
                  <Text size="sm" inline>
                    Drag & drop or click to choose output files
                  </Text>

                  <Text size="xs" c="dimmed" inline mt={5}>
                    Supports up to 20 text files
                  </Text>
                </div>
              </Group>
            </Dropzone>

            {outputsFiles.length > 0 && (
              <List mt="md" spacing="xs" size="sm">
                {outputsFiles.map((file, index) => (
                  <List.Item
                    key={index}
                    icon={
                      <ThemeIcon color="blue" size={20} radius="xl">
                        <IconFile size={12} />
                      </ThemeIcon>
                    }
                  >
                    <Group
                      justify="between"
                      style={{
                        display: "inline-flex",
                        width: "calc(100% - 24px)",
                      }}
                    >
                      <Text size="xs" truncate>
                        {file.name}
                      </Text>

                      <ActionIcon
                        size="xs"
                        color="red"
                        variant="subtle"
                        onClick={() => onRemoveOutputFile(index)}
                      >
                        <IconX size={12} />
                      </ActionIcon>
                    </Group>
                  </List.Item>
                ))}
              </List>
            )}
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
};

export default UploadFilesStep;
