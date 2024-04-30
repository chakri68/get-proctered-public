/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/UxGHFOGXWdq
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { WebCamContext } from "@/providers/WebCamProvider/WebCamProvider";
import { TestContext } from "@/providers/TestProvider/TestProvider";
import { LoginScreen } from "./login-screen";
import toast from "react-hot-toast";

export function StartScreen() {
  const { isRecording, resumeRecording } = useContext(WebCamContext);
  const { startTest, registered, registerUser } = useContext(TestContext);

  if (!registered) {
    return (
      <LoginScreen
        onRegister={(user) => {
          toast.success("Registered successfully");
          registerUser(user.email, user.name);
        }}
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Proctored Test: Introduction
          </CardTitle>
          <CardDescription>
            Please read the instructions carefully before starting the test.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <CameraIcon className="w-6 h-6" />
              <span>Video Recording</span>
            </div>
            {isRecording ? (
              <Badge color="green">Enabled</Badge>
            ) : (
              <Badge
                color="red"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  resumeRecording();
                }}
              >
                Enable
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-6 h-6" />
            <span>Security Protocols</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            size="lg"
            onClick={() => {
              startTest();
            }}
            disabled={!isRecording}
          >
            Start Test
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

function CameraIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}

function ShieldCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
