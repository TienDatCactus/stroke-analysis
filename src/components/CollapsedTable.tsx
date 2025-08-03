import { TableCell, TableRow } from "./ui/table";
const CollapsedTable = ({ id }: { id: number }) => {
  return (
    <TableRow>
      <TableCell colSpan={5}>
        <div className="bg-gray-50 p-4 rounded-md text-sm space-y-2">
          <p className="font-semibold">Invoice #{id} details:</p>
          <ul className="list-disc list-inside">
            <li>Consultation - $100</li>
            <li>Medication - $150</li>
          </ul>
          <p className="text-gray-500">Payment received on 2025-07-01.</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CollapsedTable;
