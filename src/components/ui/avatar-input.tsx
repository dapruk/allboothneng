import React, { useRef, useState, useEffect, memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface AvatarInputProps {
  onAvatarChange: (file: File | null) => void;
  avatarFile: File | null | undefined;
}

const AvatarInput: React.FC<AvatarInputProps> = memo(
  ({ onAvatarChange, avatarFile }) => {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (avatarFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(avatarFile);
      } else {
        setAvatarPreview(null);
      }
    }, [avatarFile]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null;
      onAvatarChange(file);
    };

    const handleButtonClick = () => {
      fileInputRef.current?.click();
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarPreview || ""} alt="Avatar preview" />
          <AvatarFallback>
            <User className="w-12 h-12 text-gray-400" />
          </AvatarFallback>
        </Avatar>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button onClick={handleButtonClick} variant="outline" type="button">
            {avatarPreview ? "Change Avatar" : "Upload Avatar"}
          </Button>
        </div>
      </div>
    );
  },
);

AvatarInput.displayName = "AvatarInput";

export default AvatarInput;
