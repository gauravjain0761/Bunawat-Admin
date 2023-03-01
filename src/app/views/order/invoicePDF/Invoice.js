import React from "react";
import { Page, Document } from "@react-pdf/renderer";
import Html from 'react-pdf-html';
import moment from "moment";

const InvoicesDocument = ({ data }) => {
    const invoices = `
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
                        <img src="/assets/images/bunawat-pdf-logo.png" alt="" />
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
                            <p><span>Billing:- </span> <br />
                                ${data?.billing_address?.fname} ${data?.billing_address?.lname} <br />
                                ${data?.billing_address?.address_1} <br />
                                ${data?.billing_address?.address_2}<br />
                                ${data?.billing_address?.state}<br />
                                ${data?.billing_address?.city},${data?.billing_address?.pincode}
                            </p>
                        </div>
                        
                        <div class="">
                            <p><span>Shiping:-</span> <br />
                            ${data?.shipping_address?.fname} ${data?.shipping_address?.lname} <br />
                            ${data?.shipping_address?.address_1} <br />
                            ${data?.shipping_address?.address_2}<br />
                            ${data?.shipping_address?.state}<br />
                            ${data?.shipping_address?.city}, ${data?.shipping_address?.pincode}
                            </p>
                        </div>
                <div class="">
                   <div>
                    <p>Invoice Number : INV/2022-23/1887 <br />
                    Order Number : ${data?.order_num} <br />
                    Order Date : ${moment(data?.createdAt).format("DD MMM, YYYY")}</p>
                   </div>
                </div>
            </div>

            <div class="">
                <div class="col-sm-12">
                    <table>
                        <tr>
                            <th style="width:40%">Item</th>
                            <th>Cost</th>
                            <th>Qty</th>
                            <th>Total</th>
                        </tr>
                        ${data?.items?.map(list => (
        `<tr>
            <td style="padding-right: 10px;">
                <b>Blue skirt and top set - Blue,s</b> <br />
                <span>SKU: ${list?.sku}</span>
            </td>
            <td>INR ${list?.price}</td>
            <td>${list?.qty}</td>
            <td>INR ${list?.amount}</td>
        </tr>`
    ))}
                    </table>
                    <div class="bottom-data">
                        <div class=""></div>
                        <div class="">
                            <div class="">
                                <p><b>Item Subtotal:</b> INR ${Number(data?.total_amount) + Number(data?.discount_amount) - Number(data?.gst_amount)}</p>
                                ${data?.igst_amount ? `<p><b>12% IGST:</b> + ${data?.igst_amount}</p>` : ``}
                                ${data?.cgst_amount ? `<p><b>6% CGST:</b> + ${data?.cgst_amount}</p>` : ``}
                                ${data?.sgst_amount ? `<p><b>6% SGST:</b> + ${data?.sgst_amount}</p>` : ``}
                                <p><b>Discount Amount:</b> - ${data?.discount_amount}</p> 
                                <p><b>Order Total:</b> INR ${data?.total_amount}</p>
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
                <Html>{invoices}</Html>
            </Page>
        </Document>
    );
}

export default InvoicesDocument;