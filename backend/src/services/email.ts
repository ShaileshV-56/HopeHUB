import { env } from '../config/env';

export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface SendEmailOptions {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<void> {
  if (!env.brevoApiKey) {
    console.warn('[email] BREVO_API_KEY not set, skipping email');
    return;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': env.brevoApiKey,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'HopeHUB',
          email: 'karthikeyannaren4@gmail.com',
        },
        to: options.to,
        subject: options.subject,
        htmlContent: options.htmlContent,
        textContent: options.textContent || options.htmlContent.replace(/<[^>]*>/g, ''),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[email] Failed to send email:', error);
      throw new Error(`Failed to send email: ${response.statusText}`);
    }

    console.log('[email] Email sent successfully');
  } catch (error) {
    console.error('[email] Error sending email:', error);
    throw error;
  }
}

export async function sendFoodRequestNotification(
  requesterName: string,
  requestedItem: string,
  quantity: string,
  organizationName: string,
  recipients: EmailRecipient[]
): Promise<void> {
  const subject = 'New Food Request Received - HopeHUB';
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #10b981;">New Food Request Received</h2>
          <p>A new food request has been submitted on HopeHUB.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Requester:</strong> ${requesterName}</p>
            <p><strong>Requested Item:</strong> ${requestedItem}</p>
            <p><strong>Quantity:</strong> ${quantity}</p>
            <p><strong>Organization:</strong> ${organizationName}</p>
          </div>
          <p>Visit the <strong>Donate Food</strong> section on HopeHUB to view full details and respond to this request.</p>
          <p style="margin-top: 30px; color: #6b7280; font-size: 0.9em;">
            This is an automated notification from HopeHUB. Please do not reply to this email.
          </p>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: recipients,
    subject,
    htmlContent,
  });
}
