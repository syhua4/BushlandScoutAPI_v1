#!/usr/bin/python3

import os
import sys
import tensorflow as tf

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# change this as you see fit
image_path = '/home/ec2-user/project/image/' + sys.argv[1]

# Read in the image_data
image_data = tf.io.gfile.GFile(image_path, 'rb').read()

# Loads label file, strips off carriage return
label_lines = [line.rstrip() for line in tf.io.gfile.GFile("/home/ec2-user/project/routes/htht_react/retrained_labels.txt")]

# Unpersists graph from file
with tf.io.gfile.GFile("/home/ec2-user/project/routes/htht_react/retrained_graph.pb", 'rb') as f:
    graph_def = tf.compat.v1.GraphDef()
    graph_def.ParseFromString(f.read())
    tf.import_graph_def(graph_def, name='')

with tf.compat.v1.Session() as sess:
    # Feed the image_data as input to the graph and get first prediction
    softmax_tensor = sess.graph.get_tensor_by_name('final_result:0')
    
    predictions = sess.run(softmax_tensor, {'DecodeJpeg/contents:0': image_data})
    
    # Sort to show labels of first prediction in order of confidence
    top_k = predictions[0].argsort()[-len(predictions[0]):][::-1]

    node_id = top_k[0]
    human_string = label_lines[node_id]
    score = predictions[0][node_id]
    if score <= 0.75:
        print('negative')
        sys.stdout.flush()
     
    else:
        print(human_string)
        sys.stdout.flush()
try:
    os.remove(image_path)
except:
    print("Image file not found")        
