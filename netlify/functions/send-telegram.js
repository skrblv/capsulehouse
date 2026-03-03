exports.handler = async function(event, context) {
    // Проверяем, что запрос пришел методом POST
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // Получаем текст заявки от твоего сайта
        const data = JSON.parse(event.body);
        const textMessage = data.message;

        // Берем токены из секретных настроек Netlify
        const botToken = process.env.TG_BOT_TOKEN;
        const chatId = process.env.TG_CHAT_ID;

        // Отправляем в Телеграм
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: textMessage
            })
        });

        if (!response.ok) {
            throw new Error('Ошибка со стороны Telegram');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Не удалось отправить сообщение" })
        };
    }
};
