import Photostrip from "@/components/custom/photostrip";
import { loadCaptures, loadSlots, randomExportName } from "@/lib/photostrip";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import html2canvas from "html2canvas";
import { Download, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_landing/preview/")({
  component: PreviewPage,
});

function PreviewPage() {
  const navigate = useNavigate();
  const [captures, setCaptures] = useState<string[]>([]);
  const [capturesLoaded, setCapturesLoaded] = useState(false);
  const [slots] = useState(loadSlots);
  const [downloading, setDownloading] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);
  const complete = slots.every(Boolean) && captures.length >= 6;

  useEffect(() => {
    loadCaptures()
      .then(setCaptures)
      .finally(() => setCapturesLoaded(true));
  }, []);

  const download = async () => {
    if (!exportRef.current || !complete) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(exportRef.current, {
        backgroundColor: "#ffffff",
        scale: 1,
        useCORS: true,
        logging: false,
      });
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );
      if (!blob) throw new Error("PNG rendering returned no data");

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = randomExportName();
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error("Could not create PNG. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (!capturesLoaded) {
    return (
      <div className="flex h-full items-center justify-center text-xl font-bold text-[#8276a3]">
        Loading captures…
      </div>
    );
  }

  if (!complete) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <h1 className="text-3xl font-bold text-[#8276a3]">
            Photostrip incomplete
          </h1>
          <button
            className="mt-6 rounded-full bg-[#8276a3] px-6 py-3 font-bold text-white"
            onClick={() => navigate({ to: "/editor" })}
          >
            Return to Editor
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto py-10">
      <div className="mx-auto w-[360px]">
        <h1 className="mb-6 text-center font-satisfy text-5xl font-bold text-[#8276a3]">
          Your Photostrip
        </h1>
        <Photostrip captures={captures} slots={slots} />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => navigate({ to: "/editor" })}
            className="rounded-full border-2 border-[#8276a3] px-4 py-3 font-bold text-[#8276a3]"
          >
            Back to Editor
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={download}
            className="flex items-center justify-center gap-2 rounded-full bg-[#8276a3] px-4 py-3 font-bold text-white disabled:opacity-60"
          >
            {downloading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Download />
            )}
            Download PNG
          </button>
        </div>
      </div>

      <div
        ref={exportRef}
        aria-hidden
        className="fixed -left-[10000px] top-0"
        style={{ width: 1200, height: 4800 }}
      >
        <Photostrip captures={captures} slots={slots} />
      </div>
    </div>
  );
}
