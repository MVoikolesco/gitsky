import { Stack, Text, Title } from "@mantine/core";

export const indexRouteOptions = {
  path: "/",
  component: IndexRoute,
};

function IndexRoute() {
  return (
    <Stack align="center" gap="xs">
      <Title order={1}>Hello World</Title>
      <Text c="dimmed" size="lg">
        Multi-Git Skyline base is running
      </Text>
    </Stack>
  );
}
