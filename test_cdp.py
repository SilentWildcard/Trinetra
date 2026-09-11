import urllib.request, json, socket, os, base64, time, sys

# 1. Query Edge for the localhost:3000 tab
try:
    with urllib.request.urlopen('http://localhost:9222/json') as resp:
        tabs = json.loads(resp.read().decode('utf-8'))
except Exception as e:
    print('Failed to query Edge CDP:', e)
    sys.exit(1)

page_tab = None
for tab in tabs:
    if 'localhost:3000' in tab.get('url', ''):
        page_tab = tab
        break

if not page_tab:
    print('No localhost:3000 tab found! Tabs:', [t.get('url') for t in tabs])
    sys.exit(1)

ws_url = page_tab['webSocketDebuggerUrl']
print('Connecting to page WebSocket:', ws_url)

# 2. Minimal RFC 6455 WebSocket Client
parts = ws_url.replace('ws://', '').split('/', 1)
host_port = parts[0].split(':')
host = host_port[0]
port = int(host_port[1])
path = '/' + parts[1]

s = socket.create_connection((host, port))
key = base64.b64encode(os.urandom(16)).decode()
req = (
    f"GET {path} HTTP/1.1\r\n"
    f"Host: {host}:{port}\r\n"
    f"Upgrade: websocket\r\n"
    f"Connection: Upgrade\r\n"
    f"Sec-WebSocket-Key: {key}\r\n"
    f"Sec-WebSocket-Version: 13\r\n\r\n"
)
s.sendall(req.encode())
resp = s.recv(4096)
if b'101 Switching Protocols' not in resp:
    print('WebSocket handshake failed:', resp)
    sys.exit(1)

def send_cdp(cmd_id, method, params=None):
    payload = json.dumps({'id': cmd_id, 'method': method, 'params': params or {}})
    data = payload.encode('utf-8')
    l = len(data)
    mask = os.urandom(4)
    hdr = bytearray([0x81])
    if l < 126:
        hdr.append(0x80 | l)
    elif l < 65536:
        hdr.extend([0x80 | 126, (l >> 8) & 0xFF, l & 0xFF])
    hdr.extend(mask)
    masked = bytearray(data[i] ^ mask[i % 4] for i in range(l))
    s.sendall(hdr + masked)

def recv_cdp_until_id(target_id):
    s.settimeout(5.0)
    start = time.time()
    while time.time() - start < 6.0:
        hdr = s.recv(2)
        if not hdr: continue
        l = hdr[1] & 0x7F
        if l == 126:
            l = int.from_bytes(s.recv(2), 'big')
        elif l == 127:
            l = int.from_bytes(s.recv(8), 'big')
        buf = bytearray()
        while len(buf) < l:
            c = s.recv(l - len(buf))
            if not c: break
            buf.extend(c)
        try:
            msg = json.loads(buf.decode('utf-8'))
            if msg.get('id') == target_id:
                return msg
        except Exception:
            pass
    return None

def eval_js(cmd_id, expr):
    send_cdp(cmd_id, 'Runtime.evaluate', {'expression': expr, 'returnByValue': True})
    res = recv_cdp_until_id(cmd_id)
    if res and 'result' in res and 'result' in res['result']:
        return res['result']['result'].get('value')
    return res

# 3. Test sequence in real browser
print('\n=== STEP 1: Verify Initial Page & App State ===')
initial_screen = eval_js(1, 'window.trinetraApp.state.activeScreen')
print('Initial Screen:', initial_screen)

# Navigate to home
eval_js(2, "window.trinetraApp.navigateTo('home')")
screen_after_nav = eval_js(3, 'window.trinetraApp.state.activeScreen')
print('Screen after navigate to home:', screen_after_nav)
assert screen_after_nav == 'home'

# Check initial risk level
initial_risk = eval_js(4, 'window.trinetraApp.signalFusion.state.level')
initial_score = eval_js(5, 'window.trinetraApp.signalFusion.state.score')
print(f'Initial Risk: {initial_risk} (score: {initial_score})')

print('\n=== STEP 2: Click "Sim Fall" Button in DOM ===')
eval_js(6, "document.getElementById('bar-sim-fall').click()")

fall_anomaly = eval_js(7, 'window.trinetraApp.signalFusion.latestMotion.anomaly')
fall_score = eval_js(8, 'window.trinetraApp.signalFusion.state.score')
fall_level = eval_js(9, 'window.trinetraApp.signalFusion.state.level')
fall_screen = eval_js(10, 'window.trinetraApp.state.activeScreen')
print(f'Motion Anomaly: {fall_anomaly}')
print(f'Signal Fusion Score: {fall_score}/100')
print(f'Signal Fusion Level: {fall_level}')
print(f'Active Screen: {fall_screen}')

assert fall_anomaly == 'FALL', f'Expected FALL, got {fall_anomaly}'
assert fall_screen == 'threatDetection', f'Expected threatDetection, got {fall_screen}'
assert fall_level in ['HIGH', 'CRITICAL'], f'Expected HIGH or CRITICAL, got {fall_level}'
print('>>> SUCCESS: Sim Fall successfully triggered Threat Detection screen!')

print('\n=== STEP 3: Wait 2.7s for Autonomous Escalation to "Are You Safe?" ===')
time.sleep(2.7)
auto_screen = eval_js(11, 'window.trinetraApp.state.activeScreen')
countdown_val = eval_js(12, "document.getElementById('countdown-display') ? document.getElementById('countdown-display').textContent.trim() : null")
print(f'Screen after autonomous transition: {auto_screen}')
print(f'Countdown Display value: {countdown_val}')
assert auto_screen == 'safetyConfirm', f'Expected safetyConfirm, got {auto_screen}'
print('>>> SUCCESS: Autonomous transition to "Are You Safe?" verified with active countdown!')

print('\n=== STEP 4: Test Reset Button ===')
eval_js(13, "document.getElementById('bar-reset').click()")
reset_screen = eval_js(14, 'window.trinetraApp.state.activeScreen')
reset_level = eval_js(15, 'window.trinetraApp.signalFusion.state.level')
reset_score = eval_js(16, 'window.trinetraApp.signalFusion.state.score')
reset_anomaly = eval_js(17, 'window.trinetraApp.signalFusion.latestMotion.anomaly')
print(f'Screen after reset: {reset_screen}')
print(f'Risk Level after reset: {reset_level} (score: {reset_score})')
print(f'Motion Anomaly after reset: {reset_anomaly}')

assert reset_screen == 'home', f'Expected home, got {reset_screen}'
assert reset_level == 'NORMAL', f'Expected NORMAL, got {reset_level}'
assert reset_anomaly is None, f'Expected None, got {reset_anomaly}'
print('>>> SUCCESS: Reset returned cleanly to baseline!')

print('\n=== STEP 5: Test Sim Fall a Second Time after Reset ===')
eval_js(18, "document.getElementById('bar-sim-fall').click()")
second_fall_screen = eval_js(19, 'window.trinetraApp.state.activeScreen')
second_fall_anomaly = eval_js(20, 'window.trinetraApp.signalFusion.latestMotion.anomaly')
print(f'Second Sim Fall screen: {second_fall_screen}')
print(f'Second Sim Fall anomaly: {second_fall_anomaly}')
assert second_fall_screen == 'threatDetection', f'Expected threatDetection, got {second_fall_screen}'
assert second_fall_anomaly == 'FALL', f'Expected FALL, got {second_fall_anomaly}'
print('>>> SUCCESS: Sim Fall tested repeatedly after reset without issues!')

print('\n=== STEP 6: Test "I\'m Safe" Button on Safety Confirm ===')
time.sleep(2.7)
assert eval_js(21, 'window.trinetraApp.state.activeScreen') == 'safetyConfirm'
eval_js(22, "document.getElementById('btn-confirm-im-safe').click()")
im_safe_screen = eval_js(23, 'window.trinetraApp.state.activeScreen')
im_safe_level = eval_js(24, 'window.trinetraApp.signalFusion.state.level')
print(f'Screen after "I\'m Safe": {im_safe_screen}')
print(f'Risk Level after "I\'m Safe": {im_safe_level}')
assert im_safe_screen == 'home', f'Expected home, got {im_safe_screen}'
assert im_safe_level == 'NORMAL', f'Expected NORMAL, got {im_safe_level}'
print('>>> SUCCESS: "I\'m Safe" dismissed alarm and safely returned to Home!')

print('\n========================================')
print('  ALL BROWSER SIMULATOR TESTS PASSED!   ')
print('========================================')
