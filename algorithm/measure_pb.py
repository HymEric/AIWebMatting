#!/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2019-07-26 16:50
# @Author  : erichym
# @Company : juphoon.com.cn
# @File    : measure_pb.py
import tensorflow as tf
import numpy as np
from tensorflow.python.platform import gfile
import cv2

from algorithm.definitions import absolute

output_graph_def = tf.GraphDef()
output_graph_path = absolute('pb_model/matting_model.pb')

with gfile.FastGFile(output_graph_path, "rb") as f:
    output_graph_def.ParseFromString(f.read())
    # fix nodes
    for node in output_graph_def.node:
        if node.op == 'RefSwitch':
            node.op = 'Switch'
        elif node.op == 'AssignSub':
            node.op = 'Sub'
            if 'use_locking' in node.attr: del node.attr['use_locking']
        elif node.op == 'AssignAdd':
            node.op = 'Add'
            if 'use_locking' in node.attr: del node.attr['use_locking']
    _ = tf.import_graph_def(output_graph_def, name="")
sess = tf.Session()
sess.run(tf.global_variables_initializer())


def make(img_path, mask_path, output_path):
    img = cv2.imread(img_path)
    alpha_mask = cv2.imread(mask_path, cv2.IMREAD_GRAYSCALE)
    print(img.shape)
    print(alpha_mask.shape)
    b, g, r = cv2.split(img)
    img_BGRA = cv2.merge((b, g, r, alpha_mask))
    cv2.imwrite(output_path, img_BGRA)


def image_synthesis(foreground_img_path, background_img_path, output_img_path):
    fore_img = cv2.imread(foreground_img_path, cv2.IMREAD_UNCHANGED).astype(float)
    back_img = cv2.imread(background_img_path).astype(float)

    w, h, c = fore_img.shape
    back_img = cv2.resize(back_img, (h, w), interpolation=cv2.INTER_CUBIC)

    b, g, r, alpha = cv2.split(fore_img)
    alpha = cv2.merge([alpha, alpha, alpha])
    alpha = alpha.astype(float) / 255

    fore_img = cv2.merge([b, g, r])
    fore_img = cv2.multiply(alpha, fore_img)

    back_img = cv2.multiply(1.0 - alpha, back_img)

    out_img = cv2.add(fore_img, back_img)

    cv2.imwrite(output_img_path, out_img)


def run(input_img_path, output_img_path):
    input_tensor = sess.graph.get_tensor_by_name("image_holder:0")
    output_tensor = sess.graph.get_tensor_by_name("output/score:0")

    # img=Image.open(img_path)
    # w,h=img.size
    # img=img.resize((256,256),Image.BICUBIC)

    img = cv2.imread(input_img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    w, h, c = img.shape
    img_array = cv2.resize(img, (256, 256), interpolation=cv2.INTER_CUBIC)

    img_array = img_array[np.newaxis, :]
    prob_scores = sess.run(output_tensor, feed_dict={input_tensor: img_array})
    alpha_scores = prob_scores[:, :, :, -1:] * 255
    prediction = alpha_scores

    prediction_normed = (prediction - prediction.min()) / (prediction.max() - prediction.min())
    _output = np.squeeze(prediction_normed) * 255
    _output = _output.round().astype(np.uint8)  # (256,256)

    alpha_mask = cv2.resize(_output, (h, w), interpolation=cv2.INTER_CUBIC)
    # notes: save middle result alpha_mask which will be alpha channel in the original image
    # cv2.imwrite("test.png",alpha_mask)
    print(alpha_mask.shape)
    r, g, b = cv2.split(img)
    img_BGRA = cv2.merge((b, g, r, alpha_mask))
    cv2.imwrite(output_img_path, img_BGRA)


if __name__ == "__main__":
    # input_img_path = absolute('inputs/test.png')
    # # mask_output_img_path='./outputs/test_result.png'
    # alpha_img_output_path = absolute('alpha_img_outputs/test_result.png')
    # run(input_img_path, alpha_img_output_path)

    # make(input_img_path,mask_output_img_path,alpha_img_output_path)
    foreground_img_path = absolute('alpha_img_outputs/test_result.png')
    background_img_path = absolute('inputs/background.png')
    output_img_path = absolute('outputs/synthesis.png')
    image_synthesis(foreground_img_path, background_img_path, output_img_path)
