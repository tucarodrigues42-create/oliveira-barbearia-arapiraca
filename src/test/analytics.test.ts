import { afterEach, describe, expect, it, vi } from "vitest";
import { installClickTracking, resolveTrackEvent } from "@/lib/analytics";

describe("Click tracking", () => {
  it("splits booking clicks into agendar and assinar by origin", () => {
    expect(resolveTrackEvent("booking", "hero")).toEqual({
      name: "agendar",
      data: { origem: "hero" },
    });
    expect(resolveTrackEvent("booking", "service-Corte")?.name).toBe("agendar");
    expect(resolveTrackEvent("booking", "plans")?.name).toBe("assinar");
    expect(resolveTrackEvent("booking", "black-selector-black-corte")?.name).toBe("assinar");
  });

  it("keeps outbound contacts and ignores in-page interactions", () => {
    expect(resolveTrackEvent("whatsapp", "fab")).toEqual({
      name: "whatsapp",
      data: { origem: "fab" },
    });
    expect(resolveTrackEvent("phone", null)?.data.origem).toBe("desconhecida");
    expect(resolveTrackEvent("plans", "hero")).toBeNull();
    expect(resolveTrackEvent("black-choice", "black-corte")).toBeNull();
    expect(resolveTrackEvent(null, "hero")).toBeNull();
  });

  describe("document listener", () => {
    let uninstall: () => void = () => {};
    afterEach(() => {
      uninstall();
      delete (window as { umami?: unknown }).umami;
      document.body.innerHTML = "";
    });

    it("sends the event to Umami when a tracked element (or its child) is clicked", () => {
      const track = vi.fn();
      (window as { umami?: unknown }).umami = { track };
      document.body.innerHTML =
        '<a href="#" data-track="booking" data-track-origin="plans"><span id="inner">Assinar</span></a>';
      uninstall = installClickTracking();
      document.getElementById("inner")!.click();
      expect(track).toHaveBeenCalledWith("assinar", { origem: "plans" });
    });

    it("does nothing when Umami has not loaded", () => {
      document.body.innerHTML =
        '<a href="#" data-track="whatsapp" data-track-origin="fab">WhatsApp</a>';
      uninstall = installClickTracking();
      expect(() => document.querySelector("a")!.click()).not.toThrow();
    });
  });
});
