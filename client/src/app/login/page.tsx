"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import instance from "@/lib/backend-connect";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const res = await instance.put("auth/login", {
      email: "chakridevireddy69@gmail.com",
    });
    setLoading(false);
    console.log(res.data);
  };

  const [email, setEmail] = React.useState("");

  return (
    <>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button disabled={loading} onClick={() => handleLogin()}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Login"}
      </Button>
    </>
  );
}
