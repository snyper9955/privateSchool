/**
 * Service to send WhatsApp messages
 */
exports.sendMessage = async (to, message) => {
    console.log(`Sending WhatsApp message to ${to}: ${message}`);
    // Logic for WhatsApp API (e.g., Twilio, Meta Business API)
    return { success: true };
};
