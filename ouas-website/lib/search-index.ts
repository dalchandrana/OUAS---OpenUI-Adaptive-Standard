export interface SearchIndexItem {
  title: string;
  href: string;
  content: string;
}

export const searchIndex: SearchIndexItem[] = [
  {
    title: "Introduction",
    href: "/docs/introduction",
    content: "The OpenUI Adaptive Standard (OUAS) is an open-source protocol and toolkit designed to bridge the gap between Large Language Models (LLMs) and User Interfaces. Instead of AI generating raw code, OUAS uses JSON manifests and configs to dynamically render adaptable UIs."
  },
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    content: "The quickest way to get started with OUAS is to add it to an existing React or Next.js application. Our core SDK is built to be a zero-dependency, lightweight drop-in. Install dependencies using npm install @ouas/react @ouas/renderer, annotate components with withOUAS, generate a manifest, and mount the renderer."
  },
  {
    title: "Component Manifest Spec",
    href: "/docs/manifest-spec",
    content: "The Component Manifest is the central source of truth in the OUAS architecture. It acts as an API Reference for the AI Agent, detailing exactly which UI components exist in the host application, what properties they accept, and what constraints they have. Key fields include ouas_version, app_id, and components array with schemas."
  },
  {
    title: "Layout Config Spec",
    href: "/docs/layout-config-spec",
    content: "The Layout Configuration (or Layout Config) defines what is actually happening on the screen. It is a strict JSON payload submitted by the AI agent to deterministically mutate the user interface. It includes the action (UPDATE_LAYOUT, APPEND_LAYOUT, RESET), target_id, and payload tree of components and props."
  },
  {
    title: "Validation Pipeline",
    href: "/docs/validation",
    content: "The OUAS Validation Pipeline acts as an impenetrable firewall, strictly parsing every incoming Layout Config against the Component Manifest. It guarantees AI agents can never break your application by checking component reference validation, prop type and schema validation, and slot hierarchy constraints."
  },
  {
    title: "Agent API",
    href: "/docs/agent-api",
    content: "The Agent API is how your AI interfaces with the OUAS system to request manifests, submit layouts, and receive validation feedback. Available endpoints include GET /ouas/manifest to fetch the component manifest and POST /ouas/transform to submit a layout configuration payload."
  },
  {
    title: "React SDK Reference",
    href: "/docs/sdk-react",
    content: "The @ouas/react SDK provides the core bindings to expose React components to the AI Agent. It features the withOUAS higher-order component to register components into the global registry, defining the explicit JSON schema the AI uses."
  },
  {
    title: "Renderer Reference",
    href: "/docs/renderer",
    content: "The @ouas/renderer package acts as the bridge between the AI Agent's JSON output and the React DOM. It recursively renders the UI tree dynamically. It includes strict React Error Boundaries to catch AI hallucinations or invalid props without crashing the host app, displaying a fallback UI instead."
  },
  {
    title: "Security Architecture",
    href: "/docs/security",
    content: "OUAS solves security by never allowing the AI to generate code. It prevents Cross-Site Scripting (XSS) and script injections. The AI cannot invent new components; the Component Firewall drops unregistered components. Prop schema enforcement rejects prompt injections before they reach the React tree."
  },
  {
    title: "Versioning",
    href: "/docs/versioning",
    content: "Strategies for safely updating your Component Manifest without breaking AI Agent integrations. Changing required props is a breaking change. Increment the ouas_version flag. Maintain backward compatibility by keeping deprecated props in the schema for older AI models to function seamlessly."
  },
  {
    title: "Changelog",
    href: "/docs/changelog",
    content: "View the release history of the OpenUI Adaptive Standard. Updates include v1.0.0 initial release featuring @ouas/react, @ouas/renderer, and the CLI tool for AST-parsing codebases to generate deterministic manifests."
  }
];
