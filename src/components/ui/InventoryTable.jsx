import PropTypes from "prop-types";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./table"; // Adjust the import based on your structure
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons"; // Import trash and edit icons
import ThemedTable from "./ThemedTable"; // Import the ThemedTable component

const ItemTable = ({
  paginatedItems,
  handleItemClick,
  handleRemove,
  handleEdit,
}) => {
  return (
    <div className="max-w-full mx-auto p-4">
      {/* Table Container */}
      <div className="overflow-y-auto max-h-[600px] w-full  shadow-md shadow-gray-300">
        <ThemedTable>
          {({ headerClasses, rowClasses, cellClasses,fontbtnclass, }) => (
            <>
              {/* Table Header */}
              <TableHeader>
                <TableRow className={headerClasses}>
                  <TableHead className={`${headerClasses} `}>
                    Product Name
                  </TableHead>
                  <TableHead className={`${headerClasses} `}>
                  Dimension
                  </TableHead>
                  <TableHead className={`${headerClasses} `}>Action</TableHead>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => handleItemClick(item)}
                    className={rowClasses}
                  >
                    {/* Product Name Cell */}
                    <TableCell className={`${cellClasses} font-semibold`}>
                      {item.pname}
                    </TableCell>

                    {/* Product Name Cell */}
                    <TableCell className={`${cellClasses} `}>
                      {item.dimension}
                    </TableCell>

                    {/* Action Icon Cell */}
                    <TableCell className={`${cellClasses} flex gap-5 `}>
                      {/* Edit Icon */}
                      <FontAwesomeIcon
                        icon={faEdit}
                        className={`text-gray-800 hover:text-gray-600 cursor-pointer ${fontbtnclass}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents triggering row click event
                          handleEdit(item.id);
                        }}
                      />

                      {/* Trash Icon */}
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className={`text-red-500 hover:text-red-800 cursor-pointer ${fontbtnclass}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents triggering row click event
                          handleRemove(item.id);
                        }}
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

ItemTable.propTypes = {
  paginatedItems: PropTypes.array.isRequired,
  handleItemClick: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
};

export default ItemTable;
