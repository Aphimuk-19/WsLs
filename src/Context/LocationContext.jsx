import React, { createContext, useState, useEffect } from "react";

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [newCells, setNewCells] = useState({});
  const [cellStatus, setCellStatus] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [isChoosingToSplit, setIsChoosingToSplit] = useState(false);

  const fetchCells = async () => {
    try {
      const response = await fetch("http://172.18.43.37:3000/api/cell/cellsAll");
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(`Expected JSON, got ${contentType}: ${text.slice(0, 50)}...`);
      }

      const apiData = await response.json();
      if (!apiData.success || !Array.isArray(apiData.data)) {
        throw new Error("Invalid API response structure");
      }

      const cells = apiData.data;

      const uniqueColumns = [...new Set(cells.map((cell) => cell.col))].sort();
      const uniqueRows = [...new Set(cells.map((cell) => cell.row))].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      );

      const formattedCells = cells.reduce((acc, cell) => {
        if (!acc[cell.col]) acc[cell.col] = [];
        const subCells = [];
        if (cell.divisionType === "dual") {
          subCells.push({ id: `${cell.cellId}-A`, status: cell.subCellsA?.status || 0 });
          subCells.push({ id: `${cell.cellId}-B`, status: cell.subCellsB?.status || 0 });
        }
        acc[cell.col].push({
          row: cell.row,
          subCells: subCells.length > 0 ? subCells : [],
        });
        return acc;
      }, {});

      const formattedStatus = cells.reduce((acc, cell) => {
        acc[cell.cellId] = cell.status;
        if (cell.divisionType === "dual") {
          acc[`${cell.cellId}-A`] = cell.subCellsA?.status || 0;
          acc[`${cell.cellId}-B`] = cell.subCellsB?.status || 0;
        }
        return acc;
      }, {});

      setColumns(uniqueColumns);
      setRows(uniqueRows.filter((row) => parseInt(row) <= 4));
      setNewCells(formattedCells);
      setCellStatus(formattedStatus);
    } catch (error) {
      console.error("Failed to fetch cells:", error.message);
      setColumns([]);
      setRows([]);
      setNewCells({});
      setCellStatus({});
    }
  };

  useEffect(() => {
    fetchCells();
  }, []);

  const handleCellClick = (row, col) => {
    const cellId = `${col}-${row}`;
    const cell = newCells[col]?.find((c) => c.row === row);
    setSelectedCell(cellId);
    if (!cell) {
      setIsChoosingToSplit(true);
    } else {
      setIsChoosingToSplit(false);
    }
  };

  const handleSplitCell = async () => {
    const [col, row] = selectedCell.split("-");
    const cellId = `${col}-${row}`;

    try {
      const checkResponse = await fetch(`http://172.18.43.37:3000/api/cell/cellsAll?cellId=${cellId}`);
      const checkData = await checkResponse.json();
      const cellExists = checkData.success && checkData.data.some((cell) => cell.cellId === cellId);

      if (cellExists) {
        const updatePayload = {
          cellId,
          subCellChoice: "both",
        };
        const updateResponse = await fetch("http://172.18.43.37:3000/api/cell/edit-subcells", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatePayload),
        });

        if (!updateResponse.ok) {
          const errorText = await updateResponse.text();
          throw new Error(`Failed to update cell to dual: ${errorText}`);
        }
      } else {
        const payload = {
          cellId,
          col,
          row,
          status: 1,
          divisionType: "dual",
          subCellsA: { status: 1 },
          subCellsB: { status: 1 },
        };
        const response = await fetch("http://172.18.43.37:3000/api/cell/create/cells", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create split cell: ${errorText}`);
        }
      }

      setNewCells((prevCells) => {
        const updatedCells = { ...prevCells };
        if (!updatedCells[col]) updatedCells[col] = [];
        
        const cellIndex = updatedCells[col].findIndex((c) => c.row === row);
        const newSubCells = [
          { id: `${cellId}-A`, status: 1 },
          { id: `${cellId}-B`, status: 1 },
        ];

        if (cellIndex >= 0) {
          updatedCells[col][cellIndex] = {
            ...updatedCells[col][cellIndex],
            subCells: newSubCells,
          };
        } else {
          updatedCells[col].push({
            row,
            subCells: newSubCells,
          });
        }
        return updatedCells;
      });

      setCellStatus((prevStatus) => ({
        ...prevStatus,
        [cellId]: 0,
        [`${cellId}-A`]: 1,
        [`${cellId}-B`]: 1,
      }));

      setIsChoosingToSplit(false);
      await fetchCells();
    } catch (error) {
      console.error("Failed to split cell:", error.message);
      alert("ไม่สามารถแบ่งเซลล์ได้: " + error.message);
    }
  };

  const handleAddSingleCell = async () => {
    const [col, row] = selectedCell.split("-");
    const cellId = `${col}-${row}`;

    try {
      const checkResponse = await fetch(`http://172.18.43.37:3000/api/cell/cellsAll?cellId=${cellId}`);
      const checkData = await checkResponse.json();
      const cellExists = checkData.success && checkData.data.some((cell) => cell.cellId === cellId);

      if (cellExists) {
        await handleCellStatusChange(cellId, "enabled");
      } else {
        const payload = { cellId, col, row, status: 1 };
        const response = await fetch("http://172.18.43.37:3000/api/cell/create/cells", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Failed to create cell");

        const newCell = { row, column: col, id: cellId, subCells: [] };
        setNewCells((prevCells) => ({
          ...prevCells,
          [col]: prevCells[col] ? [...prevCells[col], newCell] : [newCell],
        }));
        setCellStatus((prevStatus) => ({ ...prevStatus, [cellId]: 1 }));
      }
      setIsChoosingToSplit(false);
      fetchCells();
    } catch (error) {
      console.error("Failed to add single cell:", error.message);
      alert("ไม่สามารถสร้างเซลล์ได้: " + error.message);
    }
  };

  const handleAddCell = async () => {
    try {
      const lastColumn = columns.length > 0 ? columns[columns.length - 1] : "A";
      const currentColumnCells = newCells[lastColumn] || [];
      let newCol, newRow, newCellId;

      if (currentColumnCells.length >= 4) {
        newCol = String.fromCharCode(lastColumn.charCodeAt(0) + 1);
        newRow = "01";
      } else {
        newRow = String(currentColumnCells.length + 1).padStart(2, "0");
        newCol = lastColumn;
      }
      newCellId = `${newCol}-${newRow}`;

      const payload = { cellId: newCellId, col: newCol, row: newRow, status: 0 };
      const response = await fetch("http://172.18.43.37:3000/api/cell/create/cells", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create cell");

      const newCell = { row: newRow, column: newCol, id: newCellId, subCells: [] };
      setNewCells((prevCells) => ({
        ...prevCells,
        [newCol]: prevCells[newCol] ? [...prevCells[newCol], newCell] : [newCell],
      }));
      if (!columns.includes(newCol))
        setColumns((prevColumns) => [...prevColumns, newCol].sort());
      if (!rows.includes(newRow))
        setRows((prevRows) =>
          [...prevRows, newRow].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
        );
      setCellStatus((prevStatus) => ({ ...prevStatus, [newCellId]: 0 }));
      fetchCells();
    } catch (error) {
      console.error("Failed to add cell:", error.message);
    }
  };

  const handleCellStatusChange = async (cellId, action) => {
    const currentStatus = cellStatus[cellId] || 0;
    let newStatus;

    switch (action) {
      case "enabled":
        if (currentStatus === 0 || currentStatus === 2 || currentStatus === 3) newStatus = 1;
        else return;
        break;
      case "disabled":
        if (currentStatus === 1 || currentStatus === 2) newStatus = 3;
        else return;
        break;
      case "reset":
        if (currentStatus !== 0) newStatus = 0;
        else return;
        break;
      case "activate":
        if (currentStatus === 0) {
          setSelectedCell(cellId);
          setIsChoosingToSplit(true);
        }
        return;
      case "full":
        if (currentStatus !== 1) return;
        newStatus = 2;
        break;
      default:
        return;
    }

    setCellStatus((prevStatus) => ({ ...prevStatus, [cellId]: newStatus }));
    console.log(`Updating ${cellId} from ${currentStatus} to ${newStatus}`);

    try {
      const response = await fetch("http://172.18.43.37:3000/api/cell/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cellId, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      await fetchCells();
      setSelectedCell(null);
    } catch (error) {
      console.error("Failed to update cell status:", error.message);
      setCellStatus((prevStatus) => ({ ...prevStatus, [cellId]: currentStatus }));
      alert("ไม่สามารถอัปเดตสถานะได้: " + error.message);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        columns,
        setColumns,
        rows,
        setRows,
        newCells,
        setNewCells,
        cellStatus,
        setCellStatus,
        selectedCell,
        setSelectedCell,
        handleCellClick,
        handleCellStatusChange,
        handleSplitCell,
        handleAddSingleCell,
        handleAddCell,
        isChoosingToSplit,
        setIsChoosingToSplit,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationProvider;