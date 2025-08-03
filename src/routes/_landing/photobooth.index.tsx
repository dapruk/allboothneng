import AnimatedCountdown from "@/components/custom/animated-countdown";
import AnimatedButton from "@/components/custom/button";
import CapturedImage from "@/components/custom/captured-image";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, RefreshCcw, RotateCcw, Video } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

export const Route = createFileRoute("/_landing/photobooth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const DEV_MODE = false;
  const timer = 5;
  const maxImages = 4;

  const [webcamControl, setWebcamControl] = useState(DEV_MODE ? false : true);
  const [countdown, setCountdown] = useState(timer);
  const [isCapturing, setCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const cameraRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string[]>([]);

  const capture = useCallback(() => {
    if (cameraRef.current && image.length < maxImages) {
      setShowFlash(true);

      setTimeout(() => {
        const shot = cameraRef.current?.getScreenshot();
        if (shot) {
          const images = [...image, shot];
          setImage(images);
          sessionStorage.setItem("booth_images", JSON.stringify(images));

          if (image.length + 1 === maxImages) {
            setCapturing(false);
          }
        }

        setTimeout(() => setShowFlash(false), 100);
      }, 50);
    }
  }, [image, maxImages]);

  useEffect(() => {
    if (isCapturing && image.length < maxImages) {
      const interval = setInterval(() => {
        if (countdown > 1) {
          setCountdown((prev) => prev - 1);
        } else {
          capture();
          setCountdown(timer);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isCapturing, capture, countdown, image.length, maxImages]);

  const toggleWebcam = () => setWebcamControl((prev) => !prev);
  const startBooth = () => setCapturing(true);
  const retakePictures = () => {
    setImage((prev) => prev.slice(0, -1));
    setCapturing(true);
  };
  const restartBooth = () => {
    setImage([]);
    sessionStorage.removeItem("booth_images");
    setCapturing(false);
    setCountdown(timer);
  };

  return (
    <>
      <div className="gap-4 z-10 flex flex-col w-full min-h-full">
        <div className="flex justify-center">
          <div className="flex bg-white w-[55%] drop-shadow-lg p-8 justify-center rounded-3xl relative">
            {webcamControl ? (
              <>
                {showFlash && (
                  <div className="absolute inset-0 z-30 bg-white rounded-2xl animate-pulse opacity-90" />
                )}

                {isCapturing && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center">
                    <AnimatedCountdown countdown={countdown} />
                  </div>
                )}

                <div className="absolute bottom-12 z-20 flex w-full justify-center gap-4 h-[10vh]">
                  {image.map((image, index) => (
                    <CapturedImage
                      key={index}
                      src={image}
                      totalImages={maxImages}
                      alt={`captured ${index + 1}`}
                    />
                  ))}
                </div>

                <Webcam
                  className="flex rounded-2xl w-full"
                  ref={cameraRef}
                  screenshotFormat="image/png"
                  mirrored={true}
                />
              </>
            ) : (
              <div>
                <h1>Webcam Turned Off</h1>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-4 w-[75%] drop-shadow-lg p-8 justify-center rounded-full">
            {image.length === maxImages && (
              <AnimatedButton
                size="xl"
                fromColor={{
                  background: "#FFFFFF",
                  text: "#8276a3",
                }}
                toColor={{
                  background: "#8276a3",
                  text: "#FFFFFF",
                }}
                onClick={restartBooth}
              >
                <RotateCcw />
                <span>Restart</span>
              </AnimatedButton>
            )}

            {!isCapturing && image.length === 0 && (
              <AnimatedButton
                size="xl"
                fromColor={{
                  background: "#FFFFFF",
                  text: "#8276a3",
                }}
                toColor={{
                  background: "#8276a3",
                  text: "#FFFFFF",
                }}
                onClick={startBooth}
              >
                <Camera />
                <span> Start</span>
              </AnimatedButton>
            )}

            {isCapturing && image.length > 0 && (
              <AnimatedButton
                size="lg"
                fromColor={{
                  background: "#FFFFFF",
                  text: "#8276a3",
                }}
                toColor={{
                  background: "#8276a3",
                  text: "#FFFFFF",
                }}
                onClick={retakePictures}
              >
                <RefreshCcw />
                <span>Retake</span>
              </AnimatedButton>
            )}

            {DEV_MODE && (
              <AnimatedButton
                size="lg"
                fromColor={{
                  background: "#FFFFFF",
                  text: "#8276a3",
                }}
                toColor={{
                  background: "#8276a3",
                  text: "#FFFFFF",
                }}
                onClick={toggleWebcam}
              >
                <Video />
                <span>
                  {webcamControl ? "Turn Off Webcam" : "Turn On Webcam"}
                </span>
              </AnimatedButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
