#!/usr/bin/env python

from flask import Flask,render_template

app = Flask(__name__)
app.secret_key = 't'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/test')
def test():
    return render_template('test_canvas_over_socket.html')

@app.route('/modal')
def modal():
    return  render_template('modal.html');

if __name__ == "__main__":
    app.run('',9999, True)
