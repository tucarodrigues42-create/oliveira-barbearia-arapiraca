import { useEffect, useRef } from "react";

/** Progressive 2.5D enhancement: the image remains visible without JavaScript. */
export function ClipperStage() {
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = stage.current;
    if (!node) return;
    const preference = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;
    const reset = () => {
      cancelAnimationFrame(frame);
      node.style.setProperty("--rx", "0deg");
      node.style.setProperty("--ry", "0deg");
    };
    const move = (event: PointerEvent) => {
      if (!preference.matches) return;
      const rect = node.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.style.setProperty("--rx", `${-y * 4}deg`);
        node.style.setProperty("--ry", `${x * 6}deg`);
      });
    };
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerleave", reset);
    preference.addEventListener("change", reset);
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerleave", reset);
      preference.removeEventListener("change", reset);
    };
  }, []);
  return (
    <div className="clipper-stage" ref={stage} aria-hidden="true">
      <span className="stage-word">OLVR</span>
      <div className="stage-orbit" />
      <img
        className="clipper-image"
        src="/maquinas-sem-base.png"
        width="1254"
        height="1254"
        alt=""
        decoding="async"
        fetchPriority="high"
      />
      <span className="stage-caption">O cuidado está nos detalhes.</span>
      <span className="stage-index">01 — OLIVEIRA</span>
    </div>
  );
}
