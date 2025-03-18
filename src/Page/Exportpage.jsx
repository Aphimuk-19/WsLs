import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, PDFDownloadLink } from "@react-pdf/renderer";

// ลงทะเบียนฟอนต์ภาษาไทย
Font.register({
  family: "THSarabunNew",
  fonts: [
    { src: "/public/THSarabunNew/THSarabunNew.ttf" },
    { src: "/public/THSarabunNew/THSarabunNew Bold.ttf", fontWeight: "bold" },
    { src: "/public/THSarabunNew/THSarabunNew BoldItalic.ttf", fontWeight: "bold", fontStyle: "italic" },
    { src: "/public/THSarabunNew/THSarabunNew Italic.ttf", fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingLeft: 48, // 4rem ≈ 48pt
    paddingRight: 48,
    paddingTop: 24,
    paddingBottom: 24,
    fontFamily: "THSarabunNew",
    backgroundColor: "#fff",
  },
  header: {
    textAlign: "center",
    marginBottom: 10, // mb-5 ≈ 20pt
  },
  title: {
    fontSize: 70, // ปรับจาก 54pt เป็น 70pt
    fontWeight: "bold",
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 18, // ปรับจาก 13.5pt เป็น 18pt
    marginTop: 4,
    lineHeight: 1.2,
  },
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24, // mb-6 ≈ 24pt
    fontSize: 14, // ปรับจาก 10.5pt เป็น 14pt
    lineHeight: 1.4,
  },
  line: {
    width: "100%",
    height: 0.75,
    backgroundColor: "#DCDCDC",
    marginVertical: 12, // ปรับจาก 24 เป็น 12
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 14, // ปรับจาก 10.5pt เป็น 14pt
    fontWeight: "bold",
    marginBottom: 8, // mb-2 ≈ 8pt
    lineHeight: 1.4,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 14, // 
    marginBottom: 8, // 
    lineHeight: 1.4,
  },
  tableColumn1: {
    width: 64, 
    textAlign: "center",
  },
  tableColumn2: {
    flex: 1,
    textAlign: "center",
  },
  tableColumn3: {
    width: 64, 
    textAlign: "right",
  },
  tableLine: {
    width: "100%",
    height: 0.75, 
    backgroundColor: "#000000", 
    marginVertical: 8, 
  },
  footer: {
    marginTop: 80, 
    textAlign: "right",
    fontSize: 14, 
    lineHeight: 1.4,
  },
  footerText: {
    marginBottom: 12, 
  },
});

const MyDocument = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>J.I.B</Text>
        <Text style={styles.subtitle}>ใบเบิกสินค้า</Text>
      </View>
      <View style={styles.infoSection}>
        <View>
          <Text>สาขา: สาขาใหญ่</Text>
          <Text>หัวข้อ: เบิกทรัพย์สิน</Text>
        </View>
        <View style={{ textAlign: "right" }}>
          <Text>เลขที่ใบเบิก: ASDF1234567</Text>
          <Text>วันที่: 12/3/2025</Text>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.tableHeader}>
        <Text style={styles.tableColumn1}>ลำดับ</Text>
        <Text style={styles.tableColumn2}>รายการ</Text>
        <Text style={styles.tableColumn3}>จำนวน</Text>
      </View>
      <View style={styles.tableLine} />
      {data.map((row, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.tableColumn1}>{index + 1}</Text>
          <Text style={styles.tableColumn2}>{row.item}</Text>
          <Text style={styles.tableColumn3}>{row.quantity}</Text>
        </View>
      ))}
      <View style={styles.tableLine} />
      <View style={styles.footer}>
        <Text style={styles.footerText}>ชื่อ .......................................................</Text>
        <Text>วันที่ .............../................./.................</Text>
      </View>
    </Page>
  </Document>
);

function ExportPage() {
  const data = [
    { item: "Asus Vivobook", quantity: 5 },
    { item: "Asus Vivobook", quantity: 10 },
    { item: "Dell XPS", quantity: 3 },
    { item: "MacBook Pro", quantity: 2 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="mb-5 flex gap-3 items-center justify-end m-3">
        <PDFDownloadLink
          document={<MyDocument data={data} />}
          fileName="ใบเบิกสินค้า.pdf"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {({ loading }) => (loading ? "กำลังสร้าง PDF..." : "Export PDF")}
        </PDFDownloadLink>
      </div>
      <div
        className="mx-auto bg-white shadow-lg p-6"
        style={{
          width: "210mm",
          minHeight: "297mm",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          padding: "0 4rem",
        }}
      >
        <header className="text-center mb-5">
          <h1 className="text-[72px] font-bold">J.I.B</h1>
          <p className="text-lg">ใบเบิกสินค้า</p>
        </header>
        <div className="flex justify-between mb-6">
          <div>
            <p>สาขา: สาขาใหญ่</p>
            <p>หัวข้อ: เบิกทรัพย์สิน</p>
          </div>
          <div className="text-right">
            <p>เลขที่ใบเบิก: ASDF1234567</p>
            <p>วันที่: 12/3/2025</p>
          </div>
        </div>
        <div className="w-full h-[1px] bg-gray-300 my-6" />
        <div className="flex justify-between mb-2 font-bold">
          <p className="w-16 text-center">ลำดับ</p>
          <p className="flex-1 text-center">รายการ</p>
          <p className="w-16 text-right">จำนวน</p>
        </div>
        <div className="w-full h-[1px] bg-black my-4" />
        {data.map((row, index) => (
          <div key={index} className="flex justify-between mb-2 text-sm">
            <p className="w-16 text-center">{index + 1}</p>
            <p className="flex-1 text-center">{row.item}</p>
            <p className="w-16 text-right">{row.quantity}</p>
          </div>
        ))}
        <div className="w-full h-[1px] bg-black my-6" />
        <div className="flex flex-col items-end text-right gap-3 mt-20">
          <p>ชื่อ ...............................................</p>
          <p>วันที่ ............/............/................</p>
        </div>
      </div>
    </div>
  );
}

export default ExportPage;