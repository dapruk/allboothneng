export const CAPTURE_STORAGE_KEY = "booth_images";
export const EDITOR_STORAGE_KEY = "booth_editor";
export const REQUIRED_CAPTURES = 6;
export const STRIP_SLOT_COUNT = 4;
export const STRIP_WIDTH = 1200;
export const STRIP_HEIGHT = 4800;
export const STRIP_SLOT_SIZE = 1080;
export const STRIP_SLOT_GAP = 36;
export const STRIP_PADDING = 60;
const CAPTURE_DB_NAME = "allboothneng";
const CAPTURE_STORE_NAME = "captures";
const CAPTURE_RECORD_KEY = "current";

export interface SlotImage {
  captureIndex: number;
  x: number;
  y: number;
  zoom: number;
  rotation: number;
}

export type PhotostripSlots = Array<SlotImage | null>;

export const createBlankSlots = (): PhotostripSlots =>
  Array.from({ length: STRIP_SLOT_COUNT }, () => null);

function readLegacyCaptures(): string[] {
  try {
    const value = JSON.parse(
      sessionStorage.getItem(CAPTURE_STORAGE_KEY) ?? "[]"
    );
    return Array.isArray(value)
      ? value.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

function openCaptureDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(CAPTURE_DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(CAPTURE_STORE_NAME)) {
        request.result.createObjectStore(CAPTURE_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadCaptures(): Promise<string[]> {
  const database = await openCaptureDatabase();
  const captures = await new Promise<string[] | undefined>(
    (resolve, reject) => {
      const transaction = database.transaction(CAPTURE_STORE_NAME, "readonly");
      const request = transaction
        .objectStore(CAPTURE_STORE_NAME)
        .get(CAPTURE_RECORD_KEY);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }
  );
  database.close();

  if (Array.isArray(captures)) return captures;

  const legacyCaptures = readLegacyCaptures();
  if (legacyCaptures.length) {
    await saveCaptures(legacyCaptures);
    sessionStorage.removeItem(CAPTURE_STORAGE_KEY);
  }
  return legacyCaptures;
}

export async function saveCaptures(captures: string[]): Promise<void> {
  const database = await openCaptureDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(CAPTURE_STORE_NAME, "readwrite");
    transaction
      .objectStore(CAPTURE_STORE_NAME)
      .put(captures, CAPTURE_RECORD_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  database.close();
}

export async function clearCaptures(): Promise<void> {
  const database = await openCaptureDatabase();
  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(CAPTURE_STORE_NAME, "readwrite");
    transaction.objectStore(CAPTURE_STORE_NAME).delete(CAPTURE_RECORD_KEY);
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
  database.close();
  sessionStorage.removeItem(CAPTURE_STORAGE_KEY);
}

export function loadSlots(): PhotostripSlots {
  try {
    const value = JSON.parse(
      sessionStorage.getItem(EDITOR_STORAGE_KEY) ?? "[]"
    );
    if (!Array.isArray(value) || value.length !== STRIP_SLOT_COUNT) {
      return createBlankSlots();
    }

    return value.map((slot): SlotImage | null => {
      if (
        slot === null ||
        typeof slot !== "object" ||
        typeof slot.captureIndex !== "number" ||
        typeof slot.x !== "number" ||
        typeof slot.y !== "number" ||
        typeof slot.zoom !== "number" ||
        typeof slot.rotation !== "number"
      ) {
        return null;
      }
      return slot;
    });
  } catch {
    return createBlankSlots();
  }
}

export function saveSlots(slots: PhotostripSlots) {
  sessionStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(slots));
}

export function randomExportName() {
  const suffix = Array.from(
    crypto.getRandomValues(new Uint8Array(8)),
    (value) => "abcdefghijklmnopqrstuvwxyz0123456789"[value % 36]
  ).join("");
  return `allboothneng-${suffix}.png`;
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load captured image"));
    image.src = source;
  });
}

export async function renderPhotostripPng(
  captures: string[],
  slots: PhotostripSlots
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = STRIP_WIDTH;
  canvas.height = STRIP_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is unavailable");

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, STRIP_WIDTH, STRIP_HEIGHT);

  const images = await Promise.all(
    slots.map((slot) =>
      slot ? loadImage(captures[slot.captureIndex]) : Promise.resolve(null)
    )
  );

  slots.forEach((slot, index) => {
    const image = images[index];
    if (!slot || !image) return;

    const slotX = STRIP_PADDING;
    const slotY = STRIP_PADDING + index * (STRIP_SLOT_SIZE + STRIP_SLOT_GAP);
    const coverScale = Math.max(
      STRIP_SLOT_SIZE / image.naturalWidth,
      STRIP_SLOT_SIZE / image.naturalHeight
    );
    const imageWidth = image.naturalWidth * coverScale;
    const imageHeight = image.naturalHeight * coverScale;

    context.save();
    context.beginPath();
    context.rect(slotX, slotY, STRIP_SLOT_SIZE, STRIP_SLOT_SIZE);
    context.clip();
    context.translate(
      slotX + STRIP_SLOT_SIZE / 2 + (slot.x / 100) * STRIP_SLOT_SIZE,
      slotY + STRIP_SLOT_SIZE / 2 + (slot.y / 100) * STRIP_SLOT_SIZE
    );
    context.rotate((slot.rotation * Math.PI) / 180);
    context.scale(slot.zoom, slot.zoom);
    context.drawImage(
      image,
      -imageWidth / 2,
      -imageHeight / 2,
      imageWidth,
      imageHeight
    );
    context.restore();
  });

  await document.fonts.load("80px Satisfy");
  context.fillStyle = "#8276a3";
  context.font = "700 80px Satisfy, cursive";
  context.textAlign = "right";
  context.textBaseline = "bottom";
  context.fillText("AllBoothNeng", 1140, 4680);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("PNG rendering returned no data")),
      "image/png"
    );
  });
}
