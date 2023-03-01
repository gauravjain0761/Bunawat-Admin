import React, { useEffect, useState } from "react";
import { Page, Document } from "@react-pdf/renderer";
import Html from 'react-pdf-html';
import moment from "moment";

const PackingSlipDocument = ({ data }) => {
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
                            <img src='https://cdn.shopify.com/s/files/1/0360/1124/5703/files/logo1_350x.jpg?v=1613715326' style="
                                width: 150px;
                                height: 70px;
                            " />
                        </div>
                        <div>
                            <h4>AFPL STORES.COM PVT. LTD</h4>
                            <p>Shop NO: 44-48, Block No: 2,<br />
                                Busyland Complex<br />
                                Nandgaon Peth Amravati,<br />
                                Maharashtra, 444901 <br />
                                Contact - +9198608000805<br />
                                GSTIN - 27AAVCA3244L1Z6<br />
                            </p>
                        </div>
                </div>
                
                <div class="bunawat_doc_top_data">
                            <div class="">
                                <p><span>Billing:-</span> <br />
                                    Avinash Thakur <br />
                                    Master infotech <br />
                                    12285<br />
                                    mohali<br />
                                    mohali, 160082
                                </p>
                            </div>
                            
                            <div className="">
                                <p><span>Shiping:-</span> <br />
                                    Avinash Thakur <br />
                                    Master infotech <br />
                                    12285<br />
                                    mohali<br />
                                    mohali, <br />
                                    PB 160082
                                </p>
                            </div>
                    <div class="">
                        <div> <p>Invoice Number : INV/2022-23/1887 </p></div>
                        <div> <p>Order Number : 158673</p></div>
                        <div> <p>Order Date : 10 Nav, 2022</p></div>
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
                    <tr>
                      <td>
                        <b>Blue skirt and top set - Blue,s</b> <br />
                        <span style="font-size: 14px;">sku: LSTS3028-Ylw-BL-1</span>
                      </td>
                      <td>N/A</td>
                      <td>1</td>
                    </tr>
                    <tr>
                        <td>
                          <b>Blue skirt and top set - Blue,s</b> <br />
                          <span style="font-size: 14px;">sku: LSTS3028-Ylw-BL-1</span>
                        </td>
                        <td>N/A</td>
                        <td>2</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Blue skirt and top set - Blue,s</b> <br />
                          <span style="font-size: 14px;">sku: LSTS3028-Ylw-BL-1</span>
                        </td>
                        <td>N/A</td>
                        <td>3</td>
                      </tr>
                      <tr>
                        <td>
                          <b>Blue skirt and top set - Blue,s</b> <br />
                          <span style="font-size: 14px;">sku: LSTS3028-Ylw-BL-1</span>
                        </td>
                        <td>N/A</td>
                        <td>4</td>
                      </tr>
                  </table>

                        <div class="bottom-data">
                            <div class=""></div>
                            <div class="">
                                <div class="">
                                    <p><b>Total Quantity: </b>13</p>
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