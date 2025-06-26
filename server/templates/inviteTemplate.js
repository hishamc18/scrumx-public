const sendEmail = require("../utils/sendEmail");

const sendInviteEmails = async (inviteLinksResolved, projectName, projectDescription) => {
    for (const { email, inviteLink } of inviteLinksResolved) {
        console.log(inviteLink)
        try {
            const subject = `You're Invited to Join "${projectName}"`;
            const html = `
                <div style="background: url('https://source.unsplash.com/1600x900/?abstract,technology') no-repeat center center; background-size: cover; padding: 40px 20px; text-align: center; color: white; font-family: Arial, sans-serif;">
                    <div style="background: rgba(0, 0, 0, 0.7); padding: 30px; border-radius: 10px;">
                        <h1 style="margin: 0; font-size: 24px;">📩 You're Invited to Join "${projectName}"</h1>
                        <p style="font-size: 16px; margin: 10px 0;">${projectDescription}</p>
                        <p style="font-size: 16px; margin: 20px 0;">Click the button below to accept your invitation.</p>
                        <a href="${inviteLink}" style="display: inline-block; padding: 10px 20px; background: #ff9800; color: white; text-decoration: none; font-size: 16px; border-radius: 5px;">Join Project</a>
                    </div>
                </div>
            `;
            await sendEmail(email, subject, html);
        } catch (err) {
            console.error(`Failed to send email to ${email}:`, err.message);
        }
    }
};

module.exports = { sendInviteEmails }