"use client";

import React, { useState, useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

export type ToastType = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  id?: string;
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
}

// ── Simple Observer for Toasts ───────────────────────────────────────────
type Listener = (toasts: ToastOptions[]) => void;
let toasts: ToastOptions[] = [];
let listeners: Listener[] = [];

const notifyListeners = () => listeners.forEach((l) => l([...toasts]));

const generateId = () => Math.random().toString(36).substring(2, 9);

export const toast = (options: Omit<ToastOptions, "id">) => {
  const id = generateId();
  const newToast = { id, ...options };
  toasts = [...toasts, newToast];
  notifyListeners();

  if (options.duration !== Infinity && options.duration !== 0) {
    setTimeout(() => {
      dismissToast(id);
    }, options.duration || 4000);
  }
  return id;
};

export const dismissToast = (id: string) => {
  toasts = toasts.filter((t) => t.id !== id);
  notifyListeners();
};

toast.success = (title: string, options?: Partial<ToastOptions>) => toast({ title, type: "success", ...options });
toast.error = (title: string, options?: Partial<ToastOptions>) => toast({ title, type: "error", ...options });
toast.info = (title: string, options?: Partial<ToastOptions>) => toast({ title, type: "info", ...options });
toast.warning = (title: string, options?: Partial<ToastOptions>) => toast({ title, type: "warning", ...options });

// ── Toaster Component ───────────────────────────────────────────────────

const ICONS: Record<ToastType, React.ReactNode> = {
  success: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  ),
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
  )
};

export function Toaster() {
  const [currentToasts, setCurrentToasts] = useState<ToastOptions[]>([]);

  useEffect(() => {
    setCurrentToasts([...toasts]);
    const listener = (newToasts: ToastOptions[]) => setCurrentToasts(newToasts);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return (
    <Box
      position="fixed"
      bottom="4"
      right="4"
      zIndex={9999}
      display="flex"
      flexDirection="column"
      gap="3"
      pointerEvents="none"
    >
      <AnimatePresence>
        {currentToasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            style={{ pointerEvents: "auto" }}
          >
            <Box
              bg="bg.surface"
              border="1px solid"
              borderColor="border"
              boxShadow="lg"
              borderRadius="lg"
              p="4"
              display="flex"
              minW="300px"
              maxW="400px"
              gap="3"
              alignItems="flex-start"
            >
              <Box mt="0.5">{ICONS[t.type || "info"]}</Box>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="semibold" color="text.heading" fontFamily="var(--font-body)">
                  {t.title}
                </Text>
                {t.description && (
                  <Text fontSize="sm" color="text.muted" mt="1" fontFamily="var(--font-body)">
                    {t.description}
                  </Text>
                )}
              </Box>
              <Box
                as="button"
                onClick={() => dismissToast(t.id!)}
                color="text.muted"
                ml="2"
                _hover={{ color: "text.heading" }}
                cursor="pointer"
                bg="transparent"
                border="none"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Box>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}
