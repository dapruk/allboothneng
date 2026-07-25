import { PhotostripSlots } from "@/lib/photostrip";
import { GripVertical } from "lucide-react";
import { PointerEvent, useRef } from "react";

interface PhotostripProps {
  captures: string[];
  slots: PhotostripSlots;
  editable?: boolean;
  selectedSlot?: number | null;
  onSelectSlot?: (index: number) => void;
  onChangeSlot?: (
    index: number,
    patch: Partial<NonNullable<PhotostripSlots[number]>>
  ) => void;
  onDropCapture?: (slotIndex: number, captureIndex: number) => void;
  onCopySlot?: (sourceIndex: number, targetIndex: number) => void;
}

export default function Photostrip({
  captures,
  slots,
  editable = false,
  selectedSlot = null,
  onSelectSlot,
  onChangeSlot,
  onDropCapture,
  onCopySlot,
}: PhotostripProps) {
  const stripRef = useRef<HTMLDivElement>(null);

  const startPositionDrag = (
    event: PointerEvent<HTMLDivElement>,
    slotIndex: number
  ) => {
    const slot = slots[slotIndex];
    if (!editable || !slot || !onChangeSlot) return;

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    onSelectSlot?.(slotIndex);

    const startX = event.clientX;
    const startY = event.clientY;
    const initialX = slot.x;
    const initialY = slot.y;
    const slotElement =
      event.currentTarget.closest<HTMLElement>("[data-strip-slot]");
    const renderedSize = slotElement?.getBoundingClientRect().width ?? 1;

    const move = (moveEvent: globalThis.PointerEvent) => {
      onChangeSlot(slotIndex, {
        x: initialX + ((moveEvent.clientX - startX) / renderedSize) * 100,
        y: initialY + ((moveEvent.clientY - startY) / renderedSize) * 100,
      });
    };

    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  const startRotation = (
    event: PointerEvent<HTMLButtonElement>,
    slotIndex: number
  ) => {
    if (!editable || !onChangeSlot) return;
    event.preventDefault();
    event.stopPropagation();

    const slotElement =
      event.currentTarget.closest<HTMLElement>("[data-strip-slot]");
    if (!slotElement) return;
    const rect = slotElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const move = (moveEvent: globalThis.PointerEvent) => {
      const degrees =
        (Math.atan2(moveEvent.clientY - centerY, moveEvent.clientX - centerX) *
          180) /
          Math.PI +
        90;
      onChangeSlot(slotIndex, {
        rotation: ((degrees + 180) % 360) - 180,
      });
    };
    const stop = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", stop);
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", stop);
  };

  return (
    <div
      ref={stripRef}
      data-photostrip
      className="relative w-full overflow-hidden bg-white shadow-2xl"
      style={{ aspectRatio: "1 / 4", containerType: "inline-size" }}
    >
      <div className="absolute inset-0">
        {slots.map((slot, index) => (
          <div
            key={index}
            data-strip-slot
            className={`group relative aspect-square overflow-hidden bg-white ${
              editable
                ? selectedSlot === index
                  ? "ring-[12px] ring-[#8276a3]"
                  : "ring-[5px] ring-dashed ring-[#d9d3e8]"
                : ""
            }`}
            style={{
              position: "absolute",
              left: "5%",
              right: "5%",
              top: `${1.25 + index * 23.25}%`,
              height: "22.5%",
            }}
            onClick={() => onSelectSlot?.(index)}
            onDragOver={(event) => {
              if (editable) event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              const captureIndex = event.dataTransfer.getData("capture-index");
              const sourceSlot = event.dataTransfer.getData("slot-index");
              if (captureIndex !== "") {
                onDropCapture?.(index, Number(captureIndex));
              } else if (sourceSlot !== "") {
                onCopySlot?.(Number(sourceSlot), index);
              }
            }}
          >
            {slot ? (
              <>
                <div
                  className={
                    editable
                      ? "absolute inset-0 cursor-move touch-none"
                      : "absolute inset-0"
                  }
                  onPointerDown={(event) => startPositionDrag(event, index)}
                >
                  <img
                    src={captures[slot.captureIndex]}
                    alt={`Strip position ${index + 1}`}
                    draggable={false}
                    className="h-full w-full select-none object-cover"
                    style={{
                      transform: `translate(${slot.x}%, ${slot.y}%) scale(${slot.zoom}) rotate(${slot.rotation}deg)`,
                      transformOrigin: "center",
                    }}
                  />
                </div>
                {editable && selectedSlot === index && (
                  <>
                    <button
                      type="button"
                      aria-label="Drag to rotate image"
                      className="absolute left-1/2 top-3 z-20 h-12 w-12 -translate-x-1/2 cursor-grab rounded-full border-4 border-white bg-[#8276a3] shadow-lg"
                      onPointerDown={(event) => startRotation(event, index)}
                    />
                    <button
                      type="button"
                      draggable
                      aria-label="Copy image to another slot"
                      className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 text-[#8276a3] shadow"
                      onDragStart={(event) =>
                        event.dataTransfer.setData("slot-index", String(index))
                      }
                    >
                      <GripVertical />
                    </button>
                  </>
                )}
              </>
            ) : (
              editable && (
                <div className="flex h-full items-center justify-center text-8xl font-bold text-[#d9d3e8]">
                  {index + 1}
                </div>
              )
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-[2.5%] right-[5%] text-right text-[#8276a3]">
        <div
          className="font-satisfy font-bold"
          style={{ fontSize: "clamp(24px, 6.67cqw, 80px)" }}
        >
          AllBoothNeng
        </div>
      </div>
    </div>
  );
}
