// src/context/LocationContext.jsx
import React, { createContext, useState } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [columns, setColumns] = useState(["A", "B", "C", "D", "E", "F", "G"]);
  const [rows] = useState(["04", "03", "02", "01"]);
  const [newCells, setNewCells] = useState({});
  const [cellStatus, setCellStatus] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [capacity, setCapacity] = useState(1);
  const [popupCapacity, setPopupCapacity] = useState(1);
  const [cellCount, setCellCount] = useState(1);

  const handleAddColumn = () => {
    if (capacity < 1 || capacity > 10) {
      alert("กรุณากำหนดขนาด Capacity ระหว่าง 1 ถึง 10");
      return;
    }

    const newColumn = String.fromCharCode(
      columns[columns.length - 1].charCodeAt(0) + 1
    );
    setColumns([...columns, newColumn]);

    const rowsToAdd = rows.slice(0, 4);
    const availableRows = rowsToAdd
      .map((row, index) => {
        if (index >= 4 - cellCount) {
          return {
            row,
            column: newColumn,
            id: `${row}-${newColumn}`,
            capacity,
          };
        } else {
          return null;
        }
      })
      .filter((cell) => cell !== null);

    setNewCells((prevCells) => ({
      ...prevCells,
      [newColumn]: availableRows,
    }));
  };

  const handleCellClick = (row, col) => {
    const cellId = `${row}-${col}`;
    if (cellStatus[cellId] === "disabled") {
      setCellStatus((prevStatus) => ({
        ...prevStatus,
        [cellId]: "enabled",
      }));
      return;
    }

    if (!newCells[col]?.some((cell) => cell.row === row)) {
      setSelectedCell(cellId);
      setPopupCapacity(1);
    } else {
      setSelectedCell(cellId);
    }
  };

  const handleAddCellToEmptySlot = () => {
    const [row, col] = selectedCell.split("-");
    setNewCells((prevCells) => ({
      ...prevCells,
      [col]: [
        ...(prevCells[col] || []),
        { row, column: col, id: selectedCell, capacity: popupCapacity },
      ],
    }));
    setSelectedCell(null);
  };

  const handleCellStatusChange = (cellId, status) => {
    setCellStatus((prevStatus) => ({
      ...prevStatus,
      [cellId]: status,
    }));
    setSelectedCell(null);
  };

  return (
    <LocationContext.Provider
      value={{
        columns,
        setColumns,
        rows,
        newCells,
        setNewCells,
        cellStatus,
        setCellStatus,
        selectedCell,
        setSelectedCell,
        capacity,
        setCapacity,
        popupCapacity,
        setPopupCapacity,
        cellCount,
        setCellCount,
        handleAddColumn,
        handleCellClick,
        handleAddCellToEmptySlot,
        handleCellStatusChange,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};