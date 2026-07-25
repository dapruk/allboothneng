import AnimatedCountdown from "@/components/custom/animated-countdown";
import AnimatedButton from "@/components/custom/button";
import CapturedImage from "@/components/custom/captured-image";
import {
  clearCaptures,
  EDITOR_STORAGE_KEY,
  loadCaptures,
  REQUIRED_CAPTURES,
  saveCaptures,
} from "@/lib/photostrip";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Camera,
  RefreshCcw,
  RotateCcw,
  Video,
  WandSparkles,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

export const Route = createFileRoute("/_landing/photobooth/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const DEV_MODE = false;
  const timer = 5;
  const maxImages = REQUIRED_CAPTURES;

  const [webcamControl, setWebcamControl] = useState(DEV_MODE ? false : true);
  const [countdown, setCountdown] = useState(timer);
  const [isCapturing, setCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const cameraRef = useRef<Webcam>(null);
  const [image, setImage] = useState<string[]>([]);
  const [capturesLoaded, setCapturesLoaded] = useState(false);

  useEffect(() => {
    loadCaptures()
      .then(setImage)
      .catch(() => toast.error("Could not load saved captures."))
      .finally(() => setCapturesLoaded(true));
  }, []);

  const capture = useCallback(() => {
    if (cameraRef.current && image.length < maxImages) {
      setShowFlash(true);

      setTimeout(async () => {
        const shot = cameraRef.current?.getScreenshot();
        if (shot) {
          const images = [...image, shot];
          try {
            await saveCaptures(images);
            setImage(images);

            if (image.length + 1 === maxImages) {
              setCapturing(false);
            }
          } catch {
            setCapturing(false);
            toast.error("Capture could not be saved. Please try again.");
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
  const retakePictures = async () => {
    const images = image.slice(0, -1);
    await saveCaptures(images);
    setImage(images);
    setCapturing(true);
  };
  const restartBooth = async () => {
    setImage([]);
    await clearCaptures();
    sessionStorage.removeItem(EDITOR_STORAGE_KEY);
    setCapturing(false);
    setCountdown(timer);
  };

  return (
    <>
      {!capturesLoaded && (
        <div className="flex h-full items-center justify-center text-xl font-bold text-[#8276a3]">
          Loading captures…
        </div>
      )}
      {capturesLoaded && (
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
                    background: "#8276a3",
                    text: "#FFFFFF",
                  }}
                  toColor={{
                    background: "#FFFFFF",
                    text: "#8276a3",
                  }}
                  onClick={() => navigate({ to: "/editor" })}
                >
                  <WandSparkles />
                  <span>Continue to Editor</span>
                </AnimatedButton>
              )}

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

              {image.length > 0 &&
                (isCapturing || image.length === maxImages) && (
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
                    onClick={retakePictures}
                  >
                    <RefreshCcw />
                    <span>Retake</span>
                  </AnimatedButton>
                )}

              {DEV_MODE && (
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
      )}
    </>
  );
}
