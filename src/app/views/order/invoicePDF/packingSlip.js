import React, { useEffect, useState } from "react";
import { Page, Document } from "@react-pdf/renderer";
import Html from 'react-pdf-html';
import moment from "moment";

const PackingSlipDocument = ({ data, slipData }) => {
    const packingSlip = `
    <html lang="en">
        <body>
        <style>
           .bunawat_doc{
                border: 1px solid #000;
            }
            .bunawat_doc_top{
                padding: 40px 20px;
                font-size: 12px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
            .bunawat_doc_top h4{
                font-size: 14px;
            }
            .bunawat_doc_top p{
                margin-top: 0px;
                font-size: 12px;
            }
            .bunawat_doc_top img{
                width: 150px;
                height: 70px;
            }
            .bunawat_doc_top_data{
                display: flex; 
                flex-direction: row;
                justify-content: space-between;
                padding-left: 10px;
                padding-right: 10px;
                align-items: flex-start;
            }
            .bunawat_doc_top_data p{
                margin-top: 2px;
                font-size: 12px;
            }
            table{
                width: 100%;
            }
            table, th, td {
                border: 1px solid rgb(221, 219, 219);
                border-collapse: collapse;
                padding: 4px;
                font-size: 12px;
            }
            .bottom-data{
                display: flex; 
                flex-direction: row;
                justify-content: space-between;
                padding-left: 10px;
                padding-right: 10px;
                align-items: flex-start;
                margin-bottom: 20px;
            }
            .bottom-data p{
                font-size: 12px;
                margin-bottom: 0px;
            }
            .bottom-data b{
                font-weight: bold;
            }
        </style>
            <div class="bunawat_doc">
                <div class="bunawat_doc_top">
                        <div>
                            <img src=${slipData?.barcode ?? ""} alt="barcode" />
                        </div>
                        <div>
                            <h4>${slipData?.cl}</h4>
                            <p>${slipData?.origin_city}<br />
                                ${slipData?.origin_state},${slipData?.rpin}<br />
                            </p>
                        </div>
                </div>
                
                <div class="bunawat_doc_top_data">
                            <div class="">
                                <p><span>Billing:-</span> <br />
                                ${data?.billing_address?.fname} ${data?.billing_address?.lname} <br />
                                ${data?.billing_address?.address_1} <br />
                                ${data?.billing_address?.address_2}<br />
                                ${data?.billing_address?.state}<br />
                                ${data?.billing_address?.city},${data?.billing_address?.pincode}
                                </p>
                            </div>
                            
                            <div className="">
                                <p><span>Shiping:-</span> <br />
                                ${data?.shipping_address?.fname} ${data?.shipping_address?.lname} <br />
                                ${data?.shipping_address?.address_1} <br />
                                ${data?.shipping_address?.address_2}<br />
                                ${data?.shipping_address?.state}<br />
                                ${data?.shipping_address?.city}, ${data?.shipping_address?.pincode}
                                </p>
                            </div>
                    <div class="">
                    <p>Invoice Number : INV/2022-23/1887 <br />
                    Order Number : ${data?.order_num} <br />
                    Order Date : ${moment(data?.createdAt).format("DD MMM, YYYY")}</p>
                    </div>
                </div>

                <div class="">
                    <div class="">
                    <table>
                    <tr>
                      <th>Item</th>
                      <th>Weight</th>
                      <th>Quantity</th>
                    </tr>
                    ${data?.items?.map(list => (
        `<tr>
                            <td style="padding-right: 10px;">
                                <b>${list?.product_name}</b> <br />
                                <span>SKU: ${list?.sku}</span>
                            </td>
                            <td>N/A</td>
                            <td>${list?.qty}</td>
                        </tr>`
    ))}
                  </table>

                        <div class="bottom-data">
                            <div class=""></div>
                            <div class="">
                                <div class="">
                                    <p><b>Total Quantity: </b> ${data?.items?.reduce((t, x) => t + Number(x?.qty), 0)}</p>
                                    <p><b>Total Amount: </b> ${slipData?.cod}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    </html>
`;
    return (
        <Document>
            <Page>
                <Html>{packingSlip}</Html>
            </Page>
        </Document>
    );
}

export default PackingSlipDocument;