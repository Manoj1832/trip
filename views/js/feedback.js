
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('feedbackForm');
    const formContainer = document.getElementById('formContainer');
    const submittedMessage = document.getElementById('submittedMessage');

    const offensiveWords = [
        "stupid", "idiot", "dumb", "nonsense", "useless", "hate",
        "sucks", "worst", "garbage", "crap", "moron", "jerk",
        "terrible", "nasty", "loser", "shut up", "fool", "shit",
        "damn", "bastard", "hell", "screw", "lame", "retard",
        "bloody", "freak", "disgusting", "suck", "trash", "clown"
    ];

    function containsOffensiveWords(text) {
        const lowerText = text.toLowerCase();
        return offensiveWords.some(word => lowerText.includes(word));
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const feedback = document.getElementById('feedback').value.trim();
        const rating = document.querySelector('input[name="rating"]:checked');

        if (!name || !feedback || !rating) {
            alert("Please fill all fields and select a rating.");
            return;
        }

        if (containsOffensiveWords(feedback)) {
            alert("Your feedback contains inappropriate words. Please revise it.");
            return;
        }

        const ratingValue = parseInt(rating.value);

        try {
            const res = await fetch("http://localhost:5000/api/feedback", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name, rating: ratingValue, feedback })
            });

            const data = await res.json();

            if (res.ok) {
                formContainer.style.display = 'none';
                submittedMessage.style.display = 'block';
                form.reset();
            } else {
                alert(data.message || "Error submitting feedback.");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to submit feedback. Server error.");
        }
    });

    window.goBack = function () {
        submittedMessage.style.display = 'none';
        formContainer.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.goHome = function () {
        window.location.href = "index.html"; // Adjust this if your homepage URL differs
    };
});
