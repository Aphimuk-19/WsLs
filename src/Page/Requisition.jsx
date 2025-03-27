import React, { useState, useEffect } from "react";
import RequisitionTab from "../Custom/RequisitionTab";
import HistoryTab from "../Custom/HistoryTab";
import ProductEntryTab from "../Custom/ProductEntryTab";

const Requisition = () => {
  const [activeTab, setActiveTab] = useState("requisition");

  // Requisition State
  const [requisitionData, setRequisitionData] = useState([]);
  const [quantities, setQuantities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRequisitionData, setFilteredRequisitionData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // History State (unchanged)
  const [historySearchValue, setHistorySearchValue] = useState("");
  const [filteredHistoryData, setFilteredHistoryData] = useState([]);

  // Product Entry State (unchanged)
  const [entrySearchValue, setEntrySearchValue] = useState("");
  const [filteredEntryData, setFilteredEntryData] = useState([]);

  // Static Data for History (unchanged)
  const historyData = [
    {
      key: "1",
      requisitionNumber: "846065",
      date: "1/มีนา/2567",
      products: [
        { name: "ASUS VIVOBOOK", quantity: 10 },
        { name: "ACER ASPIRE 3", quantity: 2 },
      ],
    },
    {
      key: "2",
      requisitionNumber: "846075",
      date: "1/มีนา/2567",
      products: [{ name: "ACER ASPIRE 3", quantity: 5 }],
    },
    {
      key: "3",
      requisitionNumber: "846085",
      date: "1/มีนา/2567",
      products: [
        { name: "ASUS VIVOBOOK", quantity: 1 },
        { name: "ACER ASPIRE 3", quantity: 2 },
      ],
    },
  ];

  // Static Data for Product Entry (unchanged)
  const productEntryData = [
    {
      key: "1",
      entryNumber: "ENT-001",
      date: "1/มกรา/2567",
      products: [
        { name: "ASUS VIVOBOOK", quantity: 20 },
        { name: "ACER ASPIRE 3", quantity: 10 },
      ],
    },
    {
      key: "2",
      entryNumber: "ENT-002",
      date: "15/กุมภา/2567",
      products: [{ name: "ASUS VIVOBOOK", quantity: 15 }],
    },
    {
      key: "3",
      entryNumber: "ENT-003",
      date: "20/มีนา/2567",
      products: [
        { name: "ACER ASPIRE 3", quantity: 5 },
        { name: "LENOVO IDEAPAD", quantity: 8 },
      ],
    },
  ];

  // Fetch Requisition Data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://172.18.43.37:3000/api/cell/cellsAll");
        const data = await response.json();

        // Format the API data to match the expected structure
        const formattedData = data.map((item, index) => ({
          key: String(index + 1),
          no: String(index + 1),
          id: item.id || `#${index + 876364}`, // Fallback ID
          type: item.type || "Unknown",
          name: item.name || "Unknown",
          image: item.image || "https://via.placeholder.com/40", // Default image
          location: item.location || "Unknown",
          in: item.in || "N/A",
          end: item.end || "N/A",
          quantity: item.quantity || 0,
        }));

        setRequisitionData(formattedData);
        setFilteredRequisitionData(formattedData);
        setQuantities(formattedData.map(() => 0)); // Initialize quantities
        setLoading(false);
      } catch (error) {
        console.error("Error fetching requisition data:", error);
        setLoading(false);
        // Optionally, set fallback data if API fails
        setRequisitionData([]);
        setFilteredRequisitionData([]);
        setQuantities([]);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <div className="flex items-center justify-start gap-6 mb-3 w-full ml-[14rem]">
        <button
          onClick={() => setActiveTab("requisition")}
          className={`text-xl font-bold ${
            activeTab === "requisition"
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-black"
          }`}
        >
          เบิกสินค้า
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`text-xl font-bold ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-black"
          }`}
        >
          ประวัติการเบิก
        </button>
        <button
          onClick={() => setActiveTab("productEntry")}
          className={`text-xl font-bold ${
            activeTab === "productEntry"
              ? "text-blue-600 border-b-2 border-blue-600 pb-1"
              : "text-black"
          }`}
        >
          ประวัติการเข้าข้อมูลสินค้า
        </button>
      </div>

      <div className="w-[1400px] h-[1px] bg-[#dcdcdc] mb-4"></div>

      {loading && activeTab === "requisition" && (
        <div>Loading requisition data...</div>
      )}

      {!loading && activeTab === "requisition" && (
        <RequisitionTab
          requisitionData={requisitionData}
          quantities={quantities}
          setQuantities={setQuantities}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredRequisitionData={filteredRequisitionData}
          setFilteredRequisitionData={setFilteredRequisitionData}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      )}

      {activeTab === "history" && (
        <HistoryTab
          historyData={historyData}
          historySearchValue={historySearchValue}
          setHistorySearchValue={setHistorySearchValue}
          filteredHistoryData={filteredHistoryData}
          setFilteredHistoryData={setFilteredHistoryData}
        />
      )}

      {activeTab === "productEntry" && (
        <ProductEntryTab
          productEntryData={productEntryData}
          entrySearchValue={entrySearchValue}
          setEntrySearchValue={setEntrySearchValue}
          filteredEntryData={filteredEntryData}
          setFilteredEntryData={setFilteredEntryData}
        />
      )}
    </div>
  );
};

export default Requisition;