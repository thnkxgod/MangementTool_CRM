/* import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableFooter,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
]; */

const DashboardContent = () => {
  return (
    <div className="p-6 bg-background w-full dark:bg-background-dark">
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard Page</h1>
        <p>Here you can manage your Dashboard.</p>
        {/* Add additional settings options */}
      </div>
      {/* <Table className="w-full">
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] bg-gray-200 dark:bg-gray-700">Invoice</TableHead>
            <TableHead className="bg-gray-200 dark:bg-gray-700">Status</TableHead>
            <TableHead className="bg-gray-200 dark:bg-gray-700">Method</TableHead>
            <TableHead className="text-right bg-gray-200 dark:bg-gray-700">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell className="font-medium bg-white dark:bg-gray-800">{invoice.invoice}</TableCell>
              <TableCell className="bg-white dark:bg-gray-800">{invoice.paymentStatus}</TableCell>
              <TableCell className="bg-white dark:bg-gray-800">{invoice.paymentMethod}</TableCell>
              <TableCell className="text-right bg-white dark:bg-gray-800">{invoice.totalAmount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3} className="bg-gray-200 dark:bg-gray-700">Total</TableCell>
            <TableCell className="text-right bg-gray-200 dark:bg-gray-700">$2,500.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table> */}
    </div>
  );
};

export default DashboardContent;
