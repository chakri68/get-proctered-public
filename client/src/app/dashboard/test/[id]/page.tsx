import { TestDetailsTable } from "@/components/TestDetailsTable";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import instance from "@/lib/backend-connect";

export default async function TestDetails({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  // @ts-ignore
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
  const res = await instance.get(`/dashboardData/getTest/${id}`);
  console.log(res.data.testSessions);
  const data = res.data.testSessions;
  data.sort((a: any, b: any) => b.marks - a.marks);
  const averageScore =
    data.reduce((acc: any, curr: any) => acc + curr.marks, 0) / data.length;
  const averageDur =
    data.reduce(
      (acc: any, curr: any) =>
        acc +
        (curr.startTime
          ? (new Date(curr.endTime).getTime() -
              new Date(curr.startTime).getTime()) /
            (1000 * 60)
          : 0),
      0
    ) / data.length;
  return (
    <>
      <Header />
      <section>
        <div className="flex items-center justify-between mt-4 ml-4">
          <h1 className="text-2xl font-bold">Test Details </h1>
        </div>
        <TestDetailsTable
          averageDuration={averageDur}
          averageMarks={averageScore}
          students={data}
        />
      </section>
      <Footer />
    </>
  );
}
