import React from "react";
import PropTypes from "prop-types";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  Image,
  Box,
  Text,
  Checkbox,
  Tooltip,
  Select
} from "@chakra-ui/react";
import { clickButtonHover, examStatuses, batchStatus, studentStatus } from "../../utils/Strings";
import ClickButton from "../button/OnClickButton";

function ReusableTable({
  columns,
  rows,
  actions = [],
  showCheckboxes = false,
  onCheckboxChange,
  checkedIds,
  handleStatusChange,
  handleViewReport,
}) {
  const showActionsColumn = actions.length > 0;

  const renderCellContent = (row, column) => {

    if (column.field === 'profile_pic') {
      return (
        <Image
          src={"imageUrl" + row[column.field]}
          alt="Profile"
          boxSize="60px"
          borderRadius="full"
        />
      );
    } else if (column.field === "batch_status") {

      const statusObj = batchStatus.find(status => status.id === row.batch_status);

      if (statusObj && statusObj.value === "OPENED") {
        return (
          <Select
            width="70%"
            value={row.batch_status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            data-testid={`select-status`}
          >
            {batchStatus.map((status) => {
              return (
                <option
                  key={status.id}
                  value={status.id}
                >
                  {status.value}
                </option>
              );
            })}
          </Select>
        );
      } else {
        return (
          <Text>{statusObj ? statusObj.value : 'Unknown Status'}</Text>
        );
      }
    } else if (column.field === "status") {

      if (row.status === "Terminated") {
        return (
          <Select
            width="70%"
            value={row.status}
            onChange={(e) => handleStatusChange(row.id)}
            data-testid={`select-status`}
          >
            {studentStatus.map((status) => {
              return (
                <option
                  key={status.id}
                  value={status.id}
                >
                  {status.value}
                </option>
              );
            })}
          </Select>
        );
      } else {
        return row[column.field];
      }
    } else {
      return row[column.field];
    }
  };

  return (
    <Box display="flex" justifyContent="center" width="100%">
      <TableContainer
        maxW="90%"
        minW="100%"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
        overflowX="auto"
      >
        <Table variant="striped">
          <Thead bg="white">
            <Tr>
              {showCheckboxes && <Th></Th>}
              {columns.map((column) => (
                <Th
                  key={column.field}
                  fontWeight="bold"
                  whiteSpace="nowrap"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  py={5}
                >
                  {column.headerName}
                </Th>
              ))}
              {showActionsColumn && (
                <Th fontWeight="bold">Actions</Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <Tr key={row.id} _hover={{ backgroundColor: "rgba(0, 0, 0, 0.08)" }}>
                  {showCheckboxes && (
                    <Td>
                      <Checkbox
                        size="lg"
                        aria-label={`Select ${row.id}`}
                        backgroundColor="white"
                        isChecked={checkedIds.includes(row.id)}
                        onChange={(e) => onCheckboxChange(e, row.id)}
                      />
                    </Td>
                  )}
                  {columns.map((column) => (
                    <Td
                      key={`${row.id}-${column.field}`}
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      maxWidth="150px"
                    >
                      <Tooltip label={row[column.field]} bg="white" textColor="black" placement="top">
                        <Box
                          as="span"
                          display="block"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                        >
                          {renderCellContent(row, column)}
                        </Box>
                      </Tooltip>
                    </Td>
                  ))}
                  {showActionsColumn && (
                    <Td>
                      {actions.map((action) => {
                        const isDisabled =
                          typeof action.disabled === "function"
                            ? action.disabled(row)
                            : action.disabled;

                        const iconWithSize = React.cloneElement(action.icon, {
                          color: action.color,
                          fontSize: "24px",
                        });

                        return (
                          <React.Fragment key={action.label}>
                            <Button
                              ml={1}
                              aria-label={action.label}
                              bg="None"
                              title={action.label}
                              colorScheme={action.color}
                              _hover={{ bg: action.hoverColor }}
                              onClick={() => action.onClick(row.id)}
                              size="xl"
                              leftIcon={iconWithSize}
                              isDisabled={isDisabled}
                            />

                            {/* Conditionally render the View Report button only for completed status */}
                            {(row.status === "Completed" || row.status === "Shortlisted") && (
                              <ClickButton
                                _hover={{ bg: clickButtonHover, color: "white" }}
                                variant="outline"
                                label="View Report"
                                onClick={() => handleViewReport(row.id)}
                              >
                                View Report
                              </ClickButton>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </Td>
                  )}
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={columns.length + (showActionsColumn ? 1 : 0)}>
                  <Text textAlign="center" fontSize="lg" color="blue">
                    No data available
                  </Text>
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}

ReusableTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string.isRequired,
      headerName: PropTypes.string.isRequired,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  showCheckboxes: PropTypes.bool,
  onCheckboxChange: PropTypes.func,
  checkedIds: PropTypes.array,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      hoverColor: PropTypes.string,
      icon: PropTypes.element.isRequired,
      onClick: PropTypes.func.isRequired,
      disabled: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    })
  ),
  handleStatusChange: PropTypes.func,
};

export default ReusableTable;