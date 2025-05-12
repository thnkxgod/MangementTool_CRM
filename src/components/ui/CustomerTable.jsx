import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import ThemedTable from "./ThemedTable"; // Import the ThemedTable component
import {
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from "./table"; // ShadCN table components
const CustomerTable = ({
  customers,
  handleDelete,

}) => {
  const [sorted, setSorted] = useState(false);

  // Sort customers by name based on the sort state
  const sortCustomers = (customerList) => {
    return [...customerList].sort((a, b) =>
      sorted ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)
    );
  };

  // Handle sorting toggle
  const handleSort = () => {
    setSorted(!sorted);
  };

  // Apply sorting to the passed-in customers
  const displayedCustomers = sortCustomers(customers);

  return (
    <div className="max-w-full mx-auto">
      <div className="overflow-y-auto max-h-[600px] w-full text-gray-900 shadow-md shadow-gray-300">
        <ThemedTable>
          {({ headerClasses, rowClasses, cellClasses, fontbtnclass }) => (
            <>
              <TableHeader className={headerClasses}>
                <TableRow >
                  <TableHead className={`${headerClasses} text-center`}>ID</TableHead>
                  <TableHead className={headerClasses}>Name</TableHead>
                  <TableHead className={headerClasses}>Email</TableHead>
                  <TableHead  className={headerClasses}>Phone Number</TableHead>
                  <TableHead  className={headerClasses}>Organization</TableHead>
                  <TableHead  className={`${headerClasses} text-center`}>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {displayedCustomers.map((customer) => (
                  <TableRow
                    key={customer.id}
                    onClick={() =>
                      console.log(`Selected customer: ${customer.name}`)
                    }
                    className={rowClasses}
                  >
                    <TableCell className={`${cellClasses} text-center`}>
                      {customer.id}
                    </TableCell>
                    <TableCell className={`${cellClasses} font-semibold`}>
                      {customer.name}
                    </TableCell>
                    <TableCell className={`${cellClasses} lowercase`}>
                      {customer.email}
                    </TableCell>
                    <TableCell className={cellClasses}>
                      {customer.phone_number}
                    </TableCell>
                    <TableCell className={cellClasses}>
                      {customer.organization}
                    </TableCell>
                    <TableCell className={`${cellClasses} text-center`}>
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className={`text-red-500 hover:text-red-800 ${fontbtnclass}`}
                        onClick={() => handleDelete(customer.id)}
                      />
                    </TableCell>
                  </TableRow> 
                ))}
              </TableBody>
            </>
          )}
        </ThemedTable>
      </div>
    </div>
  );
};

// Add PropTypes for validation
CustomerTable.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone_number: PropTypes.string.isRequired,
      organization: PropTypes.string.isRequired,
    })
  ).isRequired,
  handleDelete: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
};

export default CustomerTable;
