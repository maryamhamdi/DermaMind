"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";

type TargetKey = "cart" | "wishlist";

interface FlyingImageState {
  id: number;
  imageUrl: string;
  startRect: DOMRect;
  endRect: DOMRect;
}

interface FlyToCartContextValue {
  registerTarget: (key: TargetKey, el: HTMLElement | null) => void;
  bounceTarget: (key: TargetKey) => void;
  flyToTarget: (
    key: TargetKey,
    sourceEl: HTMLElement | null,
    imageUrl: string
  ) => void;
  bouncingTarget: TargetKey | null;
}

const FlyToCartContext = createContext<FlyToCartContextValue | null>(null);

let flyId = 0;

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const targetRefs = useRef<Record<TargetKey, HTMLElement | null>>({
    cart: null,
    wishlist: null,
  });

  const [flyingImages, setFlyingImages] = useState<FlyingImageState[]>([]);
  const [bouncingTarget, setBouncingTarget] = useState<TargetKey | null>(null);

  const registerTarget = useCallback((key: TargetKey, el: HTMLElement | null) => {
    targetRefs.current[key] = el;
  }, []);

  const bounceTarget = useCallback((key: TargetKey) => {
    setBouncingTarget(key);
    setTimeout(() => setBouncingTarget(null), 450);
  }, []);

  const flyToTarget = useCallback(
    (key: TargetKey, sourceEl: HTMLElement | null, imageUrl: string) => {
      const targetEl = targetRefs.current[key];
      if (!sourceEl || !targetEl) return;

      const startRect = sourceEl.getBoundingClientRect();
      const endRect = targetEl.getBoundingClientRect();

      const id = ++flyId;
      setFlyingImages((prev) => [...prev, { id, imageUrl, startRect, endRect }]);

      // Remove the flying image once the animation duration has elapsed,
      // and trigger the bounce on the target icon right as it "arrives".
      setTimeout(() => {
        setFlyingImages((prev) => prev.filter((f) => f.id !== id));
        bounceTarget(key);
      }, 650);
    },
    [bounceTarget]
  );

  return (
    <FlyToCartContext.Provider
      value={{ registerTarget, bounceTarget, flyToTarget, bouncingTarget }}
    >
      {children}
      <FlyingImagesLayer images={flyingImages} />
    </FlyToCartContext.Provider>
  );
}

function FlyingImagesLayer({ images }: { images: FlyingImageState[] }) {
  return (
    <>
      {images.map((img) => (
        <FlyingImage key={img.id} {...img} />
      ))}
    </>
  );
}

function FlyingImage({
  imageUrl,
  startRect,
  endRect,
}: Omit<FlyingImageState, "id">) {
  const size = 56;

  const startX = startRect.left + startRect.width / 2 - size / 2;
  const startY = startRect.top + startRect.height / 2 - size / 2;
  const endX = endRect.left + endRect.width / 2 - size / 2;
  const endY = endRect.top + endRect.height / 2 - size / 2;

  const style: React.CSSProperties = {
    position: "fixed",
    left: startX,
    top: startY,
    width: size,
    height: size,
    borderRadius: "50%",
    overflow: "hidden",
    zIndex: 9999,
    pointerEvents: "none",
    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
    animation: `flyToTarget650 0.65s cubic-bezier(0.45, 0, 0.55, 1) forwards`,
    "--end-x": `${endX - startX}px`,
    "--end-y": `${endY - startY}px`,
  } as React.CSSProperties;

  return (
    <>
      <style>{`
        @keyframes flyToTarget650 {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          70% {
            transform: translate(calc(var(--end-x) * 0.9), calc(var(--end-y) * 0.9 - 20px)) scale(0.5);
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x), var(--end-y)) scale(0.15);
            opacity: 0;
          }
        }
      `}</style>
      <div style={style}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain", background: "#fff" }}
        />
      </div>
    </>
  );
}

export function useFlyToCart() {
  const ctx = useContext(FlyToCartContext);
  if (!ctx) {
    throw new Error("useFlyToCart must be used within a FlyToCartProvider");
  }
  return ctx;
}