import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_landing/")({
  component: LandingIndexPageComponent,
});

function LandingIndexPageComponent() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-cols h-screen items-center justify-center">
        <div className="justify-center grid grid-cols-1 space-y-4">
          <div className="text-center">
            <h1 className="font-bold text-3xl">SAKHALAKHA</h1>
            <p className="font-bold text-2xl"> PHOTOBOOTH</p>
          </div>
          <Button onClick={() => navigate({ to: "/photobooth" })}>
            Start Photobooth
          </Button>
        </div>
      </div>
    </>
  );
}
