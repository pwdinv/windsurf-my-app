import Link from "next/link";
import { tools } from "../lib/tools";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            Hack&apos;s Tools
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            A collection of useful tools
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group rounded-xl border border-zinc-200 bg-white p-6 transition-all hover:border-indigo-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-700"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{tool.icon}</span>
                <div className="flex-1">
                  <h2 className="font-semibold text-zinc-900 group-hover:text-indigo-600 dark:text-zinc-100 dark:group-hover:text-indigo-400">
                    {tool.name}
                  </h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {tools.length === 1 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-zinc-500 dark:text-zinc-500">
              More tools coming soon...
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
