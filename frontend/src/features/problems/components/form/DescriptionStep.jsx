import { Card, Grid, ScrollArea, Text, Textarea } from "@mantine/core";

const DescriptionStep = ({
  description,
  setDescription,
  parsedDescription,
}) => {
  return (
    <Grid mt="xl" gutter="md">
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card h="100%" p="md" withBorder radius="md">
          <Text fw={600} size="sm" c="blue" mb={5}>
            Markdown Editor
          </Text>

          <Textarea
            placeholder="Write problem details using Github flavored Markdown syntax..."
            minRows={12}
            maxRows={20}
            autosize
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{
              fontFamily: "var(--mantine-font-monospace)",
            }}
          />
        </Card>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6 }}>
        <Card
          h="100%"
          p="md"
          withBorder
          radius="md"
          style={{
            minHeight: 280,
          }}
        >
          <Text fw={600} size="sm" c="blue" mb="md">
            Live Preview
          </Text>

          <ScrollArea h={300}>
            <div
              className="markdown-body"
              style={{
                lineHeight: 1.6,
              }}
              dangerouslySetInnerHTML={parsedDescription}
            />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default DescriptionStep;
