import ToolsMenu from "./components/ToolsMenu";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ToolsMenu />

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-2 text-3xl font-semibold text-gray-900">
            Welcome to Hack&apos;s Tools
          </h1>
          <p className="mb-8 text-gray-600">
            A collection of useful tools for productivity and AI-powered tasks.
          </p>

          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-gray-900">Available Tools</h2>
            <p className="text-gray-600">
              Select a tool from the sidebar menu to get started. New tools will be added here automatically.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
