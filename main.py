import flask
from flask import Flask, render_template, request, redirect, url_for, session
app = flask.Flask(__name__)
app.config["DEBUG"] = True
@app.route("/")
def index():
    return render_template("main.html")



@app.route("/quiz")
def quiz():
    return render_template("quiz.html")

# Minigames
@app.route("/minigames")
def minigames():
    return render_template("minigames/mainMinigames.html")

@app.route("/minigames/wordle")
def wordle():
    return render_template("minigames/wordle.html")

@app.route("/minigames/memory")
def memory():
    return render_template("minigames/memory.html")

if __name__ == "__main__":
    app.run()
