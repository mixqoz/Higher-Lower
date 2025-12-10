const questions = [
	{
		question: "What's the maximum round time in standard competetive CS:GO2?",
		answers: [
			{ text: "2 minutes", correct: false},
			{text: "1 minute and 55 seconds", correct: true},
			{text: "1 minute and 45 seconds", correct: false},
			{text: "1 minute and 30 seconds", correct: false},
		]
	},
	{
		question: "What is the name of the bombsites on Mirage?",
		answers: [
			{ text: "Mid & Top-Mid", correct: false},
			{text: "A & C", correct: false},
			{text: "A & B", correct: true},
			{text: "B & C", correct: false},
		]
	},
	{
		question: "How many players are there on each team?",
		answers: [
			{ text: "8", correct: false},
			{text: "7", correct: false},
			{text: "6", correct: false},
			{text: "5", correct: true},
		]
	},
	{
		question: "How long does it take to defuse a bomb with a kit?",
		answers: [
			{ text: "10 seconds", correct: false},
			{text: "8 seconds", correct: false},
			{text: "5 seconds", correct: true},
			{text: "3 seconds", correct: false},
		]
	},
	{
		question: "Which rifle has the highest armor penetration?",
		answers: [
			{text: "FAMAS", correct: false},
			{text: "AK-47", correct: false},
			{text: "AWP", correct: true},
			{text: "M4A4", correct: false},
		]
	},
	{
		question: "Which grenade can extinguish a molotov?",
		answers: [
			{text: "Smoke", correct: true},
			{text: "HE Grenade", correct: false},
			{text: "Flashbang", correct: false},
			{text: "Decoy", correct: false},
		]
	},
	{
		question: "How much does a Zeus cost?",
		answers: [
			{text: "500", correct: false},
			{text: "400", correct: false},
			{text: "300", correct: false},
			{text: "200", correct: true},
		]
	},
	{
		question: "Which map has the fastest rotation time between both bombsites?",
		answers: [
			{text: "Aincent", correct: false},
			{text: "Dust II", correct: false},
			{text: "Nuke", correct: true},
			{text: "Anubis", correct: false},
		]
	},
	{
		question: "What is the cost of firing a single M249 bullet?",
		answers: [
			{text: "17", correct: true},
			{text: "15", correct: false},
			{text: "12", correct: false},
			{text: "10", correct: false},
		]
	},
	{
		question: "What is the maximum round loss bonus?",
		answers: [
			{text: "$3500", correct: false},
			{text: "$3400", correct: true},
			{text: "$3300", correct: false},
			{text: "$3200", correct: false},
		]
	}
]

// Script for modal from: https://www.youtube.com/watch?v=XH5OW46yO8I
// Quiz functions from: https://www.youtube.com/watch?v=PBcqGxrr9g8

// Retrive html IDs for use
// For opening and closing the quiz panell
const startBtn = document.getElementById("startBtn");
const modal_Container = document.getElementById("modal_Container");
const closeBtn = document.getElementById("closeBtn");
// Other html IDs
const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answerBtns");
const nextButton = document.getElementById("nextBtn");

// Reveals the modal
startBtn.addEventListener("click", () => {
	modal_Container.classList.add("show");
});

// Hides the modal
closeBtn.addEventListener("click", () => {
    // Resets everything
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = "Next";
    resetState();
	showQuestion();
    modal_Container.classList.remove("show");
});

// Keeps tract of the current question and score
let currentQuestionIndex = 0;
let score = 0;

// Starts the quiz and resets everything from previous sessions
function startQuiz(){
	currentQuestionIndex = 0;
	score = 0;
	nextButton.innerHTML = "Next";
	showQuestion();
}

// Shows questions
function showQuestion(){
    resetState(); // Clears previous answers and hides the Next button

    let currentQuestion = questions[currentQuestionIndex]; // Gets the current question object
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + ". " + currentQuestion.question; // Updates the question text

	// Creats a button tag for each answer and stores its status using dataset.correct in a loop
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerHTML = answer.text;
        button.classList.add("btn");
        answerButtons.appendChild(button);
		if(answer.correct){
			button.dataset.correct = answer.correct;
		}
		button.addEventListener("click", selectAnswer);

    });
}

// Resets the quiz to the start
function resetState(){
	nextButton.style.display = "none";
	while(answerButtons.firstChild){
		answerButtons.removeChild(answerButtons.firstChild);
	}
}

function selectAnswer(e){
	const selectedBtn = e.target; // The clicked button
	const isCorrect = selectedBtn.dataset.correct === "true"; // Checks if it's correct

	// Adds CSS classes "correct" and "incorrect" for visual feedback:
	if(isCorrect){
		selectedBtn.classList.add("correct");
		score++;
	}else{
		selectedBtn.classList.add("incorrect");
	}

	// Disables all the buttons to prevent multiple clicks
	Array.from(answerButtons.children).forEach(button => {
		if(button.dataset.correct === "true"){
			button.classList.add("correct");
		}
		button.disabled = true;
	});

	nextButton.style.display = "block"; // Shows the Next button
}

// Shows result score at the end
function showScore(){
	resetState(); // Clears and hides all buttons
	questionElement.innerHTML = `You scored ${score} out of ${questions.length}!`;
	nextButton.innerHTML = "Play again"; // Changed Next button to Play Again
	nextButton.style.display = "block";
}

// If there are remaining questions, shows them. Otherwise shows the score
function handleNextButton(){
	currentQuestionIndex++; // Inceases the questionIndex
	
	// If more questions remain, shows the next
	if (currentQuestionIndex < questions.length){
		showQuestion();
	}else{ // Shows the final score if there aren't any questions left
		showScore();
	}
}

// When the Next button is clicked, shows all questions
nextButton.addEventListener("click", ()=>{
	if(currentQuestionIndex < questions.length){
		handleNextButton();
	}else{ 
		startQuiz(); // Restarts quiz from the beginning
	}
});

startQuiz(); // Starts the quiz when modal is loaded