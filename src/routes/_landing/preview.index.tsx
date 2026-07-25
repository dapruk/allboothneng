import Photostrip from "@/components/custom/photostrip";
import AnimatedButton from "@/components/custom/button";
import {
  clearCaptures,
  EDITOR_STORAGE_KEY,
  loadCaptures,
  loadSlots,
  randomExportName,
  renderPhotostripPng,
} from "@/lib/photostrip";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
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
  const complete = slots.every(Boolean) && captures.length >= 6;

  useEffect(() => {
    loadCaptures()
      .then(setCaptures)
      .finally(() => setCapturesLoaded(true));
  }, []);

  const download = async () => {
    if (!complete) return;
    setDownloading(true);
    try {
      const blob = await renderPhotostripPng(captures, slots);
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

  const startAgain = async () => {
    const confirmed = window.confirm(
      "Start again? This will remove your captures and photostrip edits."
    );
    if (!confirmed) return;

    try {
      await clearCaptures();
      sessionStorage.removeItem(EDITOR_STORAGE_KEY);
      navigate({ to: "/photobooth" });
    } catch (error) {
      console.error(error);
      toast.error("Could not clear this photobooth session.");
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
    <div className="h-full overflow-hidden py-4">
      <div className="mx-auto flex h-full min-h-0 flex-col items-center">
        <h1 className="mb-3 flex-none text-center font-satisfy text-4xl font-bold text-[#8276a3]">
          Your Photostrip
        </h1>
        <div className="min-h-0 flex-1 aspect-[1/4]">
          <Photostrip captures={captures} slots={slots} />
        </div>
        <div className="mt-3 grid w-[360px] flex-none grid-cols-2 gap-3">
          <AnimatedButton
            size="lg"
            className="w-full"
            fromColor={{ background: "#ffffff", text: "#8276a3" }}
            toColor={{ background: "#8276a3", text: "#ffffff" }}
            onClick={() => navigate({ to: "/editor" })}
          >
            Back to Editor
          </AnimatedButton>
          <AnimatedButton
            size="lg"
            className="w-full"
            fromColor={{ background: "#8276a3", text: "#ffffff" }}
            toColor={{ background: "#ffffff", text: "#8276a3" }}
            disabled={downloading}
            onClick={download}
          >
            {downloading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Download />
            )}
            Download
          </AnimatedButton>
          <AnimatedButton
            size="lg"
            className="col-span-2 w-full"
            fromColor={{ background: "#ffffff", text: "#dc2626" }}
            toColor={{ background: "#dc2626", text: "#ffffff" }}
            onClick={startAgain}
          >
            Start Again
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
