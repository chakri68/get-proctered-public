"use client";
import { Button } from "@/components/ui/button";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import instance from "@/lib/backend-connect";
import { useEffect, useRef, useState } from "react";
import { timeSpentFrom } from "../lib/date";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";

export function TestDashboard() {
  const router = useRouter();
  const analytics = useRef<any>(null);

  const [violations, setViolations] = useState<
    {
      test: string;
      testId: string;
      student: string;
      studentId: string;
      violation: string;
      severity: string;
      timestamp: string;
      resolved: boolean;
      idx: number;
    }[]
  >([]);

  const markResolved = (testId: string, userId: string, eventIdx: number) => {
    instance
      .post(`/test/admin/mark-resolved`, {
        testId,
        userId,
        eventIdx,
      })
      .then((res) => {
        toast.success("Maked as resolved successfully");
        console.log(res.data);
        fetchData();
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          toast.error(
            `Failed to mark as resolved - ${err.response?.data.message}`
          );
        } else {
          toast.error("Failed to mark as resolved");
        }
      });
  };

  const unBanUser = (testId: string, userId: string, eventIdx: number) => {
    instance
      .post(`/test/admin/unban`, {
        testId,
        userId,
        eventIdx,
      })
      .then((res) => {
        toast.success("User unbanned successfully");
        console.log(res.data);
        fetchData();
      })
      .catch((err) => {
        if (err instanceof AxiosError) {
          toast.error(`Failed to unban user - ${err.response?.data.message}`);
        } else {
          toast.error("Failed to unban user");
        }
      });
  };
  const [tests, setTests] = useState<any[]>([]);

  const fetchData = async () => {
    const res = await instance.get("/analytics");
    console.log(res.data);
    analytics.current = res.data;
    setViolations(
      res.data.testSessions
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
        )
    );
    const allTests = await instance.get("/dashboardData");
    console.log(allTests.data);
    setTests(allTests.data.tests);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteTest = async (id: string) => {
    await instance.post(`/dashboardData/deleteTest/${id}`);
    fetchData();
  };

  return (
    <main className="flex flex-col gap-4 p-4 md:gap-8 md:p-10">
      <Toaster />
      <section>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Test Management</h1>
          <Button
            size="sm"
            onClick={() => {
              router.push("/dashboard/test/create");
            }}
          >
            Create New Test
          </Button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {tests.map((test, idx) => (
            <Card key={idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">
                  {test.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button size="icon" variant="outline">
                    <FileEditIcon className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      deleteTest(test.id);
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Duration</span>
                    <span className="text-sm">
                      {test.duration ? test.duration : "20"} mins
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Questions</span>
                    <span className="text-sm">
                      {test.questions ? test.questions.length : "0"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Students</span>
                    <span className="text-sm">
                      {test.TestTaker ? test.TestTaker.length : "0"}
                    </span>
                  </div>
                  <Button className="w-full" size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <section>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Violation Management</h1>
          <div className="flex items-center gap-2">
            <Input
              className="w-full max-w-[300px]"
              placeholder="Search violations..."
              type="search"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="outline">
                  <FilterIcon className="h-4 w-4" />
                  <span className="sr-only">Filter</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel>Filter by:</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem>Test</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Student</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>
                  Violation Type
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Severity</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-4 rounded-lg border border-gray-200 shadow-sm dark:border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Violation</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {violations.map((v, idx) => (
                <TableRow key={idx}>
                  <TableCell>{timeSpentFrom(v.timestamp)}</TableCell>
                  <TableCell>{v.test}</TableCell>
                  <TableCell>{v.student}</TableCell>
                  <TableCell>{v.violation}</TableCell>
                  <TableCell>
                    <Badge variant="destructive">{v.severity}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="icon" variant="outline">
                      <EyeIcon className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                    {v.severity === "error" && (
                      <>
                        {" "}
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            markResolved(v.testId, v.studentId, v.idx);
                          }}
                        >
                          <CheckIcon className="h-4 w-4" />
                          <span className="sr-only">Resolve</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="outline"
                          onClick={() => {
                            unBanUser(v.testId, v.studentId, v.idx);
                          }}
                        >
                          <XIcon className="h-4 w-4" />
                          <span className="sr-only">Dismiss</span>
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}

function BellIcon(props: any) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function BookIcon(props: any) {
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
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
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

function FileEditIcon(props: any) {
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
      <path d="M4 13.5V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2h-5.5" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M10.42 12.61a2.1 2.1 0 1 1 2.97 2.97L7.95 21 4 22l.99-3.95 5.43-5.44Z" />
    </svg>
  );
}

function FilterIcon(props: any) {
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
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function Package2Icon(props: any) {
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
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
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

function TrashIcon(props: any) {
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
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
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
