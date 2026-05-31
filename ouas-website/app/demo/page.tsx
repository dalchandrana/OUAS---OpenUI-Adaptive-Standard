"use client";

import * as React from "react";
import { MegaMenuNavBar } from "@/components/ui/MegaMenuNavBar";
import { GridBackground } from "@/components/ui/GridBackground";
import { Button } from "@/components/ui/Button";
import {
  Send,
  LayoutTemplate,
  Activity,
  FileJson,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  Calendar as CalendarIcon,
} from "lucide-react";

type LayoutType = "default" | "compact" | "tasks" | "calendar";
type Message = { role: "agent" | "user"; content: string };

const initialEmails = [
  {
    id: 1,
    from: "Alex Chen",
    subject: "Project Update for Q3",
    preview:
      "Here are the latest metrics for our ongoing adaptive UI integration…",
    time: "10:42 AM",
    unread: true,
  },
  {
    id: 2,
    from: "Sarah Kim",
    subject: "Design Review Notes",
    preview:
      "The new component library looks fantastic. A few minor suggestions…",
    time: "9:18 AM",
    unread: true,
  },
  {
    id: 3,
    from: "DevOps Bot",
    subject: "Build #4291 Passed ✓",
    preview: "All 847 tests passed. Coverage: 94.2%. Deployed to staging.",
    time: "8:55 AM",
    unread: false,
  },
  {
    id: 4,
    from: "Jordan Lee",
    subject: "Sprint Planning Invite",
    preview: "Setting up next week's sprint. Please review the backlog items…",
    time: "Yesterday",
    unread: false,
  },
  {
    id: 5,
    from: "OUAS Team",
    subject: "Spec v1.0 Released 🎉",
    preview: "The first stable release of the OpenUI Adaptive Standard is here!",
    time: "Yesterday",
    unread: false,
  },
];

export default function DemoPage() {
  const [transformStatus, setTransformStatus] = React.useState<
    "idle" | "loading" | "success"
  >("idle");
  const [viewState, setViewState] = React.useState<"ui" | "manifest" | "config">(
    "ui"
  );
  const [currentLayout, setCurrentLayout] = React.useState<LayoutType>("default");

  const [chatMessages, setChatMessages] = React.useState<Message[]>([
    { role: "agent", content: "How would you like to view your emails today?" },
  ]);
  const [inputText, setInputText] = React.useState("");
  const chatScrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleTransform = (prompt: string) => {
    if (!prompt.trim()) return;

    // Add user message
    setChatMessages((prev) => [...prev, { role: "user", content: prompt }]);
    setInputText("");
    setTransformStatus("loading");
    setViewState("ui");

    setTimeout(() => {
      let targetLayout: LayoutType = "default";
      let agentReply = "I've reset your view to the default list.";

      const p = prompt.toLowerCase();
      if (p.includes("compact")) {
        targetLayout = "compact";
        agentReply =
          "I've transformed your inbox into a compact view to show more emails at once.";
      } else if (p.includes("task") || p.includes("todo") || p.includes("done")) {
        targetLayout = "tasks";
        agentReply =
          "I've turned your emails into a task list so you can mark them as done.";
      } else if (p.includes("calendar") || p.includes("schedule")) {
        targetLayout = "calendar";
        agentReply =
          "I've arranged your emails in a calendar timeline based on their arrival time.";
      } else {
        agentReply =
          "I couldn't identify a specific layout from your prompt, so I applied the default list view.";
      }

      setCurrentLayout(targetLayout);
      setChatMessages((prev) => [
        ...prev,
        { role: "agent", content: agentReply },
      ]);
      setTransformStatus("success");
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTransform(inputText);
    }
  };

  const getConfigForLayout = (layout: LayoutType) => {
    const configs = {
      default: {
        layout_id: "default-list-view",
        components: [
          {
            id: "email-row",
            props: { variant: "standard", showAvatars: false, padding: "normal" },
          },
        ],
        validated: true,
        applied_at: new Date().toISOString(),
      },
      compact: {
        layout_id: "compact-list-view",
        components: [
          {
            id: "email-row",
            props: { variant: "compact", showAvatars: false, padding: "tight" },
          },
        ],
        validated: true,
        applied_at: new Date().toISOString(),
      },
      tasks: {
        layout_id: "task-list-view",
        components: [
          {
            id: "email-task-item",
            props: {
              variant: "actionable",
              showCheckbox: true,
              strikethroughRead: true,
            },
          },
        ],
        validated: true,
        applied_at: new Date().toISOString(),
      },
      calendar: {
        layout_id: "calendar-grid-view",
        components: [
          {
            id: "calendar-grid",
            props: { variant: "timeline", showTimeSlots: true, groupBy: "date" },
          },
        ],
        validated: true,
        applied_at: new Date().toISOString(),
      },
    };
    return configs[layout];
  };

  return (
    <div className="flex min-h-screen flex-col bg-bg-base text-text-primary">
      <MegaMenuNavBar />

      <main className="flex-1 flex flex-col">
        {/* ── Hero Strip ────────────────────────────── */}
        <GridBackground className="py-12 md:py-16" fadeMask={false}>
          <section className="container mx-auto px-4 md:px-6 text-center">
            <p className="text-xs font-semibold text-accent-primary uppercase tracking-[0.2em] mb-3">
              Interactive Demo
            </p>
            <h1 className="font-display text-3xl font-bold md:text-4xl lg:text-5xl !leading-tight">
              MailFlow — Adaptive UI in action
            </h1>
            <p className="mt-3 text-text-secondary max-w-lg mx-auto">
              Watch a live AI agent reshape an email client&apos;s interface in
              real-time using the OUAS protocol.
            </p>
          </section>
        </GridBackground>

        {/* ── Browser Mockup Container ──────────────── */}
        <section className="container mx-auto px-4 md:px-6 -mt-4 pb-20 flex-1 flex flex-col">
          <div className="rounded-xl border border-border-color bg-surface overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/30 flex-1 flex flex-col">
            {/* Title bar */}
            <div className="flex items-center gap-3 border-b border-border-color px-4 py-2.5 bg-bg-elevated/60">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 rounded-md bg-bg-base border border-border-color px-3 py-1 text-xs text-text-tertiary max-w-xs w-full">
                  <svg
                    className="h-3 w-3 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" />
                  </svg>
                  <span className="truncate">mailflow.ouas.dev</span>
                </div>
              </div>
              <div className="w-[52px]" />
            </div>

            {/* Content area */}
            <div className="grid grid-cols-1 lg:grid-cols-4 flex-1 min-h-[600px]">
              {/* Agent Chat Panel */}
              <div className="lg:col-span-1 border-r border-border-color bg-bg-base flex flex-col h-[500px] lg:h-auto">
                <div className="p-4 border-b border-border-color flex items-center gap-2">
                  <Activity className="h-4 w-4 text-accent-primary" />
                  <span className="font-display font-semibold text-sm">
                    Design Agent
                  </span>
                  <span className="ml-auto flex h-2 w-2 rounded-full bg-[#27c93f]" />
                </div>

                <div
                  ref={chatScrollRef}
                  className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 text-sm"
                >
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg max-w-[90%] ${
                        msg.role === "agent"
                          ? "bg-surface rounded-tl-none self-start text-text-secondary border border-border-color/50"
                          : "bg-accent-primary/10 rounded-tr-none self-end text-text-primary border border-accent-primary/20"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}

                  {transformStatus === "loading" && (
                    <div className="bg-surface p-3 rounded-lg rounded-tl-none self-start flex items-center gap-2 border border-border-color/50">
                      <span className="flex gap-1 py-1 px-1">
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="h-1.5 w-1.5 rounded-full bg-text-tertiary animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </span>
                    </div>
                  )}

                  {chatMessages.length === 1 && (
                    <div className="flex flex-col gap-2 mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <p className="text-[10px] font-semibold uppercase text-text-tertiary tracking-wider">
                        Try Presets
                      </p>
                      <button
                        onClick={() => handleTransform("Make this a task list")}
                        className="text-left text-xs bg-surface border border-border-color p-2.5 rounded-lg hover:border-accent-primary transition-colors group flex items-center justify-between"
                      >
                        Make this a task list
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => handleTransform("Show as calendar")}
                        className="text-left text-xs bg-surface border border-border-color p-2.5 rounded-lg hover:border-accent-primary transition-colors group flex items-center justify-between"
                      >
                        Show as calendar
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                      <button
                        onClick={() => handleTransform("Compact view")}
                        className="text-left text-xs bg-surface border border-border-color p-2.5 rounded-lg hover:border-accent-primary transition-colors group flex items-center justify-between"
                      >
                        Compact view
                        <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-border-color bg-surface/50">
                  <div className="relative">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask agent to change layout..."
                      className="w-full bg-bg-base border border-border-color rounded-full pl-4 pr-10 py-2 text-sm outline-none focus:border-accent-primary transition-colors disabled:opacity-50"
                      disabled={transformStatus === "loading"}
                    />
                    <button
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-accent-primary text-white rounded-full hover:bg-accent-primary/90 transition-colors disabled:opacity-50"
                      onClick={() => handleTransform(inputText)}
                      disabled={transformStatus === "loading" || !inputText.trim()}
                    >
                      <Send className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Inbox Area */}
              <div className="lg:col-span-3 flex flex-col bg-bg-base relative overflow-hidden">
                {/* Transform Status Bar */}
                <div
                  className={`px-4 py-2.5 text-sm border-b flex items-center justify-between transition-colors ${
                    transformStatus === "idle"
                      ? "border-border-color text-text-secondary"
                      : transformStatus === "loading"
                        ? "border-warning/30 text-warning bg-warning/5"
                        : "border-success/30 text-success bg-success/5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {transformStatus === "loading" && (
                      <span className="flex h-2 w-2 rounded-full bg-warning animate-ping" />
                    )}
                    {transformStatus === "success" && (
                      <span className="flex h-2 w-2 rounded-full bg-success" />
                    )}
                    <span className="text-xs">
                      {transformStatus === "idle"
                        ? "Agent ready — waiting for instructions"
                        : transformStatus === "loading"
                          ? "Agent is transforming the UI layout…"
                          : "Transformation successful. Manifest verified ✓"}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {(
                      [
                        { key: "ui", icon: LayoutTemplate, label: "UI" },
                        { key: "config", icon: FileJson, label: "Config" },
                        { key: "manifest", icon: FileJson, label: "Manifest" },
                      ] as const
                    ).map(({ key, icon: Icon, label }) => (
                      <button
                        key={key}
                        onClick={() => setViewState(key)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                          viewState === key
                            ? "bg-surface text-text-primary"
                            : "text-text-tertiary hover:text-text-secondary"
                        }`}
                      >
                        <Icon className="h-3 w-3 inline mr-1" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Render Area */}
                <div className="flex-1 relative min-h-[450px] overflow-y-auto">
                  {transformStatus === "loading" && (
                    <div className="absolute inset-0 bg-bg-base/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
                      <div className="animate-spin h-8 w-8 border-2 border-accent-primary border-t-transparent rounded-full" />
                    </div>
                  )}

                  {viewState === "ui" && (
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-display text-xl font-bold">
                          {currentLayout === "tasks"
                            ? "Action Items"
                            : currentLayout === "calendar"
                              ? "Schedule"
                              : "Inbox"}
                        </h2>
                        <Button variant="ghost" size="sm">
                          {currentLayout === "tasks"
                            ? "Clear completed"
                            : "Mark all read"}
                        </Button>
                      </div>

                      {/* Default Layout */}
                      {currentLayout === "default" && (
                        <div className="space-y-2">
                          {initialEmails.map((email) => (
                            <div
                              key={email.id}
                              className={`p-4 border border-border-color rounded-lg transition-colors cursor-pointer flex justify-between items-start hover:border-border-bright ${
                                email.unread ? "bg-surface" : "bg-bg-base"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  {email.unread && (
                                    <span className="h-2 w-2 rounded-full bg-accent-primary shrink-0" />
                                  )}
                                  <p
                                    className={`text-sm truncate ${
                                      email.unread
                                        ? "font-semibold"
                                        : "font-medium text-text-secondary"
                                    }`}
                                  >
                                    {email.from}
                                  </p>
                                </div>
                                <p className="text-sm font-medium mt-1 truncate">
                                  {email.subject}
                                </p>
                                <p className="text-xs text-text-tertiary mt-1 truncate">
                                  {email.preview}
                                </p>
                              </div>
                              <span className="text-[11px] text-text-tertiary shrink-0 ml-4">
                                {email.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Compact Layout */}
                      {currentLayout === "compact" && (
                        <div className="border border-border-color rounded-lg overflow-hidden">
                          {initialEmails.map((email, i) => (
                            <div
                              key={email.id}
                              className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-surface/50 transition-colors ${
                                i !== 0 ? "border-t border-border-color/50" : ""
                              } ${
                                email.unread ? "bg-surface/30" : "bg-bg-base"
                              }`}
                            >
                              <div className="w-4 shrink-0 flex justify-center">
                                {email.unread ? (
                                  <span className="h-1.5 w-1.5 rounded-full bg-accent-primary" />
                                ) : null}
                              </div>
                              <p
                                className={`text-sm w-32 shrink-0 truncate ${
                                  email.unread
                                    ? "font-semibold text-text-primary"
                                    : "text-text-secondary"
                                }`}
                              >
                                {email.from}
                              </p>
                              <p
                                className={`text-sm flex-1 truncate ${
                                  email.unread
                                    ? "font-medium"
                                    : "text-text-secondary"
                                }`}
                              >
                                {email.subject}
                              </p>
                              <span className="text-xs text-text-tertiary shrink-0 ml-4 w-16 text-right">
                                {email.time}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tasks Layout */}
                      {currentLayout === "tasks" && (
                        <div className="space-y-3">
                          {initialEmails.map((email) => (
                            <div
                              key={email.id}
                              className={`p-3 border border-border-color rounded-lg transition-all flex items-center gap-4 group hover:border-accent-primary/50 ${
                                !email.unread
                                  ? "opacity-60 bg-bg-base"
                                  : "bg-surface"
                              }`}
                            >
                              <button className="shrink-0 text-text-tertiary hover:text-accent-primary transition-colors">
                                {!email.unread ? (
                                  <CheckCircle2 className="h-5 w-5 text-success" />
                                ) : (
                                  <Circle className="h-5 w-5" />
                                )}
                              </button>
                              <div className="min-w-0 flex-1">
                                <p
                                  className={`text-sm font-medium truncate ${
                                    !email.unread
                                      ? "line-through text-text-secondary"
                                      : ""
                                  }`}
                                >
                                  {email.subject}
                                </p>
                                <p className="text-xs text-text-tertiary mt-0.5 truncate flex items-center gap-1.5">
                                  <span className="font-medium text-text-secondary">
                                    {email.from}
                                  </span>
                                  <span className="w-1 h-1 rounded-full bg-border-color" />
                                  <span>{email.preview}</span>
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Calendar Layout */}
                      {currentLayout === "calendar" && (
                        <div className="grid grid-cols-1 gap-6 pt-2">
                          {[
                            ...new Set(
                              initialEmails.map((e) =>
                                e.time === "Yesterday" ? "Yesterday" : "Today"
                              )
                            ),
                          ].map((dateGroup) => (
                            <div key={dateGroup}>
                              <h3 className="text-xs font-semibold uppercase tracking-wider text-text-tertiary mb-4 flex items-center gap-2">
                                <CalendarIcon className="h-3.5 w-3.5" />
                                {dateGroup}
                              </h3>
                              <div className="relative border-l border-border-color ml-2.5 space-y-6 pb-4">
                                {initialEmails
                                  .filter(
                                    (e) =>
                                      (e.time === "Yesterday"
                                        ? "Yesterday"
                                        : "Today") === dateGroup
                                  )
                                  .map((email) => (
                                    <div key={email.id} className="relative pl-6">
                                      <div className="absolute -left-[4px] top-1.5 h-2 w-2 rounded-full bg-accent-primary border-2 border-bg-base" />
                                      <div className="bg-surface border border-border-color rounded-lg p-3 hover:border-border-bright transition-colors cursor-pointer group">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Clock className="h-3 w-3 text-text-tertiary" />
                                          <span className="text-[11px] font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                                            {email.time !== "Yesterday"
                                              ? email.time
                                              : "12:00 PM"}
                                          </span>
                                        </div>
                                        <p className="text-sm font-medium">
                                          {email.subject}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2.5">
                                          <div className="h-5 w-5 rounded-full bg-accent-primary/20 flex items-center justify-center text-[9px] font-bold text-accent-primary">
                                            {email.from.charAt(0)}
                                          </div>
                                          <span className="text-xs text-text-secondary">
                                            {email.from}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {viewState === "config" && (
                    <div className="p-5 h-full bg-[#1c2128]">
                      <pre className="text-xs text-[#adbac7] font-mono leading-relaxed">
                        {JSON.stringify(getConfigForLayout(currentLayout), null, 2)}
                      </pre>
                    </div>
                  )}

                  {viewState === "manifest" && (
                    <div className="p-5 h-full bg-[#1c2128]">
                      <pre className="text-xs text-[#adbac7] font-mono leading-relaxed">
                        {`{
  "ouas_version": "1.0",
  "app_id": "mailflow-demo",
  "components": [
    {
      "id": "email-row",
      "description": "Displays a single email thread",
      "schema": {
        "variant": {
          "type": "string",
          "enum": ["default", "compact", "detailed", "actionable", "calendar-item"]
        },
        "showAvatars": { "type": "boolean" },
        "groupBy": {
          "type": "string",
          "enum": ["none", "priority", "sender", "date"]
        }
      }
    }
  ]
}`}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
