"use client";

import Image from "next/image";
import { signOut } from "next-auth/react";

const HomePage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl">Home</h1>
      <form
      action={async () => {
        await signOut()
      }}
    >
      <button type="submit">Sign out</button>
    </form>
    </div>
  );
}

export default HomePage;
