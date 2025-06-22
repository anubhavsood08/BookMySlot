from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Email configuration
# For development, you can use services like Mailtrap or Gmail SMTP
# You'll need to set these environment variables in a .env file
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME", "your-email@gmail.com"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD", "your-app-password"),
    MAIL_FROM=os.getenv("MAIL_FROM", "your-email@gmail.com"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", "587")),
    MAIL_SERVER=os.getenv("MAIL_SERVER", "smtp.gmail.com"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)

fastmail = FastMail(conf)

async def send_booking_confirmation_email(
    user_email: str,
    user_name: str,
    event_title: str,
    time_slot_start: str,
    booking_id: int
):
    """
    Send a booking confirmation email to the user.
    
    Args:
        user_email: The email address of the user
        user_name: The name of the user
        event_title: The title of the event
        time_slot_start: The start time of the booked slot
        booking_id: The ID of the booking
    """
    try:
        # Format the email content
        subject = f"Booking Confirmation - {event_title}"
        
        html_content = f"""
        <html>
        <body>
            <h2>🎉 Booking Confirmed!</h2>
            <p>Dear {user_name},</p>
            <p>Your booking has been successfully confirmed!</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Booking Details:</h3>
                <p><strong>Event:</strong> {event_title}</p>
                <p><strong>Date & Time:</strong> {time_slot_start}</p>
                <p><strong>Booking ID:</strong> #{booking_id}</p>
                <p><strong>Your Name:</strong> {user_name}</p>
            </div>
            
            <p>Please arrive a few minutes before your scheduled time.</p>
            <p>If you need to cancel or reschedule, please contact us as soon as possible.</p>
            
            <p>Thank you for choosing our service!</p>
            
            <hr>
            <p style="color: #666; font-size: 12px;">
                This is an automated confirmation email. Please do not reply to this message.
            </p>
        </body>
        </html>
        """
        
        message = MessageSchema(
            subject=subject,
            recipients=[user_email],
            body=html_content,
            subtype="html"
        )
        
        await fastmail.send_message(message)
        print(f"Confirmation email sent to {user_email}")
        
    except Exception as e:
        print(f"Failed to send confirmation email to {user_email}: {str(e)}")
        # Don't raise the exception - we don't want email failures to break the booking process
        pass

async def send_booking_cancellation_email(
    user_email: str,
    user_name: str,
    event_title: str,
    time_slot_start: str,
    booking_id: int
):
    """
    Send a booking cancellation email to the user.
    
    Args:
        user_email: The email address of the user
        user_name: The name of the user
        event_title: The title of the event
        time_slot_start: The start time of the cancelled slot
        booking_id: The ID of the booking
    """
    try:
        subject = f"Booking Cancelled - {event_title}"
        
        html_content = f"""
        <html>
        <body>
            <h2>❌ Booking Cancelled</h2>
            <p>Dear {user_name},</p>
            <p>Your booking has been cancelled.</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Cancelled Booking Details:</h3>
                <p><strong>Event:</strong> {event_title}</p>
                <p><strong>Date & Time:</strong> {time_slot_start}</p>
                <p><strong>Booking ID:</strong> #{booking_id}</p>
            </div>
            
            <p>If you have any questions, please contact us.</p>
            
            <p>Thank you for your understanding.</p>
            
            <hr>
            <p style="color: #666; font-size: 12px;">
                This is an automated email. Please do not reply to this message.
            </p>
        </body>
        </html>
        """
        
        message = MessageSchema(
            subject=subject,
            recipients=[user_email],
            body=html_content,
            subtype="html"
        )
        
        await fastmail.send_message(message)
        print(f"Cancellation email sent to {user_email}")
        
    except Exception as e:
        print(f"Failed to send cancellation email to {user_email}: {str(e)}")
        pass 