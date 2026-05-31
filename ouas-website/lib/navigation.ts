export type NavItem = {
  title: string;
  href: string;
};

export type NavGroup = {
  group: string;
  items: NavItem[];
};

export const DOCS_NAVIGATION: NavGroup[] = [
  {
    group: "Overview",
    items: [
      { title: "Introduction", href: "/docs/introduction" },
      { title: "Getting Started", href: "/docs/getting-started" },
    ],
  },
  {
    group: "Core Specification",
    items: [
      { title: "Manifest Spec", href: "/docs/manifest-spec" },
      { title: "Layout Config Spec", href: "/docs/layout-config-spec" },
      { title: "Validation Pipeline", href: "/docs/validation" },
      { title: "Agent API", href: "/docs/agent-api" },
      { title: "Agent Skills", href: "/docs/skills" },
    ],
  },
  {
    group: "Advanced & SDK",
    items: [
      { title: "React SDK Reference", href: "/docs/sdk-react" },
      { title: "Renderer Reference", href: "/docs/renderer" },
      { title: "Security", href: "/docs/security" },
      { title: "Versioning", href: "/docs/versioning" },
      { title: "Changelog", href: "/docs/changelog" },
    ],
  }
];
