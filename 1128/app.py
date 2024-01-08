from flask import Flask, render_template,request,Response
from flask_socketio import SocketIO
import paho.mqtt.client as mqtt
import json
import pymysql
import cv2
import threading

app = Flask(__name__)
socketio = SocketIO(app)

mqtt_broker_host = '192.168.1.127'
mqtt_broker_port = 1883

ip_address = '192.168.1.121' 
port = '554'               
username = 'weilunh7'          
password = '123456789zxc'

db_settings = {
    "host": "localhost",
    "port": 3306,
    "user": "user",
    "password": "Rusia520",
    "db": "userdata",
    "charset": "utf8"
}

url_1080p = f"rtsp://{username}:{password}@{ip_address}:{port}/stream1"
rtsp_url = url_1080p  
cap = cv2.VideoCapture(rtsp_url)

#-----RTSP------
def rtsp_frames():
    while True:
        ret, frame = cap.read()
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
#---------------

#-----pymysql------
conn = pymysql.connect(**db_settings)
cur= conn.cursor()
#------------------

#-----socketio-----
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('mqtt_message_temp')
def broadcast_mqtt_message_temp(message):
    #print(message)
    socketio.emit('mqtt_message_temp', message)
    
@socketio.on('mqtt_message_humi')
def broadcast_mqtt_message_humi(message):
    #print(message)
    socketio.emit('mqtt_message_humi', message)
#------------------

#-----paho-mqtt-----
def on_connect(client, userdata, flags, rc):
    print("Connected with result code " + str(rc))
    client.subscribe('DHT11/esp32s_temp_humd')

def on_message(client, userdata, msg):
    global message,temp,humi
    payload = msg.payload.decode()
    message = json.loads(payload)
    #print('Received MQTT message:', message)
    temp = message['temp']
    humi = message['humidity']
    cur.execute("INSERT INTO dht11 (temp,humi) VALUES (%s,%s)",(temp,humi))
    conn.commit()
    broadcast_mqtt_message_temp(temp)
    broadcast_mqtt_message_humi(humi)

client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(mqtt_broker_host, mqtt_broker_port)
client.loop_start()
#-------------------

#-----flask-----
@app.route('/video_start')
def video_start():
    return Response(rtsp_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/',methods=['GET','POST'])
def index():
    if request.method == 'POST':
        username = request.form['username']
        email = request.form['email']
        cur.execute("INSERT INTO user (username,email) VALUES (%s,%s)",(username,email))
        conn.commit()
        #conn.close()
        return "success"
    return render_template('index.html')

if __name__ == '__main__':
    rtsp_thread = threading.Thread(target=rtsp_frames)
    rtsp_thread.daemon = True
    rtsp_thread.start()
    socketio.run(app,host='192.168.1.127', port=8080,debug=True)
#---------------