# decoding=utf-8
import base64
import json
import os
import sys

from flask import Flask, request
from flask_cors import CORS

import algorithm.measure_pb as measure_pb

app = Flask(__name__)
CORS(app)

sys.path.append("../algorithm/")


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

    filename = base64.b64encode(os.urandom(24)).decode('utf-8')
    file.save(os.path.join("./", filename))

    measure_pb.run("", "")
    return json.dumps({
        "status": True,
        "data": {
            "http://aliyun.zhangzaizai.com:4800/download/1.jpg"
        }
    })


app.run(host='0.0.0.0', port=4800, debug=True)
