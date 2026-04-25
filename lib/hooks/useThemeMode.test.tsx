import { ReactNode } from "react";
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MedixProvider } from "../components/provider/MedixProvider";
import { useThemeMode, useIsDarkMode } from "./useThemeMode";

const wrapper = ({ children }: { children: ReactNode }) => (
  <MedixProvider defaultColorMode="light">{children}</MedixProvider>
);

describe("useThemeMode", () => {
  it("sets mounted=true after effects run", async () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    await act(async () => {});
    expect(result.current.mounted).toBe(true);
  });

  it("returns themeMode as 'light' by default", async () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    await act(async () => {});
    expect(result.current.themeMode).toBe("light");
  });

  it("returns a valid themeSetting after mount", async () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    await act(async () => {});
    expect(["light", "dark", "system"]).toContain(result.current.themeSetting);
  });

  it("setThemeMode updates themeSetting and themeMode to 'dark'", async () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    await act(async () => {});
    act(() => {
      result.current.setThemeMode("dark");
    });
    expect(result.current.themeSetting).toBe("dark");
    expect(result.current.themeMode).toBe("dark");
  });

  it("setThemeMode updates themeSetting to 'system'", async () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    await act(async () => {});
    act(() => {
      result.current.setThemeMode("system");
    });
    expect(result.current.themeSetting).toBe("system");
  });

  it("toggleThemeMode switches from light to dark", async () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    await act(async () => {});
    // Ensure we start in light mode
    act(() => {
      result.current.setThemeMode("light");
    });
    act(() => {
      result.current.toggleThemeMode();
    });
    expect(result.current.themeMode).toBe("dark");
    expect(result.current.themeSetting).toBe("dark");
  });

  it("toggleThemeMode switches from dark to light", async () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    await act(async () => {});
    act(() => {
      result.current.setThemeMode("dark");
    });
    act(() => {
      result.current.toggleThemeMode();
    });
    expect(result.current.themeMode).toBe("light");
    expect(result.current.themeSetting).toBe("light");
  });
});

describe("useIsDarkMode", () => {
  it("returns false before mount (mounted gating)", () => {
    const { result } = renderHook(() => useIsDarkMode(), { wrapper });
    expect(result.current).toBe(false);
  });

  it("returns false after mount in light mode", async () => {
    const { result } = renderHook(() => useIsDarkMode(), { wrapper });
    await act(async () => {});
    expect(result.current).toBe(false);
  });

  it("returns true after mount when theme is set to dark", async () => {
    const themeModeResult = renderHook(() => useThemeMode(), { wrapper });
    await act(async () => {});
    act(() => {
      themeModeResult.result.current.setThemeMode("dark");
    });

    const isDarkResult = renderHook(() => useIsDarkMode(), { wrapper });
    await act(async () => {});
    expect(isDarkResult.result.current).toBe(true);
  });
});
