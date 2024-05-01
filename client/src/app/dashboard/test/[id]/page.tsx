"use client";
import { TestDetailsTable } from "@/components/TestDetailsTable";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import { useParams } from "next/navigation";

export default function TestDetails() {
  const { id } = useParams();
  return (
    <>
      <Header />
      <section>
        <div className="flex items-center justify-between mt-4 ml-4">
          <h1 className="text-2xl font-bold">Test Details </h1>
        </div>
      <TestDetailsTable />
      </section>
      <Footer />
    </>
  );
}
