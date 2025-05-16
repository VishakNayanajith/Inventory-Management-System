const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "ab138cad0e8ff2",  
      pass: "ad9a3684112e34"   
    }
  });

/**
 * Sends email notification for low stock items
 * @param {Array} lowStockItems - Array of low stock items
 * @returns {Promise} Promise that resolves when email is sent
 */
const sendLowStockEmail = async (lowStockItems) => {
  try {
    // Format the list of low stock items
    const itemsList = lowStockItems.map(item => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.stockName}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${item.stockCode}</td>
        <td style="padding: 8px; border: 1px solid #ddd; color: ${item.quantity < 10 ? 'red' : 'orange'}; font-weight: bold;">
          ${item.quantity}
        </td>
        <td style="padding: 8px; border: 1px solid #ddd;">$${item.price?.toFixed(2) || '0.00'}</td>
      </tr>
    `).join('');

    // Email options
    const mailOptions = {
      from: `Stock Management System <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `Low Stock Alert - ${lowStockItems.length} Item(s) Need Attention`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d9534f;">Low Stock Alert</h2>
          <p>The following items are below the minimum stock threshold:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Name</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Code</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Quantity</th>
                <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.APP_URL || 'http://your-app-url.com'}" 
               style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 4px;">
              View in Dashboard
            </a>
          </p>
          
          <p style="margin-top: 20px; font-size: 0.9em; color: #777;">
            This is an automated message. Please do not reply directly to this email.
          </p>
        </div>
      `,
      text: `Low Stock Alert\n\n` +
            `The following items are below the minimum stock threshold:\n\n` +
            lowStockItems.map(item => 
              `- ${item.stockName} (${item.stockCode}): ${item.quantity} remaining (Price: $${item.price?.toFixed(2) || '0.00'})`
            ).join('\n')
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Low stock notification sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending low stock email:', error);
    throw error;
  }
};

module.exports = { sendLowStockEmail };