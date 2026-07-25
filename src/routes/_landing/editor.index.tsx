import Photostrip from "@/components/custom/photostrip";
import {
  createBlankSlots,
  EDITOR_STORAGE_KEY,
  loadCaptures,
  loadSlots,
  PhotostripSlots,
  saveSlots,
  SlotImage,
} from "@/lib/photostrip";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { RotateCw, Trash2, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_landing/editor/")({
  component: EditorPage,
});

const newSlot = (captureIndex: number): SlotImage => ({
  captureIndex,
  x: 0,
  y: 0,
  zoom: 1,
  rotation: 0,
});

function EditorPage() {
  const navigate = useNavigate();
  const [captures, setCaptures] = useState<string[]>([]);
  const [capturesLoaded, setCapturesLoaded] = useState(false);
  const [slots, setSlots] = useState<PhotostripSlots>(loadSlots);
  const [selectedCapture, setSelectedCapture] = useState<number | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => saveSlots(slots), [slots]);
  useEffect(() => {
    loadCaptures()
      .then(setCaptures)
      .finally(() => setCapturesLoaded(true));
  }, []);

  const setSlot = (index: number, value: SlotImage | null) => {
    setSlots((current) =>
      current.map((slot, slotIndex) => (slotIndex === index ? value : slot))
    );
  };

  const placeCapture = (slotIndex: number, captureIndex: number) => {
    setSlot(slotIndex, newSlot(captureIndex));
    setSelectedSlot(slotIndex);
  };

  const selectSlot = (slotIndex: number) => {
    if (selectedCapture !== null) {
      placeCapture(slotIndex, selectedCapture);
      setSelectedCapture(null);
      return;
    }
    setSelectedSlot(slotIndex);
  };

  const changeSlot = (slotIndex: number, patch: Partial<SlotImage>) => {
    setSlots((current) =>
      current.map((slot, index) =>
        index === slotIndex && slot ? { ...slot, ...patch } : slot
      )
    );
  };

  const selected = selectedSlot === null ? null : slots[selectedSlot];
  const complete = slots.every(Boolean);

  if (!capturesLoaded) {
    return (
      <div className="flex h-full items-center justify-center text-xl font-bold text-[#8276a3]">
        Loading captures…
      </div>
    );
  }

  if (captures.length < 6) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
          <h1 className="text-3xl font-bold text-[#8276a3]">
            Six captures required
          </h1>
          <button
            className="mt-6 rounded-full bg-[#8276a3] px-6 py-3 font-bold text-white"
            onClick={() => navigate({ to: "/photobooth" })}
          >
            Return to Photobooth
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden px-8 py-4">
      <div className="mx-auto grid h-full max-w-7xl grid-cols-[260px_minmax(180px,360px)_320px] items-start justify-center gap-8">
        <aside className="rounded-3xl bg-white p-5 shadow-xl">
          <h1 className="text-2xl font-bold text-[#8276a3]">Your captures</h1>
          <p className="mt-1 text-sm text-slate-500">
            Click one, then click a slot. Or drag it directly.
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {captures.slice(0, 6).map((capture, index) => (
              <button
                type="button"
                key={index}
                draggable
                onDragStart={(event) =>
                  event.dataTransfer.setData("capture-index", String(index))
                }
                onClick={() => setSelectedCapture(index)}
                className={`overflow-hidden rounded-xl border-4 ${
                  selectedCapture === index
                    ? "border-[#8276a3]"
                    : "border-transparent"
                }`}
              >
                <img
                  src={capture}
                  alt={`Capture ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/photobooth" })}
            className="mt-5 w-full rounded-full border-2 border-[#8276a3] px-4 py-2 font-bold text-[#8276a3]"
          >
            Back to captures
          </button>
        </aside>

        <main className="flex h-full min-h-0 flex-col items-center">
          <div className="min-h-0 flex-1 aspect-[1/4]">
            <Photostrip
              captures={captures}
              slots={slots}
              editable
              selectedSlot={selectedSlot}
              onSelectSlot={selectSlot}
              onChangeSlot={changeSlot}
              onDropCapture={placeCapture}
              onCopySlot={(source, target) => {
                const sourceSlot = slots[source];
                if (sourceSlot) setSlot(target, { ...sourceSlot });
              }}
            />
          </div>
          <button
            type="button"
            disabled={!complete}
            onClick={() => navigate({ to: "/preview" })}
            className="mt-3 w-full flex-none rounded-full bg-[#8276a3] px-6 py-3 text-lg font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
          >
            Preview photostrip
          </button>
          {!complete && (
            <p className="mt-2 text-center text-sm text-slate-500">
              Fill all four slots to continue.
            </p>
          )}
        </main>

        <aside className="rounded-3xl bg-white p-6 shadow-xl">
          <h2 className="text-xl font-bold text-[#8276a3]">Image controls</h2>
          {!selected ? (
            <p className="mt-4 text-slate-500">Select a placed image.</p>
          ) : (
            <div className="mt-5 space-y-6">
              <label className="block">
                <span className="flex justify-between font-semibold">
                  Zoom <span>{selected.zoom.toFixed(2)}×</span>
                </span>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.01"
                  value={selected.zoom}
                  onChange={(event) =>
                    changeSlot(selectedSlot!, {
                      zoom: Number(event.target.value),
                    })
                  }
                  className="mt-2 w-full accent-[#8276a3]"
                />
              </label>
              <label className="block">
                <span className="flex justify-between font-semibold">
                  Rotation <span>{Math.round(selected.rotation)}°</span>
                </span>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  step="1"
                  value={selected.rotation}
                  onChange={(event) =>
                    changeSlot(selectedSlot!, {
                      rotation: Number(event.target.value),
                    })
                  }
                  className="mt-2 w-full accent-[#8276a3]"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <ControlButton
                  icon={<RotateCw size={18} />}
                  label="Rotate 90°"
                  onClick={() =>
                    changeSlot(selectedSlot!, {
                      rotation: ((selected.rotation + 270) % 360) - 180,
                    })
                  }
                />
                <ControlButton
                  icon={<Undo2 size={18} />}
                  label="Reset"
                  onClick={() =>
                    setSlot(selectedSlot!, newSlot(selected.captureIndex))
                  }
                />
                <ControlButton
                  icon={<Trash2 size={18} />}
                  label="Remove"
                  danger
                  onClick={() => {
                    setSlot(selectedSlot!, null);
                    setSelectedSlot(null);
                  }}
                />
              </div>
              <p className="text-sm text-slate-500">
                Drag image to reposition. Drag purple handle to rotate. Drag
                grip onto another slot to copy.
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              setSlots(createBlankSlots());
              setSelectedSlot(null);
              sessionStorage.removeItem(EDITOR_STORAGE_KEY);
            }}
            className="mt-8 w-full rounded-full border border-red-300 px-4 py-2 font-semibold text-red-600"
          >
            Clear strip
          </button>
        </aside>
      </div>
    </div>
  );
}

function ControlButton({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold ${
        danger ? "bg-red-50 text-red-600" : "bg-[#f3f0f8] text-[#8276a3]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
