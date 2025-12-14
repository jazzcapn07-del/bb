import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, answers } = body;

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Answers are required' },
        { status: 400 }
      );
    }

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      try {
        // Format answers for Telegram message
        const answersText = Object.entries(answers)
          .map(([key, value]) => {
            // Format question key to be more readable
            const formattedKey = key
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ');
            // Handle arrays (for multi-select) and strings
            const formattedValue = Array.isArray(value) 
              ? value.join(', ') 
              : String(value);
            return `• ${formattedKey}: ${formattedValue}`;
          })
          .join('\n');

        const emailSection = email ? `📧 Email: ${email}\n\n` : '';
        const message = `📋 New Account Verification Questionnaire\n\n${emailSection}📝 Answers:\n${answersText}\n\n📅 Timestamp: ${new Date().toISOString()}`;

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
        // Don't fail the request if Telegram fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Questionnaire submitted successfully',
    });
  } catch (error: any) {
    console.error('Error submitting questionnaire:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit questionnaire' },
      { status: 500 }
    );
  }
}

