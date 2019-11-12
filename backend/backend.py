# decoding=utf-8
import base64
import json
import os
import sys

from flask import Flask, request
from flask_cors import CORS

from algorithm import measure_pb

app = Flask(__name__)
# max file length 100MB
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024
CORS(app)

sys.path.append("../algorithm/")

os.makedirs("/tmp/zju_ai_img/upload", mode=0o777, exist_ok=True)
os.makedirs("/tmp/zju_ai_img/download", mode=0o777, exist_ok=True)


def make_status_false(msg):
    return json.dumps({
        "status": False,
        "msg": msg
    })


@app.route('/api/v1/upload', methods=['GET', 'POST'])
def upload():
    file = request.files.get('file')
    if not file:
        return make_status_false("invalid_file")

    filename = base64.b64encode(os.urandom(24)).decode('utf-8').replace("/", "_") + ".png"
    file.save(os.path.join("/tmp/zju_ai_img/upload", filename))

    measure_pb.run(os.path.join("/tmp/zju_ai_img/upload", filename),
                   os.path.join("/tmp/zju_ai_img/download", filename))

    return json.dumps({
        "status": True,
        "data": "http://matting.zhangzaizai.com:4800/download/{}".format(filename)
    })


app.run(host='0.0.0.0', port=80)
