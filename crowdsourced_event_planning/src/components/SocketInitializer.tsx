'use client';

import { useEffect } from "react";

export default function SocketInitializer() {
  useEffect(() => {
    fetch("/api/socket");
  }, []);

  return null;
}