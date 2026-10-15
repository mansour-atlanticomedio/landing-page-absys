import { Download } from "lucide-react"
import { appPath } from "@/lib/auth/redirects"

const withBasePath = (url: string) =>
  url.startsWith("/") && !url.startsWith(appPath("/")) ? appPath(url) : url

export function DownloadSection({ block }: { block: any }) {
  const url: string = block?.file?.url ? withBasePath(block.file.url) : ""
  if (!url || !block?.button_label) return null
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <div className="flex justify-center">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-slate-800 text-white rounded-md px-6 py-3 font-medium flex items-center gap-2 transition-transform hover:scale-[1.02]"
        >
          <Download className="h-4 w-4" /> {block.button_label}
        </a>
      </div>
    </section>
  )
}
