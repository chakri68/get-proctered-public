"use client";
import { Badge } from "@/components/ui/badge";

import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import instance from "@/lib/backend-connect";

type student = {
  user: {
    name: string;
    email: string;
  };
  violations: number;
  marks: number;
};
export function TestDetailsTable({
  students,
  averageMarks,
  averageDuration,
}: {
  students: student[];
  averageMarks: number;
  averageDuration: number;
}) {
  return (
    <>
      <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:gap-8">
          <div className="flex justify-around w-full gap-2">
            <div>
              <span className="font-bold">Average Marks: </span>
              <span>{averageMarks.toFixed(2)}</span>
            </div>
            <div>
              <span className="font-bold">Average Duration: </span>
              <span>{averageDuration.toFixed(2)} mins</span>
            </div>
            <div>
            <span className="font-bold">Highest Marks: </span>
              <span>{students[0].marks}</span>
            </div>
            <div>
            <span className="font-bold">Lowest Marks: </span>
              <span>{students[students.length-1].marks}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-gray-200 shadow-sm dark:border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S No.</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Student Email</TableHead>
                <TableHead>Violations</TableHead>
                <TableHead>Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students &&
                students.map((v: student, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{v.user.name}</TableCell>
                    <TableCell>{v.user.email}</TableCell>
                    <TableCell>
                      <Badge>{v.violations}</Badge>
                    </TableCell>
                    <TableCell>{v.marks}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </>
  );
}

function XIcon(props: any) {
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
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function EyeIcon(props: any) {
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
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CheckIcon(props: any) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
