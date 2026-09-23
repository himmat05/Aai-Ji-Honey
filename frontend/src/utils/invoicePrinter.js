/**
 * Tax Invoice Printer Utility
 * Opens a print-friendly invoice window formatted for Aai Ji Honey
 */
export const printTaxInvoice = (order) => {
  if (!order) {
    alert('Order details not found!');
    return;
  }

  const deliveryFee = (order.product?.price * order.quantity) < 990 ? 100 : 0;
  const ptFee = (order.product?.price * order.quantity * 0.0236).toFixed(2);
  const total = (
    parseFloat(ptFee) +
    deliveryFee +
    (order.product?.price * order.quantity)
  ).toFixed(2);

  const printWindow = window.open('', '', 'width=900,height=700');
  if (!printWindow) {
    alert('Please allow popups to print the invoice.');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Tax Invoice - ${order.invoiceNumber || 'Aai Ji Honey'}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; color: #111; }
          table, th, td { border: 1px solid black; border-collapse: collapse; padding: 8px; }
          .center { text-align: center; }
          img { max-width: 100px; height: auto; }
        </style>
      </head>
      <body>
        <div>
          <div style="background-color:#86efac; border:2px solid black; padding:6px;">
            <div class="center">
              <h1 style="font-size: 20px; font-family: 'Georgia', serif; font-style: italic; color: #6b4226; margin: 4px 0;">
                Jai Shri Aai Mata Namo Namah
              </h1>
              <h2 style="font-size: 16px; text-decoration: underline; font-weight: bold; margin: 4px 0;">
                Tax Invoice
              </h2>
            </div> 
            <div style="display:flex; justify-content:space-around; margin: 6px 0;">
              <div>
                <p style="margin:2px 0;"><strong>GSTIN:</strong> 08HIAPS1709H1Z5</p>
                <p style="margin:2px 0;"><strong>Email:</strong> aaijihoney24@gmail.com</p>
              </div>
              <div>
                <p style="margin:2px 0;"><strong>Contact:</strong> +91 9610047740</p>
                <p style="margin:2px 0;">+91 9887918251</p>
              </div>
            </div>
            <div class="center" style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 6px 0;">
              <img src="/Aai ji honey.jpg" alt="Logo" style="max-width: 70px; height: auto; border-radius: 50%;" />
              <h1 style="font-size: 2.2rem; margin: 0; color: #92400e;">Aai Ji Honey</h1>
            </div>
            <div style="font-size: 13px; line-height: 1.4;">
              <strong>Head office:</strong> 426, Aai mata colony, Megakheda, Post-Pipli Ahiran, Teh-Kunwariya, Dist-Rajsamand, Rajasthan, PIN-313327, India.
              <div class="center" style="margin-top: 4px;"><strong>(Raw Honey, Processed Honey, Herbal Honey, Edible Honey)</strong></div>
            </div>
          </div>

          <div style="margin-top: 10px; border:2px solid black; background-color:#fde68a; display:flex;">
            <div style="width:60%; border-right:2px solid black; padding: 10px;">
              <p style="margin: 2px 0;"><strong>Customer Details:</strong></p>
              <p style="margin: 2px 0;"><strong>GSTIN:</strong> 08AHFPC5892E1ZC</p>
              <p style="margin: 2px 0;"><strong>Name:</strong> ${order.name || 'N/A'}</p>
              <p style="margin: 2px 0;"><strong>Mobile:</strong> ${order.mobile || 'N/A'}</p>
              <p style="margin: 2px 0;"><strong>Email:</strong> ${order.email || 'N/A'}</p>
              <p style="margin: 2px 0;"><strong>Address:</strong> ${order.address || 'N/A'}</p>
            </div>
            <div style="width:40%; padding: 10px;">
              <p style="margin: 2px 0;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
              <p style="margin: 2px 0;"><strong>Invoice No.:</strong> ${(order.invoiceNumber || 'N/A').replace('AJh/2027', 'AJh/2026')}</p>
              <p style="margin: 2px 0;"><strong>Supply State:</strong> Rajasthan</p>
              <p style="margin: 2px 0;"><strong>Supply Mode:</strong> Delivery</p>
              <p style="margin: 2px 0;"><strong>Ordered by:</strong> MR. Bhanwar lal</p>
            </div>
          </div>

          <div style="margin-top:15px;">
            <table width="100%">
              <thead>
                <tr style="background-color: #f3f4f6;">
                  <th>S.No</th>
                  <th>Description</th>
                  <th>HSN</th>
                  <th>Quantity</th>
                  <th>Price ₹</th>
                  <th>Total ₹</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="center">1</td>
                  <td>${order.product?.name || 'Pure Honey'}</td>
                  <td class="center">0409</td>
                  <td class="center">${order.quantity}</td>
                  <td class="center">${order.product?.price}</td>
                  <td class="center">${order.product?.price * order.quantity}</td>
                </tr>
                <tr>
                  <td colspan="4"></td>
                  <td><strong>Pt fee ₹</strong></td>
                  <td class="center">${ptFee}</td>
                </tr>
                <tr>
                  <td colspan="4"></td>
                  <td><strong>Delivery ₹</strong></td>
                  <td class="center">${deliveryFee}</td>
                </tr>
                <tr style="background-color: #fef08a;">
                  <td colspan="4"></td>
                  <td><strong>Total ₹</strong></td>
                  <td class="center"><strong>₹${total}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top:20px; display:flex; justify-content:space-between; align-items: flex-end;">
            <div>
              <strong>Terms & Conditions:</strong>
              <ul style="margin: 4px 0; padding-left: 20px; font-size: 13px;">
                <li>E & O.E</li>
                <li>All disputes subject to "UDAIPUR" jurisdiction only.</li>
              </ul>
            </div>
            <div style="text-align:right;">
              <img src="/Signature.png" alt="Signature" style="max-height: 50px; width: auto;" />
              <h4 style="margin: 4px 0;"><strong>For - Aai Ji Honey</strong></h4>
              <p style="margin: 0; font-size: 13px;">Authorized Signature</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };
};
