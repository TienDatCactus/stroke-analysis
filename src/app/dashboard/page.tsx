"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowLeftIcon, ChevronsUpDown, GitMerge } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const data = [
  {
    id: "INV001",
    status: "Paid",
    method: "Credit Card",
    amount: "$250.00",
    details: {
      items: [
        { name: "Consultation", cost: "$100" },
        { name: "Blood Test", cost: "$150" },
      ],
      note: "Payment completed on 2025-07-01",
    },
  },
  // Add more if needed
];

export default function CollapsibleTable() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="h-screen">
      <div className="flex items-center justify-between p-4 ">
        <Link href="/" className="cursor-pointer">
          <Button>
            <ArrowLeftIcon />
            Back to Home
          </Button>
        </Link>
      </div>
      <div className="hfull flex flex-col items-center justify-center">
        <div className="w-full max-w-6xl bg-white p-4 rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#Attempts</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Ratio</TableHead>
                <TableHead>File</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            {data.map((item) => (
              <Collapsible
                key={item.id}
                open={openId === item.id}
                onOpenChange={(open) => setOpenId(open ? item.id : null)}
                asChild
              >
                <TableBody>
                  <TableRow>
                    <TableCell>{item.id}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>{item.method}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell className="text-right">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronsUpDown
                            className={`h-4 w-4 transition-transform ${
                              openId === item.id ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                  </TableRow>

                  <CollapsibleContent asChild>
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="p-2 rounded-md space-y-2 text-sm">
                          <p className="font-semibold text-gray-700">
                            Details:
                          </p>
                          <ul className="list-disc list-inside text-gray-600">
                            {item.details.items.map((detail, i) => (
                              <li key={i}>
                                {detail.name}: {detail.cost}
                              </li>
                            ))}
                          </ul>
                          <p className="text-gray-500 italic">
                            {item.details.note}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </TableBody>
              </Collapsible>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
