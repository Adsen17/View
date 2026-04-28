<!DOCTYPE html>
<html>
<head>
    <title>New Signal from Portfolio Contact</title>
</head>
<body style="font-family: monospace; background-color: #050507; color: #00FFC6; padding: 20px;">
    <div style="border: 1px solid #00FFC6; padding: 20px;">
        <h2 style="color: #FF3D6E; border-bottom: 1px solid #8A5CFF; padding-bottom: 10px;">SYS.INCOMING_SIGNAL</h2>
        <p><strong>>> Sender Name:</strong> {{ $data['name'] }}</p>
        <p><strong>>> Sender Email:</strong> {{ $data['email'] }}</p>
        <p><strong>>> Message Content:</strong></p>
        <div style="background: rgba(15, 23, 42, 0.5); padding: 15px; border-left: 2px solid #FFD166; white-space: pre-wrap;">
            {{ $data['message'] }}
        </div>
        <br>
        <p style="color: #8A5CFF; font-size: 12px;">// End of transmission.</p>
    </div>
</body>
</html>
