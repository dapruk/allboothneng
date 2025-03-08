import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

export const Route = createFileRoute("/_landing/photobooth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const MAX_IMAGES = 4;

  const [webcamControl, setWebcamControl] = useState(false);
  const [countdown, setCountdown] = useState(4);
  const [isCapturing, setCapturing] = useState(false);

  const cameraRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string[]>([]);

  const capture = useCallback(() => {
    if (cameraRef.current && image.length < MAX_IMAGES) {
      const shot = cameraRef.current.getScreenshot();
      if (shot) {
        setImage((prevImage) => [...prevImage, shot]);

        if (image.length + 1 === MAX_IMAGES) {
          setCapturing(false);
        }
      }
    }
  }, [image.length]);

  useEffect(() => {
    if (isCapturing && image.length < MAX_IMAGES) {
      const interval = setInterval(() => {
        if (countdown > 1) {
          setCountdown((prev) => prev - 1);
        } else {
          capture();
          setCountdown(4);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCapturing, capture, countdown, image.length]);

  const retake = () => {
    setImage((prevImage) => prevImage.slice(0, -1));
    setCapturing(true);
  };

  const restart = () => {
    setImage([]);
  };

  return (
    <>
      <Button
        onClick={() => setWebcamControl(!webcamControl)}
        size="sm"
        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
      >
        {webcamControl ? "Turn Off Webcam" : "Turn On Webcam"}
      </Button>
      <div className="grid grid-cols-4">
        <div className="flex flex-col col-span-3 items-center gap-4 p-4">
          {webcamControl ? (
            <Webcam
              ref={cameraRef}
              screenshotFormat="image/png"
              className="w-full h-[500px] rounded-lg border border-gray-300"
              mirrored={true}
            />
          ) : (
            <div className="flex flex-col border border-black w-full h-[500px]">
              <h1>Webcam Turned Off</h1>
            </div>
          )}

          <div className="relative flex justify-between w-full items-center">
            <div className="items-center ml-auto space-x-2">
              {image.length === MAX_IMAGES && (
                <Button variant="destructive" onClick={restart}>
                  Restart
                </Button>
              )}
              {!isCapturing && (
                <Button
                  onClick={() => setCapturing(true)}
                  className=" bg-blue-500 text-white rounded-lg"
                >
                  Start
                </Button>
              )}

              {isCapturing && image.length > 0 && (
                <Button onClick={retake}>Retake</Button>
              )}
            </div>
          </div>
          {isCapturing && (
            <div className="relative flex justify-center w-full items-center">
              <h1 className="text-[100px] font-bold">{countdown}</h1>
            </div>
          )}
        </div>

        <div className=" h-full w-full flex flex-col">
          <h1 className="text-center font-bold text-lg">Captured Images</h1>
          <div className="grid grid-cols-1 justify-center space-y-4">
            {image.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`captured ${index + 1}`}
                className="w-full h-[180px] object-contain"
              />
            ))}
            {image.length > 0 && (
              <div className="self-end">
                <Button onClick={() => setImage([])}>Clear</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
