function isPrime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;

    for (let i = 5; i * i <= n; i += 6) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
    }
    return true;
}

function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function findE(phi_n) {
    let e = 65537; // Standard value
    if (gcd(e, phi_n) === 1) return e;

    // If 65537 doesn't work, find another valid e
    for (e = 3; e < phi_n; e += 2) {
        if (gcd(e, phi_n) === 1) return e;
    }
    throw new Error("Failed to find a valid e.");
}

function findD(e, phi_n) {
    // Modular inverse using Extended Euclidean Algorithm
    let [old_r, r] = [phi_n, e];
    let [old_t, t] = [0, 1];

    while (r !== 0) {
        const quotient = Math.floor(old_r / r);
        [old_r, r] = [r, old_r - quotient * r];
        [old_t, t] = [t, old_t - quotient * t];
    }

    if (old_r > 1) throw new Error("e is not invertible.");
    if (old_t < 0) old_t += phi_n;

    return old_t;
}

// Modular Exponential 
function modExp(base, exp, mod) {
    let result = 1;
    base = base % mod;

    while (exp > 0) {
        if (exp % 2 === 1) {
            result = (result * base) % mod;
        }
        exp = Math.floor(exp / 2); 
        base = (base * base) % mod; 
    }

    return result;
}

function handleKeyGeneration(event) {
    event.preventDefault();

    // Get the input values
    const p = parseInt(document.getElementById("primeP").value);
    const q = parseInt(document.getElementById("primeQ").value);

    // Validate inputs
    if (!isPrime(p) || !isPrime(q)) {
        alert("Both p and q must be prime numbers!");
        return;
    }
    else if (p == q) {
        alert("p and q must be distinct prime numbers!");
        return;
    }

    // Calculate n and phi(n)
    const n = p * q;
    const phi = (p - 1) * (q - 1);

    // Find e and d
    const e = findE(phi);
    const d = findD(e, phi);

    // Save the keys for encryption/decryption
    publicKey = { e, n };
    privateKey = { d, n };

    // Update the Results Section
    document.getElementById("nValue").textContent = n;
    document.getElementById("phiValue").textContent = phi;
    document.getElementById("publicKey").textContent = `(e = ${e}, n = ${n})`;
    document.getElementById("privateKey").textContent = `(d = ${d}, n = ${n})`;

    // Show the Results Box
    document.getElementById("keyResults").classList.remove("is-hidden");
    document.getElementById("encryptionSection").classList.remove("is-hidden");
    document.getElementById("encryptionResults").classList.add("is-hidden");
    document.getElementById("decryptionResults").classList.add("is-hidden");
}

let encryptedData = [];

function encryptMessage() {
    const plaintext = document.getElementById("plaintext").value;

    // Validate the input
    if (!plaintext) {
        alert("Please enter a message to encrypt!");
        return;
    }

    // Encrypt each character of the plaintext
    encryptedData = plaintext.split("").map(char => {
        const m = char.charCodeAt(0); 
        const c = modExp(m, publicKey.e, publicKey.n); 
        return { char, encrypted: c }; 
    });

    document.getElementById("originalMessage").textContent = plaintext;

    // Populate the dynamic table
    const tableBody = document.getElementById("encryptionTable");
    tableBody.innerHTML = ""; // Clear previous results
    encryptedData.forEach(({ char, encrypted }, index) => {
        const m = char.charCodeAt(0);
        const e = publicKey.e;
        const n = publicKey.n;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${char}</td>
            <td>${encrypted}</td>
            <td>
                <strong class="clickable" onclick="showInfo(${m}, '${encrypted}')">${m}<sup>${e}</sup> mod ${n} = ${encrypted}</strong>
            </td>
        `;
        if (index < 5 || plaintext.length <= 6) {
            tableBody.appendChild(row); 
        }
        console.log(char.charCodeAt(0));
    });

    // Handle placeholder row and toggle button
    const toggleButton = document.getElementById("toggleButton");

    if (encryptedData.length > 6) {
        const placeholderRow = document.createElement("tr");
        placeholderRow.id = "placeholderRow";
        placeholderRow.innerHTML = `
            <td>...</td>
            <td>...</td>
            <td></td>
        `;
        tableBody.appendChild(placeholderRow); // Add placeholder row
        toggleButton.classList.remove("is-hidden");
        toggleButton.textContent = "Extend";
    } 
    else {
        toggleButton.classList.add("is-hidden");
    }

    // Display encrypted message
    let encryptedMessage = encryptedData.map(({ encrypted }) => encrypted);

    let displayMessage = "";
    if (encryptedMessage.length >= 5) {
        displayMessage = `[${encryptedMessage[0]}, ${encryptedMessage[1]}, ..., ${encryptedMessage[encryptedMessage.length - 1]}]`;
    } 
    else {
        displayMessage = `[${encryptedMessage.join(", ")}]`;
    }

    document.getElementById("encryptedMessage").textContent = displayMessage;
    document.getElementById("encryptionResults").classList.remove("is-hidden");
    document.getElementById("decryptionResults").classList.add("is-hidden");
}

function showInfo(m, encrypted) {
    const e = publicKey.e;
    const n = publicKey.n;
    const character = String.fromCharCode(m);

    // Prepare the calculation string
    const infoText = `The encrypted value for the character is calculated as: 
                      <strong>c = m<sup>e</sup> mod n</strong>, where:
                      <ul>
                          <li><strong>m</strong> = ${m} (<strong>${character}</strong>'s Character Code)</li>
                          <li><strong>e</strong> = ${e} (Public Exponent)</li>
                          <li><strong>n</strong> = ${n} (Modulus)</li>
                      </ul>
                      Substituting the values: 
                      <strong>c = ${m}<sup>${e}</sup> mod ${n}</strong> = ${encrypted}`;

    document.getElementById("infoText").innerHTML = infoText;
    document.getElementById("infoModal").classList.add("is-active");
}

document.querySelector("#infoModal .modal-close").addEventListener("click", () => {
    document.getElementById("infoModal").classList.remove("is-active");
});

function toggleTable() {
    const tableBody = document.getElementById("encryptionTable");
    const toggleButton = document.getElementById("toggleButton");

    if (toggleButton.textContent === "Extend") {
        const placeholderRow = document.getElementById("placeholderRow");
        if (placeholderRow) placeholderRow.remove();

        encryptedData.slice(5).forEach(({ char, encrypted }) => {
            const m = char.charCodeAt(0);
            const e = publicKey.e;
            const n = publicKey.n;

            // Update the row with the clickable formula
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${char}</td>
                <td>${encrypted}</td>
                <td>
                    <strong class="clickable" onclick="showInfo(${m}, '${encrypted}')">${m}<sup>${e}</sup> mod ${n} = ${encrypted}</strong>
                </td>
            `;
            tableBody.appendChild(row);
        });

        toggleButton.textContent = "Collapse";
    } else {
        while (tableBody.rows.length > 5) {
            tableBody.deleteRow(5);
        }

        const placeholderRow = document.createElement("tr");
        placeholderRow.id = "placeholderRow";
        placeholderRow.innerHTML = `
            <td>...</td>
            <td>...</td>
            <td>...</td>
        `;
        tableBody.appendChild(placeholderRow);

        toggleButton.textContent = "Extend";
    }
}

function decryptMessage() {
    console.log("Decryption started!");

    // Use `encryptedData` for decryption
    const decrypted = encryptedData.map(({ encrypted }) => {
        const m = modExp(encrypted, privateKey.d, privateKey.n); 
        return { encrypted, decrypted: String.fromCharCode(m) }; 
    });

    console.log(decrypted);

    // Populate the Decryption Table
    const tableBody = document.getElementById("decryptionTable");
    tableBody.innerHTML = ""; // Clear previous results
    decrypted.forEach(({ encrypted, decrypted }, index) => {
        const d = privateKey.d;
        const n = publicKey.n;
        const m = encrypted;
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${encrypted}</td>
            <td>${decrypted}</td>
            <td>
                <strong class="clickable" onclick="showDecryptedInfo(${encrypted}, '${decrypted}')">${encrypted}<sup>${d}</sup> mod ${n} = ${decrypted.charCodeAt(0)} (<strong>${decrypted}</strong>'s Character Code)</strong>
            </td>
        `;
        if (index < 5 || encryptedData.length <= 6) {
            tableBody.appendChild(row); 
        }
    });

    const decryptedMessage = decrypted.map(({ decrypted }) => decrypted).join("");  
    document.getElementById("decryptedMessage").textContent = decryptedMessage;

    const toggleButton = document.getElementById("decryptionToggleButton");

    if (decrypted.length > 6 && tableBody.rows.length <= 5) {
        // Add the placeholder row if not all rows are displayed
        const placeholderRow = document.createElement("tr");
        placeholderRow.id = "decryptionPlaceholderRow";
        placeholderRow.innerHTML = `
            <td>...</td>
            <td>...</td>
            <td>...</td>
        `;
        tableBody.appendChild(placeholderRow);
        toggleButton.classList.remove("is-hidden");
        toggleButton.textContent = "Extend";
    } else {
        const placeholderRow = document.getElementById("decryptionPlaceholderRow");
        if (placeholderRow) placeholderRow.remove();
        toggleButton.classList.add("is-hidden");
    }

    document.getElementById("decryptionResults").classList.remove("is-hidden");
}

document.querySelector("#decryptionInfoModal .modal-close").addEventListener("click", () => {
    document.getElementById("decryptionInfoModal").classList.remove("is-active");
});

function showDecryptedInfo(encrypted, decrypted) {
    const d = privateKey.d;
    const n = publicKey.n;
    const decryptedCharCode = decrypted.charCodeAt(0);  

    // Prepare the calculation string for decryption
    const infoText = `
        The decrypted value for the character is calculated as: 
        <strong>m = c<sup>d</sup> mod n</strong>, where:
        <ul>
            <li><strong>c</strong> = ${encrypted} (Encrypted Value)</li>
            <li><strong>d</strong> = ${d} (Private Exponent)</li>
            <li><strong>n</strong> = ${n} (Modulus)</li>
        </ul>
        Substituting the values: 
        <strong>m = ${encrypted}<sup>${d}</sup> mod ${n}</strong> = ${decryptedCharCode} (<strong>${decrypted}</strong>'s Character Code)`;

    document.getElementById("decryptionInfoText").innerHTML = infoText;
    document.getElementById("decryptionInfoModal").classList.add("is-active");
}

document.querySelector(".modal-close").addEventListener("click", () => {
    document.getElementById("decryptionInfoModal").classList.remove("is-active");
});

function toggleDecryptionTable() {
    const tableBody = document.getElementById("decryptionTable");
    const toggleButton = document.getElementById("decryptionToggleButton");

    if (toggleButton.textContent === "Extend") {
        const placeholderRow = document.getElementById("decryptionPlaceholderRow");
        if (placeholderRow) placeholderRow.remove();

        encryptedData.slice(5).forEach(({ encrypted }) => {
            const decryptedValue = String.fromCharCode(modExp(encrypted, privateKey.d, privateKey.n)); // Decrypt value
            const d = privateKey.d;
            const n = publicKey.n;
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${encrypted}</td>
                <td>${decryptedValue}</td>
                <td>
                    <strong class="clickable" onclick="showDecryptedInfo(${encrypted}, '${decryptedValue}')">${encrypted}<sup>${d}</sup> mod ${n} = ${decryptedValue.charCodeAt(0)} (<strong>${decryptedValue}</strong>'s Character Code)</strong>
                </td>
            `;
            tableBody.appendChild(row);
        });

        toggleButton.textContent = "Collapse";
    } else {
        while (tableBody.rows.length > 5) {
            tableBody.deleteRow(5); 
        }

        const placeholderRow = document.createElement("tr");
        placeholderRow.id = "decryptionPlaceholderRow";
        placeholderRow.innerHTML = `
            <td>...</td>
            <td>...</td>
            <td>...</td>
        `;
        tableBody.appendChild(placeholderRow);

        toggleButton.textContent = "Extend";
    }
}

function toggleExpansion() {
    const expandedBubbles = document.getElementById('expandedBubbles');
    if (expandedBubbles.classList.contains('hidden')) {
        expandedBubbles.classList.remove('hidden');
    } else {
        expandedBubbles.classList.add('hidden');
    }
}

const floatingBtn = document.querySelector(".floating-btn");

floatingBtn.addEventListener("click", () => {
    floatingBtn.classList.toggle("active");
});

document.addEventListener("click", (e) => {
    if (!floatingBtn.contains(e.target)) {
        floatingBtn.classList.remove("active");
    }
});