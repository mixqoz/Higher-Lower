import flask
from flask import Flask, render_template, request, redirect, url_for, session
from api import getrandomitem
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = "SECRET_KEY"
DEFAULT_SECRET_KEY = "change-me-in-production"
app = flask.Flask(__name__)
app.config["DEBUG"] = True
# Required for using sessions
app.secret_key = os.getenv(SECRET_KEY, DEFAULT_SECRET_KEY)

def _pick_valid_pair(max_attempts: int = 50):
    # Returns a tuple: (item1, item2, price1_float, price2_float)
    item1 = getrandomitem()
    item2 = getrandomitem()
    p1 = float(item1.get("price"))
    p2 = float(item2.get("price"))
    return item1, item2, p1, p2


def _pick_valid_item():
    """Pick a single random item with a parseable price.
    Returns a tuple: (item, price_float)
    """

    item = getrandomitem()
    price = float(item.get("price"))
    return item, price

@app.route("/")
def index():
    # Initialize score on first visit only
    if "score" not in session:
        session["score"] = 0

    # Decide the next pair: if we have a carry-over left item from a correct
    # guess, use it as the new left and pick a fresh right; otherwise pick a new pair.
    carried_left = session.get("next_left")
    if isinstance(carried_left, dict):
        left_item = carried_left
        left_price = float(left_item.get("price"))
        right_item, right_price = _pick_valid_item()
        # one-time carry
        session.pop("next_left", None)
    else:
        left_item, right_item, left_price, right_price = _pick_valid_pair()

    # Remember numeric prices and the actual items for click validation/flow
    session["pair"] = {"left_price": left_price, "right_price": right_price}
    session["last_left_item"] = left_item
    session["last_right_item"] = right_item

    return render_template("main.html", item1=left_item, item2=right_item, score=session["score"])

# Clicking either item should increment the score by 1 and load new items
@app.route("/item1")
def item1_click():
    # Correct if LEFT item has higher price than RIGHT
    pair = session.get("pair")
    left = right = None
    if pair and isinstance(pair, dict):
        left = pair.get("left_price")
        right = pair.get("right_price")

    # Server-side safeguard: if prices missing (e.g., due to race with /reset_score),
    # reconstruct from last shown items.
    if not isinstance(left, (int, float)) or not isinstance(right, (int, float)):
        last_left = session.get("last_left_item")
        last_right = session.get("last_right_item")
        if isinstance(last_left, dict) and isinstance(last_right, dict):
            left = float(last_left.get("price"))
            right = float(last_right.get("price"))

    if isinstance(left, (int, float)) and isinstance(right, (int, float)):
        if left > right:
            session["score"] = session.get("score", 0) + 1
            # On correct: next round should set item1 = previous item2
            last_right = session.get("last_right_item")
            if isinstance(last_right, dict):
                session["next_left"] = last_right
        elif left < right:
            # Wrong guess -> reset score
            session["score"] = 0
            # Clear any carry so next is fully random
            session.pop("next_left", None)
        else:
            # Tie -> no change, but treat next as random
            session.pop("next_left", None)
    return redirect(url_for("index"))


@app.route("/item2")
def item2_click():
    # Correct if RIGHT item has higher price than LEFT
    pair = session.get("pair")
    left = right = None
    if pair and isinstance(pair, dict):
        left = pair.get("left_price")
        right = pair.get("right_price")

    # Server-side safeguard: reconstruct prices from last items if needed
    if not isinstance(left, (int, float)) or not isinstance(right, (int, float)):
        last_left = session.get("last_left_item")
        last_right = session.get("last_right_item")
        if isinstance(last_left, dict) and isinstance(last_right, dict):
            left = float(last_left.get("price"))
            right = float(last_right.get("price"))

    if isinstance(left, (int, float)) and isinstance(right, (int, float)):
        if right > left:
            session["score"] = session.get("score", 0) + 1
            # On correct: next round should set item1 = previous item2
            last_right = session.get("last_right_item")
            if isinstance(last_right, dict):
                session["next_left"] = last_right
        elif right < left:
            # Wrong guess -> reset score
            session["score"] = 0
            # Clear any carry so next is fully random
            session.pop("next_left", None)
        else:
            # Tie -> no change, but treat next as random
            session.pop("next_left", None)
    return redirect(url_for("index"))
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

# --- API: Reset score when page is exited -----------------------------------
@app.route("/reset_score", methods=["POST"])
def reset_score():
    """Reset the current session score.

    This endpoint is intended to be called via navigator.sendBeacon/fetch with
    keepalive from the client when the page is being exited.
    """
    # Only reset the score. Do NOT clear current round state here because
    # this endpoint can race with in-app navigations; preserving the current
    # pair allows click handlers to function correctly even if this fires.
    session["score"] = 0
    # Optionally clear carry-over so a fresh chain starts after exit.
    session.pop("next_left", None)
    return ("", 204)

if __name__ == "__main__":
    app.run()
