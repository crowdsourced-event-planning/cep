"use server";

import { IInput } from "./page";

export default async function doRegister(input: IInput) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/register`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(input),
        cache: "no-store",
      }
    );

    console.log(res, "<<<<< res doRegister");

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message,
      };
    }

    return {
      success: true,
      message: "Registration successful!",
    };
  } catch {
    return {
      success: false,
      message: "Network error occurred",
    };
  }
}
