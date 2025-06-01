// Auto-open game if URL has hash
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.hash === '#happy-sad') {
        const modal = new bootstrap.Modal(document.getElementById('happySadModal'));
        modal.show();
    } else if (window.location.hash === '#scrambled-words') {
        const modal = new bootstrap.Modal(document.getElementById('scrambledWordsModal'));
        modal.show();
    }
    // Close modal when game is completed (example)
    const gameIframes = document.querySelectorAll('.game-modal iframe');
    gameIframes.forEach(iframe => {
        iframe.contentWindow.addEventListener('gameCompleted', function() {
            const modal = bootstrap.Modal.getInstance(iframe.closest('.modal'));
            modal.hide();
        });
    });
});
