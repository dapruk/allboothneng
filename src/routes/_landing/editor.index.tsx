import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_landing/editor/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const stored_images = sessionStorage.getItem("booth_images");
    if (stored_images) {
      setImages(JSON.parse(stored_images));
    }
  }, []);
  return (
    <>
      <div>Photobooth Editor</div>
      <div>
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`captured ${index + 1}`}
            className="w-full h-[180px] object-contain"
          />
        ))}
      </div>
    </>
  );
}
