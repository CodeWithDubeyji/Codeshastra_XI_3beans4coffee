document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('tripForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            const arrivalDate = new Date(document.getElementById('arrival_date').value);
            const departureDate = new Date(document.getElementById('departure_date').value);
            if (departureDate <= arrivalDate) {
                e.preventDefault();
                alert('Departure date must be after arrival date.');
            }
        });
    }
});

function sendMessage(planId) {
    const input = document.getElementById('chat-message');
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user-message');
    input.value = '';

    fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan_id: planId, message: message }),
    })
    .then(response => response.json())
    .then(data => {
        let formattedResponse = data.response.replace(/\n/g, '<br>').replace(/-\s\*\*(.*?)\*\*/g, '<strong>$1</strong><br>- ');
        addMessage(formattedResponse, 'bot-message');

        if (data.plan_updated) {
            // Reload the page to reflect the updated plan
            location.reload();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        addMessage('Sorry, something went wrong.', 'bot-message');
    });
}

function addMessage(text, className) {
    const chatMessages = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${className}`;
    messageDiv.innerHTML = text;  // Use innerHTML for formatting
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle Enter key in chat input
document.getElementById('chat-message')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const planId = document.getElementById('plan-id').value;
        sendMessage(planId);
    }
});