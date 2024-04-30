"use client";
import { TestDetailsTable } from "@/components/TestDetailsTable";

import { useParams } from "next/navigation";

export default function TestDetails() {
  const { id } = useParams();
  return (
    <>
      <div>Hi Welcome to the test details {id}</div>
      <TestDetailsTable />
    </>
  );
}
