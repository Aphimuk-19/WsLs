import React from "react";
import { Card, Row, Col, Typography } from "antd";
const { Title, Text } = Typography;

const ProductInOut = () => {
  return (
    <div style={{ width: 478, height: 344, position: "relative" }}>
      {/* Card หลัก */}
      <Card
        style={{
          width: 478,
          height: 344,
          borderRadius: 10,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 0,
          background: "#fff",
        }}
      />
      <Card
        style={{
          width: 341,
          height: 331,
          borderRadius: 10,
          position: "absolute",
          top: 1,
          left: 68,
          zIndex: 10,
          background: "#fff",
        }}
      />

      {/* เส้นแบ่ง */}
      <div
        style={{
          width: 301,
          height: 1,
          border: "1px solid #000",
          position: "absolute",
          top: 172,
          left: 88,
          zIndex: 20,
        }}
      />

      {/* SVG ลูกศรสีแดง (สินค้าออก) */}
      <div style={{ position: "absolute", top: 70, left: 40, zIndex: 30 }} data-svg-wrapper>
        <svg
          width="49"
          height="97"
          viewBox="0 0 49 97"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_202_2037)">
            <path
              d="M24.0001 -3.48091e-05L4.10059 35.1759L44.5136 34.8214L24.0001 -3.48091e-05ZM28.2718 87.9659L27.7762 31.4681L20.7765 31.5295L21.2721 88.0273L28.2718 87.9659Z"
              fill="#FA161A"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_202_2037"
              x="0.100601"
              y="0"
              width="48.413"
              height="96.0273"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_202_2037"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_202_2037"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* SVG ลูกศรสีน้ำเงิน (สินค้าเข้า) */}
      <div style={{ position: "absolute", top: 177, left: 40, zIndex: 30 }} data-svg-wrapper>
        <svg
          width="49"
          height="97"
          viewBox="0 0 49 97"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_d_202_2038)">
            <path
              d="M24 89L44.6037 54.2319L4.19175 53.7726L24 89ZM21.5002 0.96023L20.8582 57.4623L27.8577 57.5418L28.4998 1.03977L21.5002 0.96023Z"
              fill="#1666FA"
            />
          </g>
          <defs>
            <filter
              id="filter0_d_202_2038"
              x="0.191742"
              y="0.960205"
              width="48.4119"
              height="96.0398"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                result="hardAlpha"
              />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow_202_2038"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect1_dropShadow_202_2038"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>

      {/* ข้อความต่างๆ */}
      <Text
        style={{
          position: "absolute",
          top: 140,
          left: 100,
          fontSize: 40,
          fontWeight: "bold",
          fontFamily: "Nunito",
          color: "#000",
        }}
      >
        250
      </Text>
      <Text
        style={{
          position: "absolute",
          top: 140,
          left: 150,
          fontSize: 40,
          fontWeight: "normal",
          fontFamily: "Nunito",
          color: "#000",
        }}
      >
        in
      </Text>
      <Text
        style={{
          position: "absolute",
          top: 245,
          left: 100,
          fontSize: 40,
          fontWeight: "bold",
          fontFamily: "Nunito",
          color: "#000",
        }}
      >
        150
      </Text>
      <Text
        style={{
          position: "absolute",
          top: 245,
          left: 150,
          fontSize: 40,
          fontWeight: "normal",
          fontFamily: "Nunito",
          color: "#000",
        }}
      >
        out
      </Text>
      <Title
        level={4}
        style={{
          position: "absolute",
          top: 20,
          left: 100,
          fontSize: 20,
          fontWeight: "bold",
          fontFamily: "Nunito",
          color: "#000",
        }}
      >
        สินค้าเข้าและออก
      </Title>
      <Text
        style={{
          position: "absolute",
          top: 180,
          left: 100,
          fontSize: 20,
          fontWeight: "normal",
          fontFamily: "Nunito",
          color: "#b9b9b9",
        }}
      >
        จำนวนสินค้าเข้า
      </Text>
      <Text
        style={{
          position: "absolute",
          top: 285,
          left: 100,
          fontSize: 20,
          fontWeight: "normal",
          fontFamily: "Nunito",
          color: "#b9b9b9",
        }}
      >
        จำนวนสินค้าออก
      </Text>
    </div>
  );
};

export default ProductInOut;