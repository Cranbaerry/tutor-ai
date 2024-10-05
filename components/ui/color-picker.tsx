"use client";
import React, { useState } from "react";
import Sketch from "@uiw/react-color-sketch";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface PopoverPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<PopoverPickerProps> = ({
  color,
  onChange,
}) => {
  const [hex, setHex] = useState(color);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="swatch" style={{ backgroundColor: hex }} />
      </PopoverTrigger>
      <PopoverContent className="p-0 m-0 w-fit ml-8">
        <Sketch
          color={hex}
          onChange={(color) => {
            onChange(color.hex);
            setHex(color.hex);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
