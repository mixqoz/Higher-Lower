import flask
from flask import Flask, render_template, request, redirect, url_for, session
app = flask.Flask(__name__)
app.config["DEBUG"] = True
@app.route("/")
def index():
    return render_template("main.html")