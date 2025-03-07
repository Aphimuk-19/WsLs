import React, { createContext, useState, useEffect } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [columns, setColumns] = useState(() => {
    const savedColumns = localStorage.getItem("columns");
    return savedColumns ? JSON.parse(savedColumns) : ["A", "B", "C", "D", "E", "F", "G"];
  });
  const [rows] = useState(["04", "03", "02", "01"]);
  const [newCells, setNewCells] = useState(() => {
    const savedCells = localStorage.getItem("newCells");
    return savedCells ? JSON.parse(savedCells) : {};
  });
  const [cellStatus, setCellStatus] = useState(() => {
    const savedStatus = localStorage.getItem("cellStatus");
    return savedStatus ? JSON.parse(savedStatus) : {};
  });
  const [selectedCell, setSelectedCell] = useState(null);
  const [capacity, setCapacity] = useState(1);
  const [cellCount, setCellCount] = useState(1);
  const [subCellCount, setSubCellCount] = useState(1);
  const [isChoosingToSplit, setIsChoosingToSplit] = useState(false);
  const [isSettingCapacity, setIsSettingCapacity] = useState(false);
  const [isCapacitySet, setIsCapacitySet] = useState(() => {
    const savedCapacitySet = localStorage.getItem("isCapacitySet");
    return savedCapacitySet ? JSON.parse(savedCapacitySet) : {};
  });

  // Persist state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("columns", JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem("newCells", JSON.stringify(newCells));
  }, [newCells]);

  useEffect(() => {
    localStorage.setItem("cellStatus", JSON.stringify(cellStatus));
  }, [cellStatus]);

  useEffect(() => {
    localStorage.setItem("isCapacitySet", JSON.stringify(isCapacitySet));
  }, [isCapacitySet]);

  const handleAddColumn = () => {
    if (capacity < 1 || capacity > 10) {
      alert("กรุณากำหนดขนาด Capacity ระหว่าง 1 ถึง 10");
      return;
    }

    const newColumn = String.fromCharCode(columns[columns.length - 1].charCodeAt(0) + 1);
    setColumns((prevColumns) => [...prevColumns, newColumn]);

    const rowsToAdd = rows.slice(0, cellCount);
    const availableRows = rowsToAdd.map((row) => {
      const cellId = `${newColumn}-${row}`;
      if (subCellCount === 2) {
        return {
          row,
          column: newColumn,
          id: cellId,
          capacity: 0,
          subCells: [
            { id: `${cellId}-1`, capacity },
            { id: `${cellId}-2`, capacity },
          ],
        };
      } else {
        return {
          row,
          column: newColumn,
          id: cellId,
          capacity,
          subCells: [],
        };
      }
    });

    setNewCells((prevCells) => ({
      ...prevCells,
      [newColumn]: availableRows,
    }));

    availableRows.forEach((cell) => {
      setIsCapacitySet((prev) => ({ ...prev, [cell.id]: true }));
    });
  };

  const handleCellClick = (row, col) => {
    const cellId = `${col}-${row}`;
    const cell = newCells[col]?.find((c) => c.row === row);

    setSelectedCell(cellId);
    if (!cell) {
      setIsChoosingToSplit(true);
      setIsSettingCapacity(false);
    } else if (!isCapacitySet[cellId]) {
      setIsChoosingToSplit(false);
      setIsSettingCapacity(true);
    } else {
      setIsChoosingToSplit(false);
      setIsSettingCapacity(false);
    }
  };

  const handleSplitCell = () => {
    const [col, row] = selectedCell.split("-");
    const newCell = {
      row,
      column: col,
      id: selectedCell,
      capacity: 0,
      subCells: [
        { id: `${selectedCell}-1`, capacity: 0 },
        { id: `${selectedCell}-2`, capacity: 0 },
      ],
    };

    setNewCells((prevCells) => {
      const updatedColumn = prevCells[col] ? [...prevCells[col], newCell] : [newCell];
      return {
        ...prevCells,
        [col]: updatedColumn,
      };
    });
    setIsChoosingToSplit(false);
    setTimeout(() => setIsSettingCapacity(true), 0);
  };

  const handleAddSingleCell = () => {
    const [col, row] = selectedCell.split("-");
    const newCell = {
      row,
      column: col,
      id: selectedCell,
      capacity: 0,
      subCells: [],
    };

    setNewCells((prevCells) => {
      const updatedColumn = prevCells[col] ? [...prevCells[col], newCell] : [newCell];
      return {
        ...prevCells,
        [col]: updatedColumn,
      };
    });
    setIsChoosingToSplit(false);
    setTimeout(() => setIsSettingCapacity(true), 0);
  };

  const handleSetSubCellCapacity = (cellId, capacity1, capacity2) => {
    const [col] = cellId.split("-");
    setNewCells((prevCells) => {
      const updatedCells = { ...prevCells };
      const cellIndex = updatedCells[col]?.findIndex((c) => c.id === cellId);
      if (cellIndex !== -1) {
        updatedCells[col][cellIndex] = {
          ...updatedCells[col][cellIndex],
          subCells: [
            { id: `${cellId}-1`, capacity: capacity1 },
            { id: `${cellId}-2`, capacity: capacity2 },
          ],
          capacity: capacity1 + capacity2,
        };
      }
      return updatedCells;
    });
    setIsCapacitySet((prev) => ({ ...prev, [cellId]: true }));
    setIsSettingCapacity(false);
    setSelectedCell(null);
  };

  const handleSetSingleCellCapacity = (cellId, capacity) => {
    const [col] = cellId.split("-");
    setNewCells((prevCells) => {
      const updatedCells = { ...prevCells };
      const cellIndex = updatedCells[col]?.findIndex((c) => c.id === cellId);
      if (cellIndex !== -1) {
        updatedCells[col][cellIndex] = {
          ...updatedCells[col][cellIndex],
          capacity,
        };
      }
      return updatedCells;
    });
    setIsCapacitySet((prev) => ({ ...prev, [cellId]: true }));
    setIsSettingCapacity(false);
    setSelectedCell(null);
  };

  const handleCellStatusChange = (cellId, status) => {
    const [col] = cellId.split("-");
    const cell = newCells[col]?.find((c) => c.id === cellId);

    if (status === "disabled") {
      if (!cell || !isCapacitySet[cellId]) {
        console.log("Cannot disable: Cell has no capacity set");
        return;
      }
      if (cellStatus[cellId] === "disabled") {
        console.log("Cell is already disabled");
        return;
      }
    }

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
        cellCount,
        setCellCount,
        subCellCount,
        setSubCellCount,
        handleAddColumn,
        handleCellClick,
        handleCellStatusChange,
        handleSetSubCellCapacity,
        handleSplitCell,
        handleAddSingleCell,
        handleSetSingleCellCapacity,
        isChoosingToSplit,
        setIsChoosingToSplit,
        isSettingCapacity,
        setIsSettingCapacity,
        isCapacitySet,
        setIsCapacitySet,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};