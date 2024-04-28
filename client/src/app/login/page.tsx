"use client";

import React from "react";
import instance from "@/lib/backend-connect";
import { LoginScreen } from "@/components/login-screen";

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

  return (
    <>
      <LoginScreen onRegister={() => {}} />
    </>
  );
}
