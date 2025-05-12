import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import ThemedTable from "./ThemedTable"; // Import the ThemedTable component
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "./table"; // ShadCN Table components
import { useNavigate } from "react-router-dom"; 

const OrdersTable = ({
  orders = [],
  customers,
  handleCopyUrl,
  handleRemove,
}) => {
  const navigate = useNavigate();

  const handleRowClick = (orderId) => {
    navigate(`/orders/${orderId}`); // Navigate to the order details page
  };

  return (
    <div className="max-w-full mx-auto">
      <div className="scrollbar-hide  max-h-[600px] w-full shadow-md shadow-gray-300">
        <div className="overflow-x-auto bg-gray-100">
          <ThemedTable>
            {({ headerClasses, rowClasses, cellClasses, fontbtnclass }) => (
              <Table className="min-w-full sm:min-w-[1000px]">
                <TableHeader className={headerClasses}>
                  <TableRow className="">
                    <TableHead  className={`${headerClasses} text-center`}>Order ID</TableHead>
                    <TableHead className={`${headerClasses} text-center`}>Customer ID</TableHead>
                    <TableHead className={`${headerClasses} text-left`}>Customer Name</TableHead>
                    <TableHead className={`${headerClasses} text-left`}>Status</TableHead>
                    <TableHead className={`${headerClasses} text-left`}>Total Amount</TableHead>
                    {/*                     <TableHead className="text-left">Description</TableHead> */}
                    <TableHead className={`${headerClasses} text-left`}>Created At</TableHead>
                    <TableHead className={`${headerClasses} text-center`}>Actions</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <TableRow
                        key={order.id}
                        className={`${rowClasses} hover:bg-white`}
                        onClick={() => handleRowClick(order.id)} // Navigate on row click
                      >
                        <TableCell className={`${cellClasses} text-center`}>
                          {order.id}
                        </TableCell>
                        <TableCell className={`${cellClasses} text-center`}>
                          {order.customer_id}
                        </TableCell>
                        <TableCell
                          className={`${cellClasses} font-semibold text-left`}
                        >
                          {customers[order.customer_id] || "Unknown"}
                        </TableCell>
                        <TableCell className={`${cellClasses} text-left`}>
                          {order.status}
                        </TableCell>
                        <TableCell className={`${cellClasses} text-left`}>
                          ${order.total_amount}
                        </TableCell>
                        {/* </TableCell> */}
                        <TableCell className={`${cellClasses} text-left`}>
                          {new Date(order.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell className={`${cellClasses} text-left`}>
                          <div className="flex flex-row items-center justify-center gap-5">
                            <FontAwesomeIcon
                              icon={faClipboard}
                              className={`${fontbtnclass} text-gray-600 hover:text-black cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent navigation on action click
                                handleCopyUrl(order.id);
                              }}
                              title="Copy URL"
                            />
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              className={`${fontbtnclass} text-red-500 hover:text-red-800 cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent navigation on action click
                                handleRemove(order.id);
                              }}
                              title="Remove Order"
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No orders found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </ThemedTable>
        </div>
      </div>
    </div>
  );
};

// Add PropTypes validation
OrdersTable.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      customer_id: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      total_amount: PropTypes.number.isRequired,
      order_description: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
    })
  ),
  customers: PropTypes.objectOf(PropTypes.string).isRequired,
  handleCopyUrl: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default OrdersTable;
