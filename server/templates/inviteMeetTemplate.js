const sendEmail = require("../utils/sendEmail");

const sendConferenceInviteEmails = async (inviteMembers, inviteLink, meetingTitle, meetingDescription, meetingDate) => {
    for (const { email, firstName } of inviteMembers) {
        try {
            const subject = `📅 Invitation to Join "${meetingTitle}" Video Conference`;
            const html = `
                <div style="max-width: 500px; margin: auto; font-family: Arial, sans-serif; background: #000; color: #fff; padding: 20px; border-radius: 10px; border: 1px solid #555; text-align: center;">
                    <h2 style="color: #fff; margin-bottom: 10px;">
                        🎥 ${firstName}, You're Invited to 
                        <br>
                        </h2>
                        <span style="color:rgb(241, 241, 241); font-weight: bold; font-size: 16px;">${meetingTitle}</span>
                    <p style="color: #ccc; font-size: 12px;">${meetingDescription}</p>
                    <p style="color: #ccc; font-size: 12px;">🗓️ <b>Date:</b> ${meetingDate}</p>
                    
                    <a href="${inviteLink}" style="text-decoration: none;">
      <div style="background: #fff; color: #000; padding: 15px 20px; border-radius: 5px; display: inline-block; font-size: 14px; font-weight: bold; margin: 15px 0; cursor: pointer;">
        Join Meeting
      </div>
    </a>

                    <p style="color: #999; font-size: 10px; margin-top: 15px;">If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; height: 1px; background: #555; margin: 25px 0;">
                    <p style="color: #777; font-size: 12px;">&copy; ${new Date().getFullYear()} ScrumX. All rights reserved.</p>
                </div>
            `;

            await sendEmail(email, subject, html);
        } catch (err) {
            console.error(`❌ Failed to send email to ${email}:`, err.message);
        }
    }
};

module.exports = { sendConferenceInviteEmails };
