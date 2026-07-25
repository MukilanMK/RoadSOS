from flask import Blueprint, request, jsonify, current_app
from utils.auth_middleware import token_required
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sos_bp = Blueprint('sos', __name__)

@sos_bp.route('/trigger', methods=['POST'])
@token_required
def trigger_sos(current_user):
    data = request.get_json()
    lat = data.get('lat')
    lng = data.get('lng')
    
    if not lat or not lng:
        return jsonify({'message': 'Location coordinates are required'}), 400
        
    distress_emails = current_user.get('distress_emails', [])
    if not distress_emails:
        return jsonify({'message': 'No distress emails configured', 'status': 'no_emails'}), 200
        
    sender_email = current_app.config.get('SMTP_EMAIL')
    sender_password = current_app.config.get('SMTP_PASSWORD')
    
    if not sender_email or not sender_password:
        return jsonify({'message': 'SMTP not configured on server', 'status': 'smtp_error'}), 500
        
    maps_link = f"https://maps.google.com/?q={lat},{lng}"
    user_name = current_user.get('name', 'A ROADSoS User')
    user_phone = current_user.get('phone', 'Unknown')
    
    subject = f"EMERGENCY SOS: {user_name} needs help!"
    body = f"""
    EMERGENCY ALERT
    
    {user_name} (Phone: {user_phone}) has triggered an SOS alert and needs immediate assistance.
    
    Current Location: {maps_link}
    
    Please attempt to contact them or reach their location immediately.
    """
    
    try:
        # Assuming Gmail for SMTP
        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(sender_email, sender_password)
        
        for recipient in distress_emails:
            msg = MIMEMultipart()
            msg['From'] = sender_email
            msg['To'] = recipient
            msg['Subject'] = subject
            msg.attach(MIMEText(body, 'plain'))
            
            server.send_message(msg)
            
        server.quit()
        return jsonify({'message': 'Distress emails sent successfully', 'status': 'success'}), 200
    except Exception as e:
        print(f"SMTP Error: {e}")
        return jsonify({'message': 'Failed to send emails', 'status': 'error', 'error': str(e)}), 500
