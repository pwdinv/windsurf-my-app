import ToolsMenu from "./components/ToolsMenu";
import ToolsNavigation from "./components/ToolsNavigation";

export default function Home() {
  return (
    <div className="flex min-h-screen bg-[#faf8f3] paper-texture">
      <ToolsMenu />
      <ToolsNavigation />

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 lg:pt-8">
        <div className="mx-auto max-w-3xl cozy-card coffee-ring p-4 sm:p-6 lg:p-8">
          <h1 className="mb-2 text-2xl sm:text-3xl font-semibold text-[#3d2914]">
            <span className="wobbly-underline">Welcome to Hack&apos;s Toolkit</span>
          </h1>
          <p className="mb-6 sm:mb-8 text-[#5c4a3a] handwritten text-base sm:text-lg">
            A cozy collection of useful tools for your creative workspace ✨
          </p>

          <div className="sticky-note p-6 transform -rotate-1">
            <h2 className="mb-4 text-lg font-semibold text-[#3d2914] flex items-center gap-2">
              <span className="text-2xl">🛠️</span> Available Tools
            </h2>
            <p className="text-[#5c4a3a]">
              Select a tool from the sidebar menu to get started. Each tool is designed with care for your daily tasks.
            </p>
          </div>

          {/* Decorative plant doodle area */}
          <div className="mt-8 flex justify-end">
            <div className="text-6xl opacity-30">🌿</div>
          </div>
        </div>
      </main>
    </div>
  );
}
