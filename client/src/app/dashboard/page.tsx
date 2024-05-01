import { TestDashboard } from "@/components/test-dashboard";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import instance from "@/lib/backend-connect";

export default async function DashboardPage() {
  const res = await instance.get("/analytics");
  const violations = res.data.testSessions
    .map((t: any) =>
      t.events.map((e: any, idx: number) => ({
        ...e,
        testId: t.test.id,
        test: t.test.name,
        studentId: t.user.id,
        student: t.user.name,
        violation: e.code,
        severity: e.severity,
        timestamp: e.timestamp,
        idx,
      }))
    )
    .flat()
    .filter((e: any) => e.resolved === false)
    .toSorted(
      (a: any, b: any) =>
        new Date(b.timestamp as string).getTime() -
        new Date(a.timestamp as string).getTime()
    );
  const allTests = await instance.get("/dashboardData");
  const tests = allTests.data.testsWithAverage;

  return (
    <>
      <Header />
      <TestDashboard tests={tests} violations={violations} />
      <Footer />
    </>
  );
}
