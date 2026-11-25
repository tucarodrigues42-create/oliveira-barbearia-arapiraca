import { afterEach, describe, expect, it, vi } from "vitest";
import { installClickTracking, resolveTrackEvent } from "@/lib/analytics";

describe("Click tracking", () => {
  it("splits booking clicks into agendar, the Cash Barber exit and assinar", () => {
    expect(resolveTrackEvent("booking", "hero")).toEqual({
      name: "agendar",
      data: { origem: "hero" },
    });
    expect(resolveTrackEvent("booking", "sticky-bar")?.name).toBe("agendar");
    expect(resolveTrackEvent("booking", "booking-dialog")?.name).toBe("agendar-cash-barber");
    expect(resolveTrackEvent("booking", "plan-black-corte")).toEqual({
      name: "assinar",
      data: { origem: "plan-black-corte" },
    });
    expect(resolveTrackEvent("booking", "plan-smart")?.name).toBe("assinar");
  });

  it("measures the Black plan button, outbound contacts and ignores the rest", () => {
    expect(resolveTrackEvent("plans", "hero")).toEqual({
      name: "ver-black",
      data: { origem: "hero" },
    });
    expect(resolveTrackEvent("whatsapp", "sticky-bar")).toEqual({
      name: "whatsapp",
      data: { origem: "sticky-bar" },
    });
    expect(resolveTrackEvent("phone", null)?.data.origem).toBe("desconhecida");
    expect(resolveTrackEvent("reviews", "hero")).toBeNull();
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
        '<a href="#" data-track="booking" data-track-origin="plan-black-corte"><span id="inner">Assinar</span></a>';
      uninstall = installClickTracking();
      document.getElementById("inner")!.click();
      expect(track).toHaveBeenCalledWith("assinar", { origem: "plan-black-corte" });
    });

    it("does nothing when Umami has not loaded", () => {
      document.body.innerHTML =
        '<a href="#" data-track="whatsapp" data-track-origin="fab">WhatsApp</a>';
      uninstall = installClickTracking();
      expect(() => document.querySelector("a")!.click()).not.toThrow();
    });
  });
});
