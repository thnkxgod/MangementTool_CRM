import PropTypes from "prop-types";
import { Table } from "./table"; // ShadCN table components

// Define the ThemedTable component
const ThemedTable = ({
  children,
  headerClasses = "bg-gray-300 text-left uppercase font-sans text-gray-900 font-bold", // Default theme for header with uppercase and font style
  rowClasses = "hover:bg-white border-b border-gray-300 uppercase font-sans font-semibold", // Default theme for rows with uppercase and font style
  cellClasses = "text-sm uppercase font-sans font-semibold", // Default theme for table cells with uppercase and font style
  fontbtnclass = "cursor-pointer text-lg font-sans uppercase",
}) => {
  return (
    <Table className="w-full table-auto bg-[#f4f9fb] shadow-lg rounded-md">
      {children({ headerClasses, rowClasses, cellClasses, fontbtnclass })}
    </Table>
  );
};

// Add PropTypes for validation
ThemedTable.propTypes = {
  children: PropTypes.func.isRequired,
  headerClasses: PropTypes.string,
  rowClasses: PropTypes.string,
  cellClasses: PropTypes.string,
  fontbtnclass: PropTypes.string,
};

export default ThemedTable;
