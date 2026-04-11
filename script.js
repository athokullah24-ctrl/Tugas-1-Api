const searchButton = document.querySelector('#button-addon2');
const inputKeyword = document.querySelector('.input-keyword');
const resultContainer = document.querySelector('.result'); 

searchButton.addEventListener('click', function() {
    // Alpha Vantage untuk Crypto butuh SINGKATAN/SIMBOL koin (misal: BTC, ETH, DOGE)
    const keyword = inputKeyword.value.toUpperCase().trim();
    
    if (!keyword) {
        resultContainer.innerHTML = '<p style="color: red;">Masukkan simbol aset (misal: BTC)!</p>';
        return;
    }

    resultContainer.innerHTML = '<p>Sedang mengambil data pasar...</p>';

    // 1. INI DIA TEMPAT API KEY KAMU DISIMPAN 🔑
    const apiKey = 'M4FWAFD00OM5XF12'; 
    
    // 2. Tendang bola ke Endpoint API Alpha Vantage khusus Crypto
    const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${keyword}&to_currency=USD&apikey=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // 3. Cek apakah balasan dari Alpha Vantage sukses
            if (data["Realtime Currency Exchange Rate"]) {
                const cryptoData = data["Realtime Currency Exchange Rate"];
                
                const name = cryptoData["2. From_Currency Name"];
                const symbol = cryptoData["1. From_Currency Code"];
                const priceUSD = parseFloat(cryptoData["5. Exchange Rate"]);

                // 4. Tampilkan ke Papan Skor (HTML)
                resultContainer.innerHTML = `
                    <h2 style="margin-bottom: 15px;">Pasar: ${name} (${symbol})</h2>
                    <h5><span class="temp">Harga Global : $${priceUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></h5>
                    <p style="margin-top: 15px; color: #0d6efd; font-size: 14px;">
                        ✓ Data berhasil ditarik menggunakan API Key Alpha Vantage
                    </p>
                `;
            } else if (data["Note"] || data["Information"]) {
                // Tangkap error jika limit harian API Key gratisanmu sudah habis
                resultContainer.innerHTML = `<h4 style="color: yellow;">Limit API Key tercapai! Silakan tunggu beberapa saat lagi.</h4>`;
            } else {
                // Jika salah ketik simbol
                resultContainer.innerHTML = `<h4 style="color: red;">Simbol "${keyword}" tidak ditemukan! Gunakan singkatan seperti "BTC" atau "ETH".</h4>`;
            }
        })
        .catch(error => {
            resultContainer.innerHTML = `<h4 style="color: red;">Terjadi gangguan koneksi ke bursa Alpha Vantage!</h4>`;
        });

    inputKeyword.value = '';
});
