import {
  Alert,
  AppShell,
  Badge,
  Button,
  Container,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import type { BackendConfig } from "./backend-config";

const workstreams = [
  {
    title: "Projects",
    description: "Confirm the first user workflow, required project fields and access rules.",
  },
  {
    title: "Catalogues",
    description: "Manage product definitions and supported price effects as versioned data.",
  },
  {
    title: "Pricing",
    description: "Approve worked examples before implementing the shared calculation engine.",
  },
];

function BackendStatus({ backend }: { backend: BackendConfig }) {
  if (backend.status === "invalid") {
    return (
      <Alert color="red" title="Backend configuration error" role="alert">
        {backend.message}
      </Alert>
    );
  }

  if (backend.status === "not-configured") {
    return (
      <Alert color="yellow" title="Convex is not configured">
        This foundation runs without a backend connection. No sign-in provider is connected, and no
        customer data or business prices are loaded.
      </Alert>
    );
  }

  return (
    <Alert color="blue" title="Convex deployment configured">
      A deployment URL is configured; this is not a connection-health check. Sign-in and business
      operations are not implemented yet.
    </Alert>
  );
}

export function App({ backend }: { backend: BackendConfig }) {
  const colorScheme = useComputedColorScheme("light");
  const { setColorScheme } = useMantineColorScheme();
  const nextColorScheme = colorScheme === "light" ? "dark" : "light";

  return (
    <AppShell header={{ height: 76 }} padding="md">
      <AppShell.Header>
        <Container size="lg" h="100%">
          <Group justify="space-between" h="100%" wrap="nowrap" gap="xs">
            <Group gap="sm" wrap="nowrap">
              <Text fw={800} size="xl" c="teal">
                MHST
              </Text>
              <Badge variant="light">Development</Badge>
            </Group>
            <Button
              variant="default"
              size="xs"
              onClick={() => setColorScheme(nextColorScheme)}
              aria-label={`Use ${nextColorScheme} theme`}
            >
              {colorScheme === "light" ? "Dark theme" : "Light theme"}
            </Button>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg" py={{ base: "xl", md: 64 }}>
          <Stack gap="xl">
            <Stack gap="sm" maw={720}>
              <Text tt="uppercase" size="sm" fw={700} c="teal">
                Rewrite foundation
              </Text>
              <Title order={1}>Projects and configurator</Title>
              <Text c="dimmed" size="lg">
                A new foundation for project configuration and explainable prices. Business features
                will follow validated examples, not assumptions from the legacy application.
              </Text>
            </Stack>

            <BackendStatus backend={backend} />

            <section aria-labelledby="next-slice-heading">
              <Stack gap="md">
                <Title id="next-slice-heading" order={2} size="h3">
                  Before the first business slice
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }}>
                  {workstreams.map((workstream) => (
                    <Paper key={workstream.title} withBorder p="lg">
                      <Stack gap="sm">
                        <Badge variant="outline" color="gray">
                          Not implemented
                        </Badge>
                        <Title order={3} size="h4">
                          {workstream.title}
                        </Title>
                        <Text size="sm" c="dimmed">
                          {workstream.description}
                        </Text>
                      </Stack>
                    </Paper>
                  ))}
                </SimpleGrid>
              </Stack>
            </section>

            <Text size="sm" c="dimmed">
              Technical scaffold only — not a quotation tool or an approved customer offer.
            </Text>
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
