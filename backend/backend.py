# decoding=utf-8
import json
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
    measure_pb.run("", "")
    return json.dumps({
        "status": True,
        "data": {
            "http://aliyun.zhangzaizai.com:4800/download/1.jpg"
        }
    })


app.run(host='0.0.0.0', port=4800)
