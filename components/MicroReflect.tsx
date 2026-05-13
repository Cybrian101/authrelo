"use client";

interface MicroReflectProps {
  text: string;
}

export default function MicroReflect({ text }: MicroReflectProps) {
  return (
    <div className="flex justify-start opacity-0 animate-fade-in-up px-2">
      <p className="text-sm italic text-accent/70 leading-relaxed max-w-[85%] py-2">
        {text}
      </p>
    </div>
  );
}
