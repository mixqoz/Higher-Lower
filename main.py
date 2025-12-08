import flask
from flask import Flask, render_template, request, redirect, url_for, session
app = flask.Flask(__name__)
app.config["DEBUG"] = True
@app.route("/")
def index():
    return render_template("main.html")
@app.route("/leaderboard")
def leaderboard():
    return render_template("leaderboard.html")

@app.route("/quiz")
def quiz():
    return render_template("quiz.html")

@app.route("/faq")
def faq():
    return render_template("faq.html")

@app.route("/guide")
def guide():
    return render_template("guide.html")

# Minigames
@app.route("/minigames")
def minigames():
    return render_template("minigames/mainMinigames.html")

@app.route("/wordle")
def wordle():
    return render_template("minigames/wordle.html")


@app.route("/minigames/memoryGame")
def memory_game():
    return render_template("minigames/memoryGame.html")

if __name__ == "__main__":
    app.run()
